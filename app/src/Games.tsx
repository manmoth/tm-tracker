import { Container } from "@mui/material";
import { useQuery } from "react-query"
import GameCard from "./GameCard";

export interface Game {
  id: string;
  map: number;
  drafting: boolean;
  jv: boolean;
  h: boolean;
  gm: boolean;
  t: boolean;
  startedAt: string;
  ended: boolean;
  endedAt: string;
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

async function fetchGames(): Promise<Game[]> {
  const response = await fetch("/trackedgames");
  if (!response.ok) {
    throw new Error('Fetch error ' + response.statusText);
  }
  
  return await response.json() as Game[];
}

async function fetchGameScores(): Promise<GameScores[]> {
  const response = await fetch("/gamescores");
  if (!response.ok) {
    throw new Error('Fetch error ' + response.statusText);
  }
  
  return await response.json() as GameScores[];
}

function Games() {
  const gamesQuery = useQuery({ queryKey: ['games'], queryFn: fetchGames })
  const gameScoresQuery = useQuery({ queryKey: ['gameScores'], queryFn: fetchGameScores })

  if (gamesQuery.isLoading || gameScoresQuery.isLoading) {
    return <span>Loading...</span>
  }

  return (
    <Container maxWidth="xl">
      <h1>Previous Games</h1>
      {gamesQuery.data?.map((game: Game) => {
        const scores = gameScoresQuery.data?.find(scores => scores.gameId == game.id);

        return <GameCard key={game.startedAt} game={game} scores={scores} gamesQuery={async () => { await gamesQuery.refetch(); await gameScoresQuery.refetch(); return; }}/>;
      })}
    </Container>
  )
}

export default Games
  