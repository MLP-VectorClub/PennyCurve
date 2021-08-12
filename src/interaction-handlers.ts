import { ButtonInteraction, CommandInteraction, Interaction } from 'discord.js';
import { env } from './env.js';
import { commandMap, isKnownCommand } from './commands.js';
import { EmojiCharacters } from './constants/emoji-characters.js';
import { buttonMap, isKnownButton } from './buttons.js';

const processingErrorMessage = `${EmojiCharacters.OCTAGONAL_SIGN} There was an unexpected error while processing this interaction (tell <@${env.BOT_OWNER_ID}> to look into this)`;
const ellipsis = '…';

const handleInteractionError = async (interaction: CommandInteraction | ButtonInteraction) => {
  if (!interaction.replied) {
    await interaction.reply(processingErrorMessage);
    return;
  }
  // If we already replied, we need to do some editing on the existing message to include the error
  const oldReplyContent = (await interaction.fetchReply()).content;
  const messageSuffix = `\n\n${processingErrorMessage}`;
  let newContent = oldReplyContent + messageSuffix;
  const maximumMessageLength = 2000;
  if (newContent.length > maximumMessageLength) {
    newContent = oldReplyContent.substring(0, maximumMessageLength - messageSuffix.length - ellipsis.length) + ellipsis + messageSuffix;
  }
  await interaction.editReply({
    content: newContent,
  });
};

export const handleCommandInteraction = async (interaction: CommandInteraction): Promise<void> => {
  const { commandName } = interaction;

  if (!isKnownCommand(commandName)) {
    await interaction.reply(`Unknown command ${commandName}`);
    return;
  }

  const command = commandMap[commandName];

  try {
    await command.handle(interaction);
  } catch (e) {
    console.error(`Error while responding to command interaction (commandName=${commandName})`, e);
    await handleInteractionError(interaction);
  }
};

export const handleButtonInteraction = async (interaction: Interaction): Promise<void> => {
  if (!interaction.isButton()) return;

  const buttonId = interaction.customId;

  if (!isKnownButton(buttonId)) {
    await interaction.reply({
      content: `Unknown button ${buttonId}`,
      ephemeral: true,
    });
    return;
  }

  const button = buttonMap[buttonId];

  try {
    await button.handle(interaction);
  } catch (e) {
    console.error(`Error while responding to button interaction (buttonId=${buttonId})`, e);
    await handleInteractionError(interaction);
  }
};
