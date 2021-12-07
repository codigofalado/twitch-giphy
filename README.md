# twitch-giphy

<i>Read this in other languages:</i> [Portuguese](README.pt.md)

A Twitch chatbot that integrates the GIPHY's API to learn Typescript

## Must Have

- [x] - Interact with Twitch's chat
- [x] - Capture a specific command from the users (everything that starts with `!giphy`)
- [x] - Remove `!giphy` and take the remaining term
- [x] - Send the remaining term to GIPHY
- [x] - Return the first GIF from GIPHY'S API
- [x] - Render the GIF on screen
- [x] - Remove the GIF from screen 8 seconds later
- [x] - Create a class in Typescript to deal with the chatbot/server
- [x] - Allow other shortcuts to insert GIF on livestream (!giphy, !gif, #)
- [x] - Modify GIF screen (Browser) to show the Username + Ballon HQ style around all GIF
- [x] - Allow to determine different number of seconds for normal users and subscribers
- [ ] - Refactor to allow all streamers in the WORLD to make use of this WONDER of nature that REVOLVES Livestreams :)

## Nice to have

- [x] - Do a GIF row to make sure every GIFs will be displayed
- [x] - Be able to set who can use the commands (everyone, only followers, only subs, VIPS, Mods etc.)
- [x] - README in English
- [ ] - Automate a deploy to AWS (always available)
- [ ] - Implement X cooldown seconds to avoid FLOOD
- [ ] - Allow integration with other plataforms besides Twitch
- [ ] - Allow multiple commands (`!gif`, `!giphy`)
- [ ] - Allow define a PRICE to the command (BITs, Channel Points)

## Configuring the Project

### Configuring server

Before all, you need to config the API options from Twitch and Giphy.

Create a environment variables file (.env) indentical to [file example](.env.example) and modify the informations according to the values below:

- **TWITCH_USERNAME**, your username or your bot's
- **TWITCH_TOKEN**, you can get from https://twitchapps.com/tmi/
- **TWITCH_CHAT_CHANNEL**, normally is the same as your username
- **GIPHY_RATING**, accept only the values 'y' | 'g' | 'pg' | 'pg-13' | 'r'
- **GIPHY_TOKEN**, you can get from https://developers.giphy.com/

With this config, when the chatbot be implemented on a service like aws, netlify or other plataform, it will be only necessary to define this values on the plataform. 

### Configuring exhibition

To customize the exhibition, go to file `client/index.html` and search for:

- It's not necessary to provide all the options, because they all have a default value

```html
<script>
  window.addEventListener("load", () => {
    const options = {
      duration_default: 4, // Optional: value in seconds (default value is 4)
      duration_sub: 8, // Optional: value in seconds to subs (default value is 8)
      max_queue: 10, // Optional: quantidade máxima de gifs na fila (default value is 10)
      separator: ":", // Optional: separator between the user and the message (default value is :)
    };
    const twitch_giphy = new TwitchGiphy(options);
  });
</script>
```

## Installing the dependencies

Open the terminal at the same directory that contains the file `package.json`, and execute:

```bash
npm i # short form to 'npm install'
```

## Compiling the project

Open the terminal at the same directory that contains the file `package.json`, and execute:

```bash
npm run build
```

## Executing the project

Open the terminal at the same directory that contains the file `package.json`, and execute:

```bash
npm start
```
