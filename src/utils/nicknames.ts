export interface NicknameParts {
  daName: string | null;
  nick: string;
}

export enum NicknameFormat {
  UNKNOWN,
  BRACKETS,
  PIPE,
}

export const getNicknameParts = (nick: string): NicknameParts => {
  const pipeMatch = nick.match(/^([^|\s]+)\s\|\s(.*)$/);
  if (pipeMatch !== null) return { daName: pipeMatch[1], nick: pipeMatch[2] };

  const bracketsMatch = nick.match(/^(.*)\s\(([^\s)]+)\)$/);
  if (bracketsMatch !== null) return { daName: bracketsMatch[2], nick: bracketsMatch[1] };

  return { nick, daName: null };
};

export const getNicknameInFormat = ({
  nick,
  daName,
}: NicknameParts, format: NicknameFormat): string => {
  let newNick: string;
  switch (format) {
    case NicknameFormat.UNKNOWN:
      newNick = nick;
      break;
    case NicknameFormat.PIPE:
      newNick = `${nick} | ${daName}`;
      break;
    case NicknameFormat.BRACKETS:
      newNick = `${daName} (${nick})`;
      break;
    default:
      throw new Error(`Unhandled nick format ${format}`);
  }
  return newNick;
};
