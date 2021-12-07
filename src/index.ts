import "./utils/env";
import twitch from "twitch-js";
import giphy from "giphy-api";
import { CreateConfiguration } from "./config/index";
import { CheckConfiguratonParameters } from "./utils/utils";
import server from "./server";
import { GenerateColor } from "./utils/color";
import { Command, MatchCommand, GetArgs, IsUserAllowed } from "./command";
import gifs from "./config/gifs.json";

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
      process.env.GIPHY_RATING ? process.env.GIPHY_RATING : "g"
    );

    // Inicia o servidor
    const Server = server();

    // destrutura os valores obtidos para o twitch e giphy obtidos
    const { channels, token, username } = userconfig.twitch;
    const { token: giphy_token, rating } = userconfig.giphy;

    //Inicializa a API da Twitch e do Giphy
    const { chat } = new twitch({ token, username });
    const gif = giphy(giphy_token);

    // Conecta na Twitch e aos entra nos chats configurados
    await chat.connect();
    await Promise.all(channels.map((ch) => chat.join(ch)));

    // Escutar todas as mensagem privadas
    chat.on("PRIVMSG", async (payload) => {
       console.log(payload);
       console.log("payload");
      const {
        tags: { color, subscriber },
        username,
        message,
        channel,
      }: any = payload;

      // Caso o usuário não tem uma cor definida, ele irá gerar uma cor
      const user_color = color === true ? GenerateColor() : color;
      switch (true) {
        case MatchCommand(Command["Giphy"], message): {
          const gif_search = GetArgs(Command["Giphy"], message); // GIF Search Term

          // Se não houver o termo de busca, será ignorado
          if (!gif_search) return;

          try {
            const {
              // data: { embed_url },
              data: { id },
            } = await gif.translate({ s: gif_search, rating });

            if (id) {
              Server.emit("giphy", {
                type: "giphy",
                gif: id,
                user: username,
                sub: subscriber,
                color: user_color,
                message: gif_search,
              });
            }
          } catch (err) {
            chat.say(
              channel.substring(1),
              `@${username}, Desculpa, não achei GIF sobre ${gif_search}`
            );
          }


        }break;
        case MatchCommand(Command["Gif"], message): {
          if(!IsUserAllowed(payload,["Moderator","VIP"])) return;
          const gif_search = GetArgs(Command["Gif"], message); // GIF Search Term
          if (!gif_search) return;
          const gif = gifs.find(x => x.name === gif_search);
          //check if url is array, if so take random one
          const url = Array.isArray(gif.url) ? gif.url[Math.floor(Math.random() * gif.url.length)] : gif.url
          if(gif){
            Server.emit("gif", {
              type: "predefined",
              gif: url,
              user: username,
              sub: subscriber,
              color: user_color,
              message: gif_search,
            });
          }



        }break;
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
