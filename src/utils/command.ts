export const Command = {
  Giphy: ['!giphy', '!gif', '#'],
};

export function MatchCommand(
  command: string[] | string,
  message: string,
): boolean {
  // Se o comando for array, retorna true se um dos items do array coincidir
  // com o começo da mensagem
  if (command instanceof Array) {
    const cmd = command.find(val => message.startsWith(val));
    return cmd !== undefined;
  }

  // Se o comando for string, retorna o resultado de startsWith
  return message.startsWith(command);
}

export function GetArgs(command: string[] | string, message: string): string {
  // Se o comando é array, identifica o comando usado,
  // depois remova-o da mensagem
  const cmd =
    command instanceof Array
      ? command.find(val => message.startsWith(val))
      : command; // Se o comando é string, substring

  return message
    .substring(cmd.length)
    .trim()
    .replace(/[^\w\s!?]/g, '');
}
