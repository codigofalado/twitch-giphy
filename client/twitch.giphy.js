($ => {
  function TwitchGiphy(target, options = {}) {
    this.target = target;
    this.last_time = 0;
    this.play_time = 0;
    this.duration = (options.duration && options.duration * 1000) || 8000;

    this.queue = [];
    this.max_queue = options.max_queue || 10;

    this.target.classList.add('twitch-giphy');

    this.sender = document.createElement('div');
    this.sender.classList.add('twitch-giphy__sender');

    this.username = document.createElement('span');
    this.username.classList.add('sender__username');

    this.separator = document.createElement('span');
    this.separator.classList.add('sender__separator');
    this.separator.innerText = options.separator || ':';

    this.message = document.createElement('span');
    this.message.classList.add('sender__message');

    this.sender.appendChild(this.username);
    this.sender.appendChild(this.separator);
    this.sender.appendChild(this.message);

    this.iframe = document.createElement('iframe');
    this.iframe.classList.add('twitch-giphy__gif');
    this.iframe.src = 'about:blank';
    this.iframe.frameBorder = 0;
    this.iframe.allowFullScreen = true;

    this.target.appendChild(this.iframe);
    this.target.appendChild(this.sender);

    this.socket = io.connect(location.origin);
    this.socket.on('giphy', this.push.bind(this));

    // Inicia o processo de atualizar a fila
    requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Inserir gif na fila
   */
  TwitchGiphy.prototype.push = function(data) {
    if (this.queue.length < this.max_queue) {
      this.queue.push(data);
    }
  };

  /**
   * Atualizar a fila
   */
  TwitchGiphy.prototype.update = function(time) {
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
  TwitchGiphy.prototype.show = function(data) {
    if (this.iframe.src !== data.gif) {
      console.info(`Loading gif ${data.gif}`);
      this.target.style.visibility = 'visible';
      this.iframe.style.backgroundColor = data.color;
      this.sender.style.backgroundColor = data.color;

      this.iframe.src = data.gif;
      this.iframe.onload = () => {
        data.play_time = 0;
        data.playing = true;
      };
      // Em casos de error é forçado pular o gif
      this.iframe.onerror = () => {
        data.play_time = this.duration;
        data.playing = false;
      };

      this.username.innerText = `@${data.user}`;
      this.message.innerText = data.message;
    }
  };

  /**
   *  Remove exibição do gif
   */
  TwitchGiphy.prototype.hide = function() {
    this.target.style.visibility = 'hidden';
    this.iframe.style.removeProperty('backgroundColor');
    this.sender.style.removeProperty('backgroundColor');
  };

  $.TwitchGiphy = TwitchGiphy;
})(window || globalThis);
