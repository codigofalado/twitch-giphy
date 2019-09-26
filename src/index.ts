import "./utils/env";
import twitch from "twitch-js";
import giphy from "giphy-api";
import { CreateConfiguration } from "./config/index";
import { CheckConfiguratonParameters } from "./utils/utils";
import server from "./server";
import { GenerateColor } from "./utils/color";
import { Command, MatchCommand, GetArgs } from "./command";

async function main() {
  try {
    // verifica se os valores lidos das variaveis de ambiente obtidas do ficheiro configuração (.env) estão presentes e correctos
    if (
      !CheckConfiguratonParameters(
        process.env.TWITCH_USERNAME,
        process.env.TWITCH_TOKEN,
        process.env.TWITCH_CHANNELS,
        process.env.GIPHY_TOKEN
      )
    ) {
      throw new Error(
        "Não foram fornecidos paramêtros de configuração.\nOu falta algum paramêtro necessário para o funcionamento correcto do chatbot."
      );
    }
    //
    // cria o objecto configuração com base na informação recebida das variaveis de ambiente obtidas do ficheiro configuração (.env) 
    const userconfig = CreateConfiguration(
      process.env.TWITCH_USERNAME,
      process.env.TWITCH_TOKEN,
      process.env.TWITCH_CHANNELS,
      process.env.GIPHY_TOKEN,
      process.env.GIPHY_RATING?process.env.GIPHY_RATING:'g'
    );
    
    // Inicia o servidor
    const Server = server();

  
    // destrutura os valores obtidos para o twitch e giphy obtidos
    const { channels,token,username}= userconfig.twitch;
    const { token: giphy_token, rating }=userconfig.giphy;

    //Inicializa a API da Twitch e do Giphy
    const { chat } = new twitch({ token, username });
    const gif = giphy(giphy_token);

    // Conecta na Twitch e aos entra nos chats configurados
    await chat.connect();
    await Promise.all(channels.map(ch => chat.join(ch)));

    // Escutar todas as mensagem privadas
    chat.on("PRIVMSG", async payload => {
      const {
        tags: { color },
        username,
        message,
        channel
      } = payload;

      // Caso o usuário não tem uma cor definida, ele irá gerar uma cor
      const user_color = color === true ? GenerateColor() : color;

      switch (true) {
        case MatchCommand(Command.Giphy, message): {
          const gif_search = GetArgs(Command.Giphy, message); // GIF Search Term

          // Se não houver o termo de busca, será ignorado
          if (!gif_search) return;

          try {
            const {
              data: { embed_url }
            } = await gif.translate({ s: gif_search, rating });

            Server.emit("giphy", {
              gif: embed_url,
              user: username,
              color: user_color,
              message: gif_search
            });
          } catch (err) {
            chat.say(
              channel.substring(1),
              `@${username}, Desculpa, não achei GIF sobre ${gif_search}`
            );
          }
        }

        default: {
          break;
        }
      }
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
