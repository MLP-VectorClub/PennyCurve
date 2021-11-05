import { getNicknameParts } from './nicknames';

describe('string utils', () => {
  describe('getDeviantArtName', () => {
    it('should work for pipe syntax', () => {
      expect(getNicknameParts('DaName | Discord Name')).toEqual('DaName');
      expect(getNicknameParts('Da-Name2 | Discord Name | Decoy')).toEqual('Da-Name2');
      expect(getNicknameParts('123abcdefg-AAA | What | ever')).toEqual('123abcdefg-AAA');
      expect(getNicknameParts('- | Hel|lo th|ere')).toEqual('-');
    });

    it('should work for brackets syntax', () => {
      expect(getNicknameParts('Discord Name (DaName)')).toEqual('DaName');
      expect(getNicknameParts('Discord Name (Decoy) (Da-Name2)')).toEqual('Da-Name2');
      expect(getNicknameParts('(What) ever (123abcdefg-AAA)')).toEqual('123abcdefg-AAA');
      expect(getNicknameParts('Hel(lo th)ere (-)')).toEqual('-');
    });

    it('should return null for invalid input', () => {
      expect(getNicknameParts('SomeRandomName')).toBeNull();
      expect(getNicknameParts('Unbalan(edBra(kets')).toBeNull();
      expect(getNicknameParts('Spaceless|Pipe')).toBeNull();
      expect(getNicknameParts('Spaceless(Brackets)')).toBeNull();
      expect(getNicknameParts('Brackets in (the wrong) place')).toBeNull();
      expect(getNicknameParts('Space before | text preceding pipe')).toBeNull();
    });
  });
});
