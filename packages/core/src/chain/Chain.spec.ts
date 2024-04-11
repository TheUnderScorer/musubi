import { Chain } from './Chain';
import { MaybePromise } from '../shared/promise';
import { wait } from '../utils/wait';

describe('Chain', () => {
  it('should support async callbacks', async () => {
    const chain = new Chain<
      (
        number: number,
        next: (number: number) => MaybePromise<number>
      ) => MaybePromise<number>
    >();
    const beforeNextFn = jest.fn();
    const afterNextFn = jest.fn();

    chain.use(async (v, next) => {
      beforeNextFn(v);

      await wait(100);

      const result = await next(v);

      afterNextFn(result);

      return result;
    });

    chain.use(async (v) => v + 1);

    const result = await chain.exec(2);

    expect(result).toBe(3);

    expect(beforeNextFn).toBeCalledWith(2);
    expect(beforeNextFn).toBeCalledTimes(1);
    expect(afterNextFn).toBeCalledWith(3);
    expect(afterNextFn).toBeCalledTimes(1);
  });
});
