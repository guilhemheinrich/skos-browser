import { ShortenUriPipe } from './shorten-uri.pipe';

describe('ShortenUriPipe', () => {
  it('create an instance', () => {
    const pipe = new ShortenUriPipe();
    expect(pipe).toBeTruthy();
  });
});
