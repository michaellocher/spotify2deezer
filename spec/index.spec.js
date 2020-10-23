/* eslint-disable no-undef,import/no-named-default */
const Spotify2Deezer = require('../index');

describe('Spotify2Deezer', () => {
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
  });

  it('should convert track url', (done) => {
    Spotify2Deezer.convert('https://open.spotify.com/track/6yxQYuItvkkjEDGvORwzeD')
    .then((res) => {
      expect(res.title).toEqual('Nummer Eins');
      expect(res.type).toEqual('track');
      done();
    });
  });

  it('should convert album url', (done) => {
    Spotify2Deezer.convert('https://open.spotify.com/album/5daH8iwvl59rDhYWg1iEgf')
    .then((res) => {
      expect(res.title).toEqual('Das goldene Album');
      expect(res.type).toEqual('album');
      expect(res.tracks.data.length).toEqual(15);
      done();
    });
  });

  it('should convert playlist url', (done) => {
    Spotify2Deezer.convert('https://open.spotify.com/user/spotify/playlist/37i9dQZF1DX7ZUug1ANKRP')
    .then((res) => {
      expect(res.length).toBeGreaterThan(40);
      done();
    });
  });
});
