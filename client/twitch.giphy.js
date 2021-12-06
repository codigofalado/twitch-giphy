(($) => {
  function TwitchGiphy(target, options = {}) {
    this.target = target;
    this.last_time = 0;
    this.play_time = 0;
    this.duration = 0; // Guarda o número de segundos a exibir o GIF
    this.duration_default =
      (options.duration_default && options.duration_default * 1000) || 4000;
    this.duration_sub =
      (options.duration_sub && options.duration_sub * 1000) || 8000;

    this.queue = [];
    this.max_queue = options.max_queue || 10;

    this.target.classList.add("twitch-giphy");

    this.sender = document.createElement("div");
    this.sender.classList.add("twitch-giphy__sender");

    this.username = document.createElement("span");
    this.username.classList.add("sender__username");

    this.separator = document.createElement("span");
    this.separator.classList.add("sender__separator");
    this.separator.innerText = options.separator || ":";

    this.message = document.createElement("span");
    this.message.classList.add("sender__message");

    this.sender.appendChild(this.username);
    this.sender.appendChild(this.separator);
    this.sender.appendChild(this.message);

    this.image = document.createElement("img");
    this.image.classList.add("twitch-giphy__gif");
    this.image.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // Empty GIF

    this.target.appendChild(this.image);
    this.target.appendChild(this.sender);

    this.socket = io.connect(location.origin);
    this.socket.on("giphy", this.push.bind(this));
    this.socket.on("gif", this.push.bind(this));

    // Inicia o processo de atualizar a fila
    requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Inserir gif na fila
   */
  TwitchGiphy.prototype.push = function (data) {
    if (this.queue.length < this.max_queue) {
      this.queue.push(data);
    }
  };

  /**
   * Atualizar a fila
   */
  TwitchGiphy.prototype.update = function (time) {
    if (this.last_time == 0) this.last_time = time;
    let frame_time = time - this.last_time;
    this.last_time = time;

    if (this.queue.length > 0) {
      const item = this.queue[0];

      if (item.playing) item.play_time += Math.floor(frame_time);

      if (item.play_time >= this.duration) {
        this.hide();
        item.playing = false;
        this.queue.shift();
      } else {
        this.show(item);
      }
    }

    requestAnimationFrame(this.update.bind(this));
  };

  /**
   * Exibir o gif
   */
  TwitchGiphy.prototype.show = function (data) {
    console.log(data);
    if ("gif" in data) {
      if (this.image.src !== this.url(data)) {
        this.duration =
          data.sub == 1 ? this.duration_sub : this.duration_default;
        console.info(`Loading gif ${data.gif}`);
        console.info(`GIF Duration`, this.duration);

        this.image.onload = () => {
          data.play_time = 0;
          data.playing = true;
          this.target.style.visibility = "visible";
          this.target.style.backgroundColor = data.color;
          this.sender.style.backgroundColor = data.color;
        };
        this.image.src = this.url(data);
        console.log(this.image.src);
        // Em casos de error é forçado pular o gif
        this.image.onerror = () => {
          data.play_time = this.duration;
          data.playing = false;
          this.hide();
        };

        this.username.innerText = `@${data.user}`;
        this.message.innerText = data.message;
      }
    } else {
      console.log(data);
      data.play_time = this.duration;
      data.playing = false;
      this.hide();
    }
  };

  /**
   *  Remove exibição do gif
   */
  TwitchGiphy.prototype.hide = function () {
    this.image.onload = null;
    this.image.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    this.target.style.visibility = "hidden";
    this.target.style.backgroundColor = "";
    this.sender.style.backgroundColor = "";
    console.log(this.target);
  };

  /**
   *  Formata a URL do gif
   */
  TwitchGiphy.prototype.url = function (data) {
    //return `https://bestanimations.com/Humans/Mouths/animated-mouth-lips-gif-8.gif`
    return data.type === "giphy" ? `https://media.giphy.com/media/${data.gif}/giphy.gif` : data.gif ;
  };

  $.TwitchGiphy = TwitchGiphy;
})(window || globalThis);
