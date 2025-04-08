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
  milestonesAndAwards: boolean;
  venusNext: boolean;
  turmoil: boolean;
}

export interface GameScores {
  gameId: string;
  jv?: number;
  jvWonTieBreaker?: boolean;
  h?: number;
  hWonTieBreaker?: boolean;
  gm?: number;
  gmWonTieBreaker?: boolean;
  t?: number;
  tWonTieBreaker?: boolean;
}

export interface Tip {
  textJv: string;
  textH: string;
  textGm: string;
  textT: string;
}

export async function fetchGames(): Promise<Game[]> {
  const response = await fetch("/trackedgames");
  if (!response.ok) {
    throw new Error("Fetch error " + response.statusText);
  }

  return (await response.json()) as Game[];
}

export async function fetchGameScores(): Promise<GameScores[]> {
  const response = await fetch("/gamescores");
  if (!response.ok) {
    throw new Error("Fetch error " + response.statusText);
  }

  return (await response.json()) as GameScores[];
}

export async function fetchGamesSeason(season: number): Promise<Game[]> {
  const response = await fetch(`/trackedgames/${season}`);
  if (!response.ok) {
    throw new Error("Fetch error " + response.statusText);
  }

  return (await response.json()) as Game[];
}

export async function fetchGameScoresSeason(
  season: number,
): Promise<GameScores[]> {
  const response = await fetch(`/gamescores/${season}`);
  if (!response.ok) {
    throw new Error("Fetch error " + response.statusText);
  }

  return (await response.json()) as GameScores[];
}

export async function fetchTip(): Promise<Tip> {
  const response = await fetch(`/tips`);
  if (!response.ok) {
    throw new Error("Fetch error " + response.statusText);
  }

  return (await response.json()) as Tip;
}
