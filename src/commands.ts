import { createChatInputCommandRegistry } from '@went.tf/discord-bot-framework/interactions';
import { ageCommand } from './commands/age.command.js';
import { casualCommand } from './commands/casual.command.js';
import { colorGuideCommand } from './commands/color-guide.command.js';
import { derpibooruCommand } from './commands/derpibooru.command.js';
import { fixNickCommand } from './commands/fixnick.command.js';
import { joinedCommand } from './commands/joined.command.js';
import { niceCommand } from './commands/nice.command.js';
import { pingCommand } from './commands/ping.command.js';
import { rektCommand } from './commands/rekt.command.js';
import { roleCommand } from './commands/role.command.js';
import { sayCommand } from './commands/say.command.js';
import { tutorialCommand } from './commands/tutorial.command.js';
import { updateRulesCommand } from './commands/update-rules.command.js';
import { versionCommand } from './commands/version.command.js';
import { welcomeCommand } from './commands/welcome.command.js';
import { yesCommand } from './commands/yes.command.js';

// Each command's wire definition (description, options, …) lives in commands.json
export const chatInputCommandRegistry = createChatInputCommandRegistry([
  ageCommand,
  casualCommand,
  colorGuideCommand,
  derpibooruCommand,
  fixNickCommand,
  joinedCommand,
  niceCommand,
  pingCommand,
  rektCommand,
  roleCommand,
  sayCommand,
  tutorialCommand,
  updateRulesCommand,
  versionCommand,
  welcomeCommand,
  yesCommand,
]);
