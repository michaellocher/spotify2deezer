const https = require('https');

class Spotify2Deezer {
  accessToken;

  async convert(url) {
    try {
      return this.getDeezerUrl(await this.getSpotifyUrl(url));
    } catch ({ message }) {
      console.error(message);
    }
  }

  async getSpotifyToken() {
    const url = 'https://open.spotify.com/get_access_token?reason=transport&productType=web_player';
    const { accessToken } = await this.get(url);
    this.accessToken = accessToken;
    return accessToken;
  }

  async getSpotifyUrl(url) {
    await this.getSpotifyToken();
    const urlParts = url.split('/');
    urlParts[2] = 'api.spotify.com/v1';
    if (urlParts.length === 7) {
      urlParts.splice(3, 2);
    }
    urlParts[3] += 's';
    return this.get(urlParts.join('/'));
  }

  async getDeezerUrl(trackInfo) {
    if (trackInfo.type === 'playlist') {
      const results = [];
      for (const { track } of trackInfo.tracks.items) {
        results.push(await this.getDeezerUrl(track));
      }
      return results;
    }
    if (!trackInfo || !('external_ids' in trackInfo)) {
      throw new Error('No external id present!');
    }
    const ids = trackInfo.external_ids;
    const key = Object.keys(ids)[0];
    return this.get(
      `https://api.deezer.com/${trackInfo.type}/${key}:${key === 'upc' ? parseInt(ids[key], 10) : ids[key]}`
    );
  }

  async get(url) {
    return new Promise((resolve, reject) => {
      https.get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
            'App-Platform': 'WebPlayer',
            Referer: 'https://open.spotify.com/',
            Accept: 'application/json',
            Authorization: `Bearer ${this.accessToken}`,
          },
        },

        async (res) => {
          let data = Buffer.alloc(0);
          res
            .on('data', (chunk) => {
              data = Buffer.concat([data, chunk]);
            })
            .on('end', () => resolve(JSON.parse(data.toString())))
            .on('error', reject);
        }
      );
    });
  }
}

module.exports = new Spotify2Deezer();
