import {
  RESTGetAPIGuildRolesResult,
  RESTPutAPIApplicationGuildCommandsResult,
  RESTPutAPIGuildApplicationCommandsPermissionsJSONBody,
  Routes,
} from 'discord-api-types/rest/v9';
import {
  APIApplicationCommandPermission,
  APIRole,
  ApplicationCommandPermissionType,
} from 'discord-api-types';
import { REST } from '@discordjs/rest';
import { commandMap, commands, isKnownCommand } from '../commands.js';
import { env } from '../env.js';
import { ServerRoleName } from '../constants/server-role-name.js';

const rest = new REST({
  version: '9',
  userAgentAppendix: env.UA_STRING,
}).setToken(env.DISCORD_BOT_TOKEN);

const getServerRoles = (() => {
  let serverRolesCache: RESTGetAPIGuildRolesResult | undefined;
  return async (): Promise<RESTGetAPIGuildRolesResult> => {
    if (!serverRolesCache) {
      serverRolesCache = await rest.get(Routes.guildRoles(env.SERVER_ID)) as RESTGetAPIGuildRolesResult;
    }

    return serverRolesCache;
  };
})();

const getRoleIdByName = async (name: ServerRoleName): Promise<APIRole['id']> => {
  const serverRoles = await getServerRoles();

  const foundRole = serverRoles.find((role) => role.name === name);
  if (!foundRole) throw new Error(`Could not find role ${name} in server's roles`);

  return foundRole.id;
};

export const updateGuildCommands = async (clientId = env.DISCORD_CLIENT_ID, serverId = env.SERVER_ID, botOwnerId = env.BOT_OWNER_ID): Promise<void> => {
  try {
    console.log(`Started refreshing application (/) commands (SERVER_ID=${serverId})`);

    const putCommands = await rest.put(
      Routes.applicationGuildCommands(clientId, serverId),
      { body: commands },
    ) as RESTPutAPIApplicationGuildCommandsResult;

    const commandPermissions: RESTPutAPIGuildApplicationCommandsPermissionsJSONBody = [];

    await Promise.all(putCommands.map(async (command) => {
      const commandName = command.name;

      if (isKnownCommand(commandName)) {
        const botCommand = commandMap[commandName];
        if ('permissions' in botCommand) {
          const botCommandPermissions = botCommand.permissions;
          if (botCommandPermissions) {
            commandPermissions.push({
              id: command.id,
              permissions: await Promise.all(botCommandPermissions.map(async (perm) => {
                const id: APIApplicationCommandPermission['id'] = perm.target === true
                  ? botOwnerId
                  : await getRoleIdByName(perm.target);
                const type = perm.target === true
                  ? ApplicationCommandPermissionType.User
                  : ApplicationCommandPermissionType.Role;
                return ({
                  permission: !perm.revoke,
                  id,
                  type,
                });
              })),
            });
          }
        }
      }
    }));

    if (commandPermissions.length > 0) {
      rest.put(
        Routes.guildApplicationCommandsPermissions(clientId, serverId),
        {
          body: commandPermissions,
        },
      );
    }

    console.log(`Successfully reloaded application (/) commands (SERVER_ID=${serverId})`);
  } catch (error) {
    console.log(`Failed to reloaded application (/) commands (SERVER_ID=${serverId})`);
    console.error(error);
    process.exit(1);
  }
};
