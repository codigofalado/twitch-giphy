export enum Command {
  Giphy = '!giphy',
}

export const MatchCommand = (command: Command, message: string) =>
  message.startsWith(command);

export const GetArgs = (command: Command, message: string) =>
  message.substring(command.length).trim();
