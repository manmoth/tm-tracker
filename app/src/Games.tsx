import { Card, Chip, Divider, Grid, Typography } from "@mui/material";
import { useQuery } from "react-query"
import MapIcon from '@mui/icons-material/Map';
import LoopIcon from '@mui/icons-material/Loop';

interface Game {
  id: string;
  map: number;
  drafting: boolean;
  jv: boolean;
  h: boolean;
  gm: boolean;
  t: boolean;
  startedAt: string;
  endedAt: string;
}

interface GameScores {
  gameId: string;
  jv: number;
  h: number;
  gm: number;
  t: number;
}

const mapNames: Record<number, string> = {
  1: "Tharsis", 
  2: "Hellas", 
  3: "Elysium", 
  4: "Utopia Planitia", 
  5: "Terra Cimmeria", 
  6: "Vastitas Borealis", 
  7: "Amazonis Planitia" 
};

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

function isTopScore(score: number, scores: GameScores) {
  return score === Math.max(scores.jv, scores.h, scores.gm, scores.t);
}

function RenderScore(name: string, played: boolean, score: number, isTopScore: boolean) {
  return <>
    <Chip label={`👨‍🚀${name}`} color={played ? "info" : "default"} sx={{  display: "inline-flex", m: 1, fontSize: 20 }} />
    <Typography variant="h4" component="h4">{isTopScore ? "🏆" : ""}{score}</Typography>
  </>;
}

function GameCard(game: Game, scores?: GameScores) {
  var startedAtDate = new Date(game.startedAt);
  var endedAtDate = new Date(game.endedAt);
  var lastedDate = new Date(endedAtDate.getTime() - startedAtDate.getTime());
  return (
  <Card>
    <Divider>General</Divider>
    <Typography variant="h6" component="h6">Started {startedAtDate.toLocaleDateString("nb-NO")} {startedAtDate.toLocaleTimeString("nb-NO")}</Typography>
    <Typography variant="h6" component="h6">Lasted {lastedDate.getHours()}h {lastedDate.getMinutes()}m</Typography>
    <Chip icon={<MapIcon />} label={mapNames[game.map]} color="info" sx={{ display: "inline-flex", m: 1 }} />
    <Chip icon={<LoopIcon />} label="Drafting" color={game.drafting ? "info" : "default"} sx={{ display: "inline-flex", m: 1 }} />
    <Divider>Players & Points</Divider>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
      {
        [
          { name: "JV", score: scores?.jv || 0, played: game.jv },
          { name: "H", score: scores?.h || 0, played: game.h },
          { name: "GM", score: scores?.gm || 0, played: game.gm },
          { name: "T", score: scores?.t || 0, played: game.t }
        ]
        .sort((a, b) => b.score - a.score)
        .map(player => (<Grid xs={3}>{RenderScore(player.name, player.played, player.score, isTopScore(player.score, scores!))}</Grid>))
      }
    </Grid>
    <Divider>Expansions</Divider>
  </Card>);
}

function Games() {
    const gamesQuery = useQuery({ queryKey: ['games'], queryFn: fetchGames })
    const gameScoresQuery = useQuery({ queryKey: ['gameScores'], queryFn: fetchGameScores })
  
    if (gamesQuery.isLoading || gameScoresQuery.isLoading) {
      return <span>Loading...</span>
    }

    return (
      <>
        <h1>Previous Games</h1>
        {gamesQuery.data?.map((game: Game) => {
          const scores = gameScoresQuery.data?.find(scores => scores.gameId == game.id);

          return GameCard(game, scores);
        })}
      </>
    )
  }
  
  export default Games
  