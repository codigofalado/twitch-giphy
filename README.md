# twitch-giphy

Um chatbot para Twitch que integra a API do GIPHY para aprender Typescript

## Must Have

- [x] - Interagir com o chat no Twitch
- [x] - Capturar um comando específico dos usuários (tudo que começar com `!giphy`)
- [x] - Remover o `!giphy` e pegar o termo restante
- [x] - Enviar o termo restante para o GIPHY
- [x] - Retornar o primeiro GIF da API do GIPHY
- [x] - Renderizar o GIF na tela
- [x] - Remover o GIF da tela depois de 8 segundos
- [x] - Criar uma classe em Typescript para lidar com o chatbot/servidor
- [ ] - Alterar a tela do GIF (Browser) para exibir o Username + Balão estilo quadrinhos que cerca todo o GIF.
- [ ] - Refatorar para permitir que todos os streamers DO MUNDO façam uso dessa MARAVILHA da natureza que REVOLUCIONA as Lives :)

## Nice to have

- [x] - Fazer uma fila de GIFs para garantir que o GIF de todos será exibido
- [ ] - Poder definir quem pode usar o comando (todos, só seguidores, só subs)
- [ ] - Automatizar um deploy para AWS (sempre disponível)
- [ ] - Sisteminha básico de pontos para evitar FLOOD (ou integrar com Cheer)
- [ ] - Implementar cooldown de X segundos para evitar FLOOD.
- [ ] - Possibilitar integração com outras plataformas além do Twitch.
- [ ] - Possibilitar o uso de múltiplos comandos (`!gif`, `!giphy`).

## Configurando o Projeto

### Configurando servidor

Antes de tudo você precisa configurar as opções de API da Twitch e do Giphy. Vá até o diretório `src/config` e duplique o arquivo `index.example.ts`, nomei-o `index.ts` e altere as informações.

- **TWITCH_USERNAME**, seu username ou do seu bot
- **TWITCH_TOKEN**, você pode obter através de https://twitchapps.com/tmi/
- **TWITCH_CHAT_CHANNEL**, normalmente é o mesmo que seu username
- **GIPHY_RATING**, aceita somente os valores 'y' | 'g' | 'pg' | 'pg-13' | 'r'
- **GIPHY_TOKEN**, você pode obter através de https://developers.giphy.com/

```ts
import { Configuration } from "./configuration";

const config: Configuration = {
  twitch: {
    username: "TWITCH_USERNAME",
    token: "TWITCH_TOKEN",
    channels: ["TWITCH_CHAT_CHANNEL"]
  },
  giphy: {
    rating: "GIPHY_RATING",
    token: "GIPHY_TOKEN"
  }
};

export default config;
```

### Configurando exibição

Para customizar a exibição, vá no arquivo `client/index.html` e procure por:

- Não é necessário fornecer todas as opções, pois todos possuem um valor padrão de funcionamento

```html
<script>
  window.addEventListener("load", () => {
    const options = {
      duration: 8, // Opcional: valor em segundos (Valor padrão é 8)
      max_queue: 10, // Opcional: quantidade máxima de gifs na fila (Valor padrão é 10)
      separator: ":" // Opcional: separador entre o nome e mensagem (Valor padrão é :)
    };
    const twitch_giphy = new TwitchGiphy(options);
  });
</script>
```

## Instalando as dependências

Abra o terminal no mesmo diretório em que consta o arquivo `package.json`, e execute:

```bash
npm i # forma curta de 'npm install'
```

## Compilando o projeto

Abra o terminal no mesmo diretório em que consta o arquivo `package.json`, e execute:

```bash
npm run build
```

## Executando o projeto

Abra o terminal no mesmo diretório em que consta o arquivo `package.json`, e execute:

```bash
npm start
```
