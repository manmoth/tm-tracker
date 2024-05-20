import { Button, Chip, Container, Divider, Grid, Paper, Typography } from "@mui/material";
import { useQuery } from "react-query"
import MapIcon from '@mui/icons-material/Map';
import LoopIcon from '@mui/icons-material/Loop';
import { maps } from "./maps";

interface Game {
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

interface GameScores {
  gameId: string;
  jv: number;
  h: number;
  gm: number;
  t: number;
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

async function endGame(game: Game) {
  game.ended = true;
  const response = await fetch("/trackedgames", {
    method: "put",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    
    body: JSON.stringify(game)
  });

  if (!response.ok) {
    throw new Error('Fetch error ' + response.statusText);
  }

  return;
}

function isTopScore(score?: number, scores?: GameScores) {
  return score === Math.max(scores?.jv ?? 0, scores?.h ?? 0, scores?.gm ?? 0, scores?.t ?? 0);
}

function RenderScore(name: string, score?: number, isTopScore?: boolean) {
  return <>
    <Typography variant="h5" component="h5" sx={{ m: 1 }}>{`👨‍🚀${name}`}</Typography>
    <Typography variant="h5" component="h5" sx={{ m: 1 }}>{isTopScore ? "🏆" : ""}{score ?? "N/A"}</Typography>
  </>;
}

function RenderExpansion(name: string, played: boolean) {
  return <Chip label={name} color={played ? "info" : "default"} sx={{ display: "inline-flex", m: 1 }} variant={played ? "filled" : "outlined"} />;
}

function GameCard(game: Game, scores?: GameScores, endGame?: (game: Game) => void){
  const startedAtDate = new Date(game.startedAt);
  const endedAtDate = new Date(game.endedAt);

  const lastedTotalMinutes = ((game.ended ? endedAtDate : new Date()).getTime() - startedAtDate.getTime()) / 1000 / 60;
  const lastedHours = Math.floor(lastedTotalMinutes / 60);
  const lastedMinutes = Math.floor(lastedTotalMinutes - lastedHours * 60);

  return (
  <Paper key={game.startedAt} elevation={8} square={false} sx={{m:6}}>    
    {!game.ended && 
      <Button variant="outlined" color="primary" sx={{m:1}} onClick={() => endGame && endGame(game)}>
        End game
      </Button>
    }
    <Divider><Typography variant="h5" component="h5">{startedAtDate.toLocaleDateString("nb-NO", { dateStyle: "short" })} at {startedAtDate.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}</Typography></Divider>
    <Typography variant="h6" component="h6">{game.ended ? "Lasted " : "Still playing "}{`${lastedHours}h ${lastedMinutes}m`}</Typography>
    <Chip icon={<MapIcon />} label={maps.find(map => map.id == game.map)?.name ?? "Unknown map"} color="info" sx={{ display: "inline-flex", m: 1 }} variant="filled" />
    <Chip icon={<LoopIcon />} label="Drafting" color={game.drafting ? "info" : "default"} sx={{ display: "inline-flex", m: 1 }} variant={game.drafting ? "filled" : "outlined"} />
    <Divider><Typography variant="h5" component="h5">Players & Points</Typography></Divider>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
      {
        [
          { name: "JV", score: scores?.jv, played: game.jv },
          { name: "H", score: scores?.h, played: game.h },
          { name: "GM", score: scores?.gm, played: game.gm },
          { name: "T", score: scores?.t, played: game.t }
        ]
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        .map(player => player.played && <Grid item key={`player_${player.name}`} xs={3}>{RenderScore(player.name, game.ended ? player.score : undefined, isTopScore(player.score, scores))}</Grid>)
      }
    </Grid>
    <Divider>Expansions</Divider>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
      <Grid item key={"promos"} xs={4}>{RenderExpansion("Promos", game.promos)}</Grid>
      <Grid item key={"corpEra"} xs={4}>{RenderExpansion("Corporate Era", game.corporateEra)}</Grid>
      <Grid item key={"prelude"} xs={4}>{RenderExpansion("Prelude", game.prelude)}</Grid>
      <Grid item key={"colonies"} xs={4}>{RenderExpansion("Colonies", game.colonies)}</Grid>
      <Grid item key={"venusNext"} xs={4}>{RenderExpansion("Venus Next", game.venusNext)}</Grid>
      <Grid item key={"turmoil"} xs={4}>{RenderExpansion("Turmoil", game.turmoil)}</Grid>
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
      <Container maxWidth="xl">
        <h1>Previous Games</h1>
        {gamesQuery.data?.map((game: Game) => {
          const scores = gameScoresQuery.data?.find(scores => scores.gameId == game.id);

          return GameCard(game, scores, (game) => { void (async () => { await endGame(game); await gamesQuery.refetch();})(); });
        })}
      </Container>
    )
  }
  
  export default Games
  