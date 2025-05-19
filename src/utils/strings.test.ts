import { condenseStringArray } from './strings';

describe('string utils', () => {
  describe('condenseStringArray', () => {
    it('should return arrays with less than 2items directly', () => {
      let input: string[] = [];
      let actual = condenseStringArray(input);
      expect(actual)
        .toBe(input);

      input = ['a'];
      actual = condenseStringArray(input);
      expect(actual)
        .toBe(input);

      input = ['0123456789'];
      actual = condenseStringArray(input, 5);
      expect(actual)
        .toBe(input);
    });

    it('should condense lots of small strings into one large', () => {
      const input = ['a', 'b', 'c', 'd'];
      const actual = condenseStringArray(input);
      expect(actual)
        .toEqual(['abcd']);
    });

    it('should condense lots of small strings into multiple medium ones', () => {
      let input = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
      let actual = condenseStringArray(input, 3);
      expect(actual)
        .toEqual(['abc', 'def', 'ghi', 'jkl', 'mno', 'p']);

      input = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'];
      actual = condenseStringArray(input, 3);
      expect(actual)
        .toEqual(['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr']);
    });

    it('should condense strings with varying lengths', () => {
      let input = ['aaaaa', 'b', 'cccccc', 'dd', 'ee'];
      let actual = condenseStringArray(input, 5);
      expect(actual)
        .toEqual(['aaaaa', 'b', 'cccccc', 'ddee']);

      input = ['aaaaa', 'cccccc', 'b', 'dd', 'ee'];
      actual = condenseStringArray(input, 5);
      expect(actual)
        .toEqual(['aaaaa', 'cccccc', 'bddee']);

      input = ['aaaaa', 'b', 'dd'];
      actual = condenseStringArray(input, 5);
      expect(actual)
        .toEqual(['aaaaa', 'bdd']);

      input = ['aaaaa', 'b', 'dd', 'cccccc', 'ee', 'fed'];
      actual = condenseStringArray(input, 5);
      expect(actual)
        .toEqual(['aaaaa', 'bdd', 'cccccc', 'eefed']);
    });
  });
});
