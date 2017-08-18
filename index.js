/* eslint-disable no-return-assign,class-methods-use-this,import/no-named-default */
const https = require('https');

class Spotify2Deezer {
  convert(url) {
    return this.getSpotifyUrl(url)
    .then(res => this.getDeezerUrl(res))
    .catch(console.error);
  }

  getSpotifyUrl(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve(JSON.parse(/Spotify.Entity\s*=\s*([^;]*)/g.exec(body)[1])));
      })
      .on('error', reject);
    });
  }

  getDeezerUrl(data) {
    return new Promise((resolve, reject) => {
      const trackInfo = data.track || data;
      if (trackInfo.type === 'playlist') {
        return trackInfo.tracks.items
        .map(item => results => this.getDeezerUrl(item)
        .then((result) => {
          results.push(result);
          return results;
        })
        .catch(() => results))
        .reduce((a, b) => a.then(b).catch(b), Promise.resolve([]))
        .then(res => resolve(res.filter(t => !('error' in t))));
      }
      if (!trackInfo || !('external_ids' in trackInfo)) {
        reject(new Error('No external id present!'));
      }
      const ids = trackInfo.external_ids;
      const key = Object.keys(ids)[0];
      return https.get(`https://api.deezer.com/${trackInfo.type}/${key}:${ids[key]}`, (res) => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          const json = JSON.parse(body);
          if ('error' in json) {
            reject(new Error('Track could not be found!'));
          }
          resolve(json);
        });
      })
      .on('error', reject);
    });
  }
}

module.exports = new Spotify2Deezer();
