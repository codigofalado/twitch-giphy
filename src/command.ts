export const Command = {
  Giphy: ["!giphy", "!gif", "#"],
};

export const MatchCommand = (command: string[] | string, message: string) => {
  // Se o comando for array, retorna true se um dos items do array coincidir
  //com o começo da mensagem
  if (command instanceof Array) {
    const cmd = command.find((val) => {
      return message.startsWith(val);
    });
    return cmd != undefined;
  }
  // Se o comando for string, retorna o resultado de startsWith
  return message.startsWith(command);
};

export const GetArgs = (command: string[] | string, message: string) => {
  // Se o comando é array, identifica o comando usado,
  // depois remova-o da mensagem
  if (command instanceof Array) {
    const cmd = command.find((val) => {
      return message.startsWith(val);
    });
    return message
      .substring(cmd.length)
      .trim()
      .replace(/[^\w\s!?]/g, "");
  }

  // Se o comando é string, substring
  return message
    .substring(command.length)
    .trim()
    .replace(/[^\w\s!?]/g, "");
};
