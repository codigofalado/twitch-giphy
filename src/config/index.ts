import { Configuration, GiphyRating as IGiphyRating } from './Configuration';

/**
 * função para criar o objecto configuração
 * @param TwitchUsername o nome utilizador twitch ou bot
 * @param TwitchToken o token da api twich. Pode ser obtido em https://twitchapps.com/tmi/
 * @param TwitchChannels lista de canais. Normalmente irá ser o mesmo que o username.
 * @param GiphyToken token da api Giphy pode se obter através de https://developers.giphy.com/
 * @param GiphyRating O rating pretendido obter items da api giphy. O default é "g" , mas aceita somente os valores 'y' | 'g' | 'pg' | 'pg-13' | 'r'
 * @returns Objecto de configuração necessário para chatbot funcionar
 */

export function CreateConfiguration(
  TwitchUsername: string,
  TwitchToken: string,
  TwitchChannels: string,
  GiphyToken: string,
  GiphyRating: IGiphyRating,
): Configuration {
  return {
    twitch: {
      username: TwitchUsername,
      token: TwitchToken,
      channels: TwitchChannels.split(','), // o dotenv nao permite arrays, logo a lista de canais vai ser (canal1,canal2) e feito o split por (,)
    },
    giphy: {
      rating: GiphyRating,
      token: GiphyToken,
    },
  };
}
