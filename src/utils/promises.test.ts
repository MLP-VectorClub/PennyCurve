import { LazyPromise, queueLazyPromises } from './promises';

const lazyPromiseFactory = <T>(value: T, timeout: number): LazyPromise<T> => () => new Promise((res) => setTimeout(() => res(value), timeout));

describe('promise utils', () => {
  describe('queueLazyPromises', () => {
    describe('linear mapped values', () => {
      it('should execute the provided promises in order', async () => {
        const expected: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const input: LazyPromise<number>[] = expected.map((item) => lazyPromiseFactory(item, Math.random() * 5));
        const actualPromise = queueLazyPromises(input);
        const actual = await actualPromise;
        expect(actual)
          .toEqual(expected);
      });
    });

    describe('nonlinear manual values', () => {
      it('should execute the provided promises in order', async () => {
        const expected: string[] = ['a', 'b', 'c', 'd'];
        const input: LazyPromise<string>[] = [
          lazyPromiseFactory('a', 10),
          lazyPromiseFactory('b', 5),
          lazyPromiseFactory('c', 0),
          lazyPromiseFactory('d', 15),
        ];
        const actualPromise = queueLazyPromises(input);
        const actual = await actualPromise;
        expect(actual)
          .toEqual(expected);
      });
    });
  });
});
