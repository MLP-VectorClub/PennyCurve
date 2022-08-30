import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { GuildMember } from 'discord.js';
import { BotCommand } from '../bot-interaction-types.js';
import { ServerRoleName } from '../constants/server-role-name.js';
import {
  findServerMember,
  findServerRoleByName,
  getServer,
  isSameObject,
  serverMemberHasRole,
} from '../utils/client-utils.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';

enum OptionName {
  ROLE = 'role',
  MEMBER = 'member',
  ACTION = 'action',
}

enum ActionOptions {
  ADD = 'add',
  REMOVE = 'remove',
  TOGGLE = 'toggle',
}

export const roleCommand: BotCommand = {
  definition: {
    description: 'Add or remove self-assignable roles',
    options: [
      {
        name: OptionName.ROLE,
        type: ApplicationCommandOptionType.String,
        description: 'The role you would like to assign or remove',
        choices: [
          {
            name: ServerRoleName.INKSCAPE,
            value: ServerRoleName.INKSCAPE,
          },
          {
            name: ServerRoleName.ILLUSTRATOR,
            value: ServerRoleName.ILLUSTRATOR,
          },
        ],
        required: true,
      },
      {
        name: OptionName.MEMBER,
        type: ApplicationCommandOptionType.User,
        description: '**Staff only!** The user whose roles you want to change',
        required: false,
      },
      {
        name: OptionName.ACTION,
        type: ApplicationCommandOptionType.String,
        description: `What to do with the provided role (default: \`${ActionOptions.TOGGLE}\`)`,
        choices: [
          {
            name: ActionOptions.TOGGLE,
            value: ActionOptions.TOGGLE,
          },
          {
            value: ActionOptions.ADD,
            name: ActionOptions.ADD,
          },
          {
            value: ActionOptions.REMOVE,
            name: ActionOptions.REMOVE,
          },
        ],
        required: false,
      },
    ],
  },
  async handle(interaction) {
    const { client, commandName, options } = interaction;
    const server = getServer(client);
    const serverMember = findServerMember(interaction);

    let targetMember = serverMember;
    const memberOptionValue = options.getMember(OptionName.MEMBER);
    if (memberOptionValue && memberOptionValue instanceof GuildMember) {
      const staffRole = findServerRoleByName(server, ServerRoleName.STAFF);
      const isStaff = serverMemberHasRole(serverMember, staffRole);
      if (!isStaff) {
        await interaction.reply({
          content: `Only ${staffRole} members are allowed to use the ${OptionName.MEMBER} option`,
          ephemeral: true,
        });
        return;
      }

      targetMember = memberOptionValue;
    }

    const targetRoleName = options.getString(OptionName.ROLE, true) as ServerRoleName;
    const targetRole = findServerRoleByName(server, targetRoleName);
    const targetHasRole = serverMemberHasRole(targetMember, targetRole);

    let action = (options.getString(OptionName.ACTION) as ActionOptions || ActionOptions.TOGGLE);
    if (action === ActionOptions.TOGGLE) {
      action = targetHasRole ? ActionOptions.REMOVE : ActionOptions.ADD;
    }

    if (action === ActionOptions.ADD) {
      await targetMember.roles.add(targetRole, `Self-assigned via ${commandName} command`);
    } else {
      await targetMember.roles.remove(targetRole, `Removed via ${commandName} command`);
    }

    const sameUser = isSameObject(serverMember, targetMember);
    const responseParts = [
      EmojiCharacters.WHITE_HEAVY_CHECK_MARK,
      sameUser ? 'You' : targetMember.toString(),
      action === ActionOptions.ADD ? 'now' : 'no longer',
      sameUser ? 'have' : 'has',
      `the ${targetRole} role`,
    ];
    await interaction.reply({ content: responseParts.join(' '), ephemeral: true });
  },
};
