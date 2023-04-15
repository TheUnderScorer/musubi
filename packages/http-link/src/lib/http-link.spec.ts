import { httpLink } from './http-link';

describe('httpLink', () => {
  it('should work', () => {
    expect(httpLink()).toEqual('http-link');
  });
});
