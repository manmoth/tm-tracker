import { Box, Card, Chip, CircularProgress, CircularProgressProps, Divider, Typography } from "@mui/material";
import { useQuery } from "react-query"
import FaceIcon from '@mui/icons-material/Face';
import MapIcon from '@mui/icons-material/Map';
import LoopIcon from '@mui/icons-material/Loop';

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number, absoluteNumber?: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.absoluteNumber ?? 0)}`}</Typography>
      </Box>
    </Box>
  );
}

interface Game {
  id: string;
  map: number;
  drafting: boolean;
  jv: boolean;
  h: boolean;
  gm: boolean;
  t: boolean;
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

function getMaxScore(scores: GameScores) {
  return Math.max(scores.jv, scores.h, scores.gm, scores.t);
}

function getPercentagesOfMaxScore(scores: GameScores | undefined) {
  if(!scores)
    return { jv: 0, h: 0, gm: 0, t: 0 };

  const maxScore = getMaxScore(scores);
  return { jv: scores.jv / maxScore * 100, h: scores.h / maxScore * 100, gm: scores.gm / maxScore * 100, t: scores.t / maxScore * 100 };
}

function GameCard(game: Game, scores?: GameScores) {
  const percentagesOfMaxScore = getPercentagesOfMaxScore(scores);
  return (
  <Card>
    <Divider>General</Divider>
    <Chip icon={<MapIcon />} label={mapNames[game.map]} color="info" sx={{ m: 1 }} />
    <Chip icon={<LoopIcon />} label="Drafting" color={game.drafting ? "info" : "default"} sx={{ m: 1 }} />
    <Divider>Players & Points</Divider>
    <Typography variant="h1" component="h2">
    <Chip icon={<FaceIcon />} label="JV" color={game.jv ? "info" : "default"} sx={{ m: 1 }} />
    <CircularProgressWithLabel variant="determinate" value={percentagesOfMaxScore.jv} absoluteNumber={scores?.jv} />
    <Chip icon={<FaceIcon />} label="GM" color={game.gm ? "info" : "default"} sx={{ m: 1 }} />
    <CircularProgressWithLabel variant="determinate" value={percentagesOfMaxScore.gm} absoluteNumber={scores?.gm} />
    <Chip icon={<FaceIcon />} label="H" color={game.h ? "info" : "default"} sx={{ m: 1 }} />
    <CircularProgressWithLabel variant="determinate" value={percentagesOfMaxScore.h} absoluteNumber={scores?.h} />
    <Chip icon={<FaceIcon />} label="T" color={game.t ? "info" : "default"} sx={{ m: 1 }} />
    <CircularProgressWithLabel variant="determinate" value={percentagesOfMaxScore.t} absoluteNumber={scores?.t} />
    </Typography>
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
  