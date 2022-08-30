import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedAuthorOptions,
  EmbedBuilder,
} from 'discord.js';
import { makeButton } from '../buttons.js';
import { BotButtonId } from '../constants/bot-button-id.js';
import { PhilomenaImageResponse } from '../types/philomena-api.js';

const usNumberFormatter = new Intl.NumberFormat('en-US');

const derpibooruStatValue = (n: number): string => (n === 0 ? 'None' : usNumberFormatter.format(n));

export const respondWithDerpibooruImage = async (interaction: CommandInteraction, image: PhilomenaImageResponse, brief = false): Promise<void> => {
  const { processed } = image;
  if (!processed) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      makeButton(BotButtonId.RETRY),
      makeButton(BotButtonId.DELETE),
    );
    await interaction.reply({
      content: 'The requested image is not yet processed by Derpibooru, please try again in a bit',
      components: [row],
    });
    return;
  }

  const {
    tags: tagArray,
    id: imageId,
    mime_type: mimeType,
    format: imageFormat,
    source_url: sourceUrl,
  } = image;
  const url = `https://derpibooru.org/${imageId}`;
  const isImage = /^image\//.test(mimeType);
  const format = imageFormat.toUpperCase();
  const maxArtists = 8;
  const maxDescriptionLength = 256;

  const artists = tagArray.filter((t) => /^artist:/.test(t));
  const author: EmbedAuthorOptions = { name: 'Unknown Artist' };
  if (artists) {
    const artistCount = artists.length;
    author.name = artists.slice(0, maxArtists)
      .map((t) => t.replace(/^artist:/, ''))
      .join(', ');
    if (artistCount > maxArtists) {
      author.name += `, \u2026 (${artistCount - maxArtists} more)`;
    }
    author.url = artistCount > 1 ? url : `https://derpibooru.org/search?q=${encodeURIComponent(artists[0])}`;
  }

  const embed = new EmbedBuilder({
    url,
    color: 0x618fc3,
    author,
    timestamp: new Date(image.created_at).getTime(),
    footer: {
      icon_url: 'https://derpicdn.net/img/view/2020/7/23/2406370.png',
      text: 'Derpibooru',
    },
    image: isImage ? {
      url: image.view_url,
      height: image.height,
      width: image.width,
    } : undefined,
    thumbnail: !isImage ? {
      url: `https://via.placeholder.com/160/E2EBF2/3D92D0?text=${format}`,
      width: 160,
      height: 160,
    } : undefined,
  });
  if (!brief) {
    let description = image.description
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    if (description.length > maxDescriptionLength) {
      // Try trimming words that got cut in half (by removing anything that's 1-24 chars long preceded by whitespace)
      description = `${description.substring(0, maxDescriptionLength)
        .replace(/\s[\S]{1,24}$/, '')}\u2026`;
    }
    embed.setDescription(description);

    const ratingTags = tagArray
      .filter((tag) => /^(safe|suggestive|questionable|explicit|semi-grimdark|grimdark|grotesque)$/.test(tag))
      .map((tag) => tag[0].toUpperCase() + tag.substring(1));

    if (ratingTags.length > 0) embed.addFields({ name: `Rating${ratingTags.length !== 1 ? 's' : ''}`, value: ratingTags.join(', '), inline: true });
    if (image.uploader) embed.addFields({ name: 'Uploaded by', value: image.uploader, inline: true });
    embed.addFields([
      { name: 'Dimensions', value: `${usNumberFormatter.format(image.width)} x ${usNumberFormatter.format(image.height)}`, inline: true },
      { name: 'Score', value: usNumberFormatter.format(image.score), inline:  true },
      { name: 'Favorites', value: derpibooruStatValue(image.faves), inline:  true },
      { name: 'Comments', value: derpibooruStatValue(image.comment_count), inline:  true },
    ]);
  }
  console.info(`Sending Derpi embed for image #${imageId}`);

  const derpiButton = new ButtonBuilder().setLabel('View on Derpibooru')
    .setStyle(ButtonStyle.Link)
    .setURL(url);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(derpiButton);
  if (sourceUrl) {
    const sourceButton = new ButtonBuilder().setLabel('View source')
      .setStyle(ButtonStyle.Link)
      .setURL(sourceUrl);
    row.addComponents(sourceButton);
  }
  await interaction.reply({
    embeds: [embed],
    components: [row],
  });
};
