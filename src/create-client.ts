import { Client, GatewayIntentBits, InteractionType } from 'discord.js';
import { env } from './env.js';
import { handleButtonInteraction, handleCommandInteraction } from './interaction-handlers.js';
import { getGitData } from './utils/get-git-data.js';

const handleReady = async (client: Client<true>) => {
  const clientUser = client.user;
  if (!clientUser) throw new Error('Expected `client.user` to be defined');
  console.log(`Logged in as ${clientUser.tag}!`);

  const versionString = env.LOCAL ? 'a local version' : await getGitData()
    .then(({ hash }) => `version ${hash}`)
    .catch(() => 'an unknown version');
  clientUser.setActivity(versionString);
};

export const createClient = async (): Promise<void> => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.on('ready', handleReady);

  client.on('interactionCreate', async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
      await handleCommandInteraction(interaction);
      return;
    }
    if (interaction.isButton()) {
      await handleButtonInteraction(interaction);
      return;
    }

    throw new Error(`Unhandled interaction of type ${interaction.type}`);
  });

  await client.login(env.DISCORD_BOT_TOKEN);
};
