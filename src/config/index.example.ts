import { Configuration } from './configuration';

/**
 * Explicação:
 * 
 * TWITCH_USERNAME, seu username ou do seu bot
 * TWITCH_TOKEN você pode obter através de https://twitchapps.com/tmi/
 * TWITCH_CHAT_CHANNEL, normalmente é o mesmo que seu username
 *
 * GIPHY_RATING, aceita somente os valores 'y' | 'g' | 'pg' | 'pg-13' | 'r'
 * GIPHY_TOKEN, você pode obter através de https://developers.giphy.com/
 */

const config: Configuration = {
  twitch: {
    username: 'TWITCH_USERNAME',
    token: 'TWITCH_TOKEN',
    channels: ['TWITCH_CHAT_CHANNEL'],
  },
  giphy: {
    rating: 'g',
    token: 'GIPHY_TOKEN',
  },
};

export default config;
