import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { config } from 'dotenv';
import {Interaction} from "discord.js";

config();

const {
  DISCORD_BOT_TOKEN,
  DISCORD_CLIENT_ID,
  SERVER_ID,
} = process.env;

if (!DISCORD_BOT_TOKEN) throw new Error('DISCORD_BOT_TOKEN environment variable not set');
if (!DISCORD_CLIENT_ID) throw new Error('DISCORD_CLIENT_ID environment variable not set');
if (!SERVER_ID) throw new Error('SERVER_ID environment variable not set');

const commands = [{
  name: 'ping',
  description: 'Replies with Pong!',
}];

const rest = new REST({ version: '9' }).setToken(DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(DISCORD_CLIENT_ID, SERVER_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.login(DISCORD_BOT_TOKEN);
