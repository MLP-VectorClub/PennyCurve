import { createBotClient } from '@went.tf/discord-bot-framework/client';
import { getGitData } from '@went.tf/discord-bot-framework/utils';
import { Client, GatewayIntentBits } from 'discord.js';
import { env } from '../env.js';
import { InteractionHandlerContext } from '../types/interaction-handler.context.js';
import { handleInteraction } from './handle-interaction.js';

const handleReady = (context: InteractionHandlerContext) => async (client: Client<true>) => {
  const clientUser = client.user;
  if (!clientUser) throw new Error('Expected `client.user` to be defined');
  context.logger.log(`Logged in as ${clientUser.tag}!`);

  const versionString = env.LOCAL ? 'a local version' : await getGitData(context)
    .then(({ hash }) => `version ${hash}`)
    .catch(() => 'an unknown version');
  clientUser.setActivity(versionString);
};

export const createClient = async (context: InteractionHandlerContext): Promise<void> => {
  await createBotClient({
    intents: [GatewayIntentBits.Guilds],
    token: env.DISCORD_BOT_TOKEN,
    onReady: handleReady(context),
    onInteraction: (interaction) => handleInteraction(interaction, context),
  });
};
