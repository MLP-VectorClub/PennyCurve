import { ChannelMentionMap, ServerChannelName } from '../constants/server-channel-name.js';
import { processRulesText } from './rules.js';
import { env } from '../env.js';

describe('rule utils', () => {
  describe('processRulesText', () => {
    const mockChannelMentionMap: ChannelMentionMap = {
      [ServerChannelName.NSFW]: '<#123>',
      [ServerChannelName.CASUAL]: '<#456>',
    };
    const mockBotMention = '<@123>';

    const processWithDefaults = (rulesText: string): string => processRulesText(rulesText, mockChannelMentionMap, mockBotMention);

    it('should provide the correct output for channel mapping', () => {
      const mockRules = 'General discussion should go in #CASUAL, but keep NSFW content in the #NSFW channel';
      const expected = `General discussion should go in ${mockChannelMentionMap[ServerChannelName.CASUAL]}, but keep NSFW content in the ${mockChannelMentionMap[ServerChannelName.NSFW]} channel`;
      const actual = processWithDefaults(mockRules);
      expect(actual)
        .toEqual(expected);
    });

    it('should provide the correct output for bot user mapping', () => {
      const mockRules = ['Our very own bot, ', ', has a couple commands. Also ', ' again to check global replacement.'];
      const mockRulesText = mockRules.join('@me');
      const expected = mockRules.join(mockBotMention);
      const actual = processWithDefaults(mockRulesText);
      expect(actual)
        .toEqual(expected);
    });

    it('should process environment variables', () => {
      const mockRules = 'Our server\'s ID is {{SERVER_ID}} and the bot owner is set to <@{{BOT_OWNER_ID}}>.';
      const expected = `Our server's ID is ${env.SERVER_ID} and the bot owner is set to <@${env.BOT_OWNER_ID}>.`;
      const actual = processWithDefaults(mockRules);
      expect(actual)
        .toEqual(expected);
    });
  });
});
