import './utils/env';

import giphy from 'giphy-api';
import Twitch, { UserStateTags } from 'twitch-js';

import { CreateConfiguration } from './config';
import { GiphyRating } from './config/Configuration';

import CheckConfiguratonParameters from './utils/checkConfiguratonParameters';
import { Command, MatchCommand, GetArgs } from './utils/command';
import GenerateColor from './utils/generateColor';

import server from './server';

async function main(): Promise<void> {
  try {
    // Verifica se os valores lidos das variaveis de ambiente obtidas do ficheiro configuração (.env) estão presentes e correctos
    if (
      !CheckConfiguratonParameters(
        process.env.TWITCH_USERNAME,
        process.env.TWITCH_TOKEN,
        process.env.TWITCH_CHANNELS,
        process.env.GIPHY_TOKEN,
      )
    ) {
      throw new Error(
        'Não foram fornecidos paramêtros de configuração.\nOu falta algum paramêtro necessário para o funcionamento correcto do chatbot.',
      );
    }

    // Cria o objecto configuração com base na informação recebida das variaveis de ambiente obtidas do ficheiro configuração (.env)
    const userConfig = CreateConfiguration(
      process.env.TWITCH_USERNAME,
      process.env.TWITCH_TOKEN,
      process.env.TWITCH_CHANNELS,
      process.env.GIPHY_TOKEN,
      (process.env.GIPHY_RATING as GiphyRating | undefined) || 'g',
    );

    // Inicia o servidor
    const Server = server();

    // Obtendo os valores obtidos para o twitch e giphy obtidos
    const { channels, token, username } = userConfig.twitch;
    const { token: giphyToken, rating } = userConfig.giphy;

    // Inicializa a API da Twitch e do Giphy
    const { chat } = new Twitch({ token, username });
    const gif = giphy(giphyToken);

    // Conecta na Twitch e aos entra nos chats configurados
    await chat.connect();
    await Promise.all(channels.map(channel => chat.join(channel)));

    // Escutar todas as mensagem privadas
    chat.on('PRIVMSG', async payload => {
      const { tags, message, channel, username: user } = payload;
      const { color = GenerateColor(), subscriber } = tags as UserStateTags;

      if (MatchCommand(Command.Giphy, message)) {
        const gifSearch = GetArgs(Command.Giphy, message); // GIF Search Term

        // Se não houver o termo de busca, será ignorado
        if (!gifSearch) return;

        try {
          const {
            // data: { embed_url },
            data: { id },
          } = await gif.translate({ s: gifSearch, rating });

          if (id) {
            Server.emit('giphy', {
              user,
              color,
              gif: id,
              sub: subscriber,
              message: gifSearch,
            });
          }
        } catch (err) {
          chat.say(
            channel.substring(1),
            `@${username}, Desculpa, não achei GIF sobre ${gifSearch}`,
          );
        }
      }
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
