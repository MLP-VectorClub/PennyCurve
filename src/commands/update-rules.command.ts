import { ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { BotCommand } from '../bot-interaction-types.js';
import { makeButton } from '../buttons.js';
import { BotButtonId } from '../constants/bot-button-id.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';
import { ServerChannelName } from '../constants/server-channel-name.js';
import { findServerTextChannelByName, getServer } from '../utils/client-utils.js';
import { loadAllMessages, sendMessageSlices } from '../utils/messaging.js';
import { compileRulesText } from '../utils/rules.js';

export const updateRulesCommand: BotCommand = {
  definition: {
    description: `Updates the rules in the #${ServerChannelName.WELCOME} channel`,
  },
  async handle(interaction) {
    const actionPrefix = 'Updating rules: ';
    await interaction.reply(`${actionPrefix} Fetching #${ServerChannelName.WELCOME} channel`);

    const clientServer = getServer(interaction.client);
    const welcomeChannel = findServerTextChannelByName(clientServer, ServerChannelName.WELCOME);

    await interaction.editReply(`${actionPrefix} Loading all messages in ${welcomeChannel}`);

    const existingWelcomeMessages = await loadAllMessages(welcomeChannel);

    await interaction.editReply(`${actionPrefix} Preparing rules text`);

    const rulesText = await compileRulesText(interaction.client);

    await interaction.editReply(`${actionPrefix} Sending new messages to ${welcomeChannel}`);

    await sendMessageSlices(welcomeChannel, rulesText);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      makeButton(BotButtonId.AGREE_TO_RULES),
    );

    await welcomeChannel.send({
      content: 'Please press the button below to reveal the rest of the channels on our server and start chatting.',
      components: [row],
    });

    await interaction.editReply(`${actionPrefix} Rules updated, purging old messages`);

    // Clean up old messages
    await Promise.all(existingWelcomeMessages.map((m) => m.delete()));

    await interaction.editReply(`${EmojiCharacters.WHITE_HEAVY_CHECK_MARK} Rules have been updated successfully`);
  },
};
