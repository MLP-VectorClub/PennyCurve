import { GuildMember, MessageFlags } from 'discord.js';
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

export const roleCommand: BotCommand<'role'> = {
  name: 'role',
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
          flags: MessageFlags.Ephemeral,
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
    await interaction.reply({ content: responseParts.join(' '), flags: MessageFlags.Ephemeral });
  },
};
