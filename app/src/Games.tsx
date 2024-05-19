import { Chip, Divider, Grid, Paper, Typography } from "@mui/material";
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
  promos: boolean;
  corporateEra: boolean;
  colonies: boolean;
  prelude: boolean;
  venusNext: boolean;
  turmoil: boolean;
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

function isTopScore(score: number, scores?: GameScores) {
  return score === Math.max(scores?.jv ?? 0, scores?.h ?? 0, scores?.gm ?? 0, scores?.t ?? 0);
}

function RenderScore(name: string, score: number, isTopScore: boolean) {
  return <>
    <Typography variant="h5" component="h5" sx={{ m: 1 }}>{`👨‍🚀${name}`}</Typography>
    <Typography variant="h4" component="h4" sx={{ m: 1 }}>{isTopScore ? "🏆" : ""}{score}</Typography>
  </>;
}

function RenderExpansion(name: string, played: boolean) {
  return <Chip label={name} color={played ? "info" : "default"} sx={{ display: "inline-flex", m: 1 }} variant={played ? "filled" : "outlined"} />;
}

function GameCard(game: Game, scores?: GameScores) {
  const startedAtDate = new Date(game.startedAt);
  const endedAtDate = new Date(game.endedAt);
  const lastedDate = new Date(endedAtDate.getTime() - startedAtDate.getTime());
  return (
  <Paper elevation={12} square={false}>
    <Divider><Typography variant="h5" component="h5">{startedAtDate.toLocaleDateString("nb-NO", { dateStyle: "short" })} at {startedAtDate.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}</Typography></Divider>
    <Typography variant="h6" component="h6">Lasted {lastedDate.getHours()}h {lastedDate.getMinutes()}m</Typography>
    <Chip icon={<MapIcon />} label={mapNames[game.map]} color="info" sx={{ display: "inline-flex", m: 1 }} variant="filled" />
    <Chip icon={<LoopIcon />} label="Drafting" color={game.drafting ? "info" : "default"} sx={{ display: "inline-flex", m: 1 }} variant={game.drafting ? "filled" : "outlined"} />
    <Divider><Typography variant="h5" component="h5">Players & Points</Typography></Divider>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
      {
        [
          { name: "JV", score: scores?.jv ?? 0, played: game.jv },
          { name: "H", score: scores?.h ?? 0, played: game.h },
          { name: "GM", score: scores?.gm ?? 0, played: game.gm },
          { name: "T", score: scores?.t ?? 0, played: game.t }
        ]
        .sort((a, b) => b.score - a.score)
        .map(player => (player.played ? <Grid key={player.name} xs={3}>{RenderScore(player.name, player.score, isTopScore(player.score, scores))}</Grid> : <></>))
      }
    </Grid>
    <Divider>Expansions</Divider>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
      <Grid xs={4}>{RenderExpansion("Promos", game.promos)}</Grid>
      <Grid xs={4}>{RenderExpansion("Corporate Era", game.corporateEra)}</Grid>
      <Grid xs={4}>{RenderExpansion("Prelude", game.prelude)}</Grid>
      <Grid xs={4}>{RenderExpansion("Colonies", game.colonies)}</Grid>
      <Grid xs={4}>{RenderExpansion("Venus Next", game.venusNext)}</Grid>
      <Grid xs={4}>{RenderExpansion("Turmoil", game.turmoil)}</Grid>
    </Grid>

  </Paper>);
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
  