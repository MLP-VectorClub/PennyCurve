import { getNicknameParts, NicknameParts } from './nicknames';

describe('string utils', () => {
  describe('getDeviantArtName', () => {
    it('should work for pipe syntax', () => {
      let expected: NicknameParts = { nick: 'Discord Name', daName: 'DaName' };
      expect(getNicknameParts('DaName | Discord Name')).toEqual(expected);
      expected = { nick: 'Discord Name | Decoy', daName: 'Da-Name2' };
      expect(getNicknameParts('Da-Name2 | Discord Name | Decoy')).toEqual(expected);
      expected = { nick: 'What | ever', daName: '123abcdefg-AAA' };
      expect(getNicknameParts('123abcdefg-AAA | What | ever')).toEqual(expected);
      expected = { nick: 'Hel|lo th|ere', daName: '-' };
      expect(getNicknameParts('- | Hel|lo th|ere')).toEqual(expected);
    });

    it('should work for brackets syntax', () => {
      let expected: NicknameParts = { nick: 'Discord Name', daName: 'DaName' };
      expect(getNicknameParts('Discord Name (DaName)')).toEqual(expected);
      expected = { nick: 'Discord Name (Decoy)', daName: 'Da-Name2' };
      expect(getNicknameParts('Discord Name (Decoy) (Da-Name2)')).toEqual(expected);
      expected = { nick: '(What) ever', daName: '123abcdefg-AAA' };
      expect(getNicknameParts('(What) ever (123abcdefg-AAA)')).toEqual(expected);
      expected = { nick: 'Hel(lo th)ere', daName: '-' };
      expect(getNicknameParts('Hel(lo th)ere (-)')).toEqual(expected);
    });

    it('should return null for invalid input', () => {
      let expected: NicknameParts = { nick: 'SomeRandomName', daName: null };
      expect(getNicknameParts(expected.nick)).toEqual(expected);
      expected = { nick: 'Unbalan(edBra(kets', daName: null };
      expect(getNicknameParts(expected.nick)).toEqual(expected);
      expected = { nick: 'Spaceless|Pipe', daName: null };
      expect(getNicknameParts(expected.nick)).toEqual(expected);
      expected = { nick: 'Spaceless(Brackets)', daName: null };
      expect(getNicknameParts(expected.nick)).toEqual(expected);
      expected = { nick: 'Brackets in (the wrong) place', daName: null };
      expect(getNicknameParts(expected.nick)).toEqual(expected);
      expected = { nick: 'Space before | text preceding pipe', daName: null };
      expect(getNicknameParts(expected.nick)).toEqual(expected);
    });
  });
});
