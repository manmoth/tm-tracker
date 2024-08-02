
export interface Game {
  id: string;
  map: number;
  drafting: boolean;
  jv: boolean;
  h: boolean;
  gm: boolean;
  t: boolean;
  corpGM: string;
  corpJV: string;
  corpH: string;
  corpT: string;
  startedAt: string;
  ended: boolean;
  endedAt: string;
  totalPausedMinutes: number;
  promos: boolean;
  corporateEra: boolean;
  colonies: boolean;
  prelude: boolean;
  venusNext: boolean;
  turmoil: boolean;
}
  
export interface GameScores {
  gameId: string;
  jv?: number;
  h?: number;
  gm?: number;
  t?: number;
}

export async function fetchGames(): Promise<Game[]> {
  const response = await fetch("/trackedgames");
  if (!response.ok) {
    throw new Error('Fetch error ' + response.statusText);
  }

  return await response.json() as Game[];
}

export async function fetchGameScores(): Promise<GameScores[]> {
  const response = await fetch("/gamescores");
  if (!response.ok) {
    throw new Error('Fetch error ' + response.statusText);
  }

  return await response.json() as GameScores[];
}