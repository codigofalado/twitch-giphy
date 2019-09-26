/**
 *
 * @param TwitchUsername username twitch lido do ficheiro de configuração
 * @param TwitchToken token obtido da api twitch
 * @param TwitchChannels lista de canais lidos do ficheiro configuração
 * @param GiphyToken token api giphy
 * @returns se os valores existem e estão correctos.
 */
export function CheckConfiguratonParameters(
  TwitchUsername?: string,
  TwitchToken?: string,
  TwitchChannels?: string,
  GiphyToken?: string
): boolean {
  // verifica se os valores existem e estão correctos
  if (
    TwitchUsername &&
    TwitchToken &&
    GiphyToken &&
    TwitchChannels &&
    TwitchChannels.split(",").length > 0
  ) {
    return true;
  }

  return false;
}
