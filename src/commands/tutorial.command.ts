import { BotCommand } from '../bot-interaction-types.js';

enum OptionName {
  SUB_FOLDER = 'sub-folder',
}

enum AppNames {
  ANIMATION = 'anim',
  ILLUSTRATOR = 'ai',
  INKSCAPE = 'is',
  PHOTOSHOP = 'ps',
}

export const tutorialCommand: BotCommand<'tut'> = {
  name: 'tut',
  async handle(interaction) {
    const subFolder = interaction.options.getString(OptionName.SUB_FOLDER);

    let url: string;
    switch (subFolder) {
      case AppNames.ANIMATION:
        url = 'https://www.deviantart.com/mlp-vectorclub/gallery/40236819/tutorials-animation';
        break;
      case AppNames.ILLUSTRATOR:
        url = 'https://www.deviantart.com/mlp-vectorclub/gallery/36301008/tutorials-illustrator';
        break;
      case AppNames.INKSCAPE:
        url = 'https://www.deviantart.com/mlp-vectorclub/gallery/36301003/tutorials-inkscape';
        break;
      case AppNames.PHOTOSHOP:
        url = 'https://www.deviantart.com/mlp-vectorclub/gallery/36301006/tutorials-photoshop';
        break;
      default:
        url = 'https://www.deviantart.com/mlp-vectorclub/gallery/34905690/Tutorials';
    }

    await interaction.reply(url);
  },
};
