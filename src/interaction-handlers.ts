import {
  ApplicationCommandType,
  ButtonInteraction, ChatInputCommandInteraction, CommandInteraction, Interaction, User,
} from 'discord.js';
import { env } from './env.js';
import { commandMap, isKnownCommandInteraction } from './commands.js';
import { EmojiCharacters } from './constants/emoji-characters.js';
import { buttonMap, isKnownButtonInteraction } from './buttons.js';
import { isSameObject } from './utils/client-utils.js';
import {
  getUserIdentifier,
  stringifyChannelName,
  stringifyOptionsData,
} from './utils/messaging.js';

const ellipsis = '…';

const processingErrorMessageFactory = (user: User): string => {
  const isUserBotOwner = isSameObject(user, { id: env.BOT_OWNER_ID });
  const lookInto = `${isUserBotOwner ? 'you should' : `tell <@${env.BOT_OWNER_ID}> to`} look into this`;
  return `${EmojiCharacters.OCTAGONAL_SIGN} There was an unexpected error while processing this interaction (${lookInto})`;
};

const handleInteractionError = async (interaction: CommandInteraction | ButtonInteraction) => {
  if (!interaction.replied) {
    await interaction.reply({
      content: processingErrorMessageFactory(interaction.user),
      ephemeral: true,
    });
    return;
  }
  // If we already replied, we need to do some editing on the existing message to include the error
  const oldReplyContent = (await interaction.fetchReply()).content;
  const messageSuffix = `\n\n${processingErrorMessageFactory(interaction.user)}`;
  let newContent = oldReplyContent + messageSuffix;
  const maximumMessageLength = 2000;
  if (newContent.length > maximumMessageLength) {
    newContent = oldReplyContent.substring(0, maximumMessageLength - messageSuffix.length - ellipsis.length) + ellipsis + messageSuffix;
  }
  await interaction.editReply({
    content: newContent,
  });
};

const isChatInputCommandInteraction = (interaction: CommandInteraction): interaction is ChatInputCommandInteraction => {
  return interaction.commandType === ApplicationCommandType.ChatInput;
};

export const handleCommandInteraction = async (interaction: CommandInteraction): Promise<void> => {
  if (!isChatInputCommandInteraction(interaction)) {
    await interaction.reply(`Unsupported command type ${interaction.commandName}`);
    return;
  }

  if (!isKnownCommandInteraction(interaction)) {
    await interaction.reply(`Unknown command ${interaction.commandName}`);
    return;
  }

  const {
    commandName, user, options, channel,
  } = interaction;
  const command = commandMap[commandName];

  const optionsString = options.data.length > 0
    ? ` ${stringifyOptionsData(interaction.options.data)}`
    : '';
  console.log(`${getUserIdentifier(user)} ran /${commandName}${optionsString} in ${stringifyChannelName(channel)}`);

  try {
    await command.handle(interaction);
  } catch (e) {
    console.error(`Error while responding to command interaction (commandName=${commandName})`, e);
    await handleInteractionError(interaction);
  }
};

export const handleButtonInteraction = async (interaction: Interaction): Promise<void> => {
  if (!interaction.isButton()) return;

  if (!isKnownButtonInteraction(interaction)) {
    await interaction.reply({
      content: `Unknown button ${interaction.customId}`,
      ephemeral: true,
    });
    return;
  }

  const { customId, user } = interaction;
  const button = buttonMap[customId];

  console.log(`${getUserIdentifier(user)} pressed button ${customId}`);

  try {
    await button.handle(interaction);
  } catch (e) {
    console.error(`Error while responding to button interaction (customId=${customId})`, e);
    await handleInteractionError(interaction);
  }
};
