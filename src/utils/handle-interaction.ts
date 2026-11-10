import {
  dispatchChatInputCommand,
  dispatchComponent,
  handleInteractionError,
} from '@went.tf/discord-bot-framework/interactions';
import { getUserIdentifier, stringifyChannelName, stringifyOptionsData } from '@went.tf/discord-bot-framework/utils';
import { MessageFlags } from 'discord-api-types/v10';
import { Interaction, User } from 'discord.js';
import { componentRegistry } from '../buttons.js';
import { chatInputCommandRegistry } from '../commands.js';
import { EmojiCharacters } from '../constants/emoji-characters.js';
import { env } from '../env.js';
import { InteractionHandlerContext } from '../types/interaction-handler.context.js';
import { isSameObject } from './client-utils.js';

const processingErrorMessageFactory = (user: User): string => {
  const isUserBotOwner = isSameObject(user, { id: env.BOT_OWNER_ID });
  const lookInto = `${isUserBotOwner ? 'you should' : `tell <@${env.BOT_OWNER_ID}> to`} look into this`;
  return `${EmojiCharacters.OCTAGONAL_SIGN} There was an unexpected error while processing this interaction (${lookInto})`;
};

const onDispatchError = async (interaction: unknown, context: InteractionHandlerContext, error: unknown) => {
  context.logger.error('Error while responding to interaction', error);
  const candidate = interaction as Interaction;
  if (!candidate.isRepliable()) return;

  await handleInteractionError(candidate, context, {
    buildMessage: () => processingErrorMessageFactory(candidate.user),
  });
};

export const handleInteraction = async (interaction: Interaction, baseContext: InteractionHandlerContext): Promise<void> => {
  const context: InteractionHandlerContext = {
    ...baseContext,
    logger: baseContext.logger.nest(`Interaction#${interaction.id}`),
  };

  if (interaction.isChatInputCommand()) {
    const { commandName, user, options, channel } = interaction;
    const optionsString = options.data.length > 0 ? ` ${stringifyOptionsData(options.data)}` : '';
    context.logger.log(`${getUserIdentifier(user)} ran /${commandName}${optionsString} in ${stringifyChannelName(channel)}`);

    await dispatchChatInputCommand(interaction, context, {
      commands: chatInputCommandRegistry.byName,
      onUnknownCommand: async (unknownInteraction) => {
        await unknownInteraction.reply(`Unknown command ${unknownInteraction.commandName}`);
      },
      onError: onDispatchError,
    });
    return;
  }

  if (interaction.isButton()) {
    context.logger.log(`${getUserIdentifier(interaction.user)} pressed button ${interaction.customId}`);

    await dispatchComponent(interaction, context, {
      components: componentRegistry.byName,
      onUnknownComponent: async (unknownInteraction) => {
        await unknownInteraction.reply({
          content: `Unknown button ${unknownInteraction.customId}`,
          flags: MessageFlags.Ephemeral,
        });
      },
      onError: onDispatchError,
    });
    return;
  }

  if (interaction.isCommand()) {
    await interaction.reply(`Unsupported command type ${interaction.commandName}`);
    return;
  }

  throw new Error(`Unhandled interaction of type ${interaction.type}`);
};
