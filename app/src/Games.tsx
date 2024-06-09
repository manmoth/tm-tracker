import { Container, Typography } from "@mui/material";
import { useQuery } from "react-query"
import GameCard from "./GameCard";
import { Game, fetchGameScores, fetchGames } from "./types";

function Games() {
  const gamesQuery = useQuery({ queryKey: ['games'], queryFn: fetchGames })
  const gameScoresQuery = useQuery({ queryKey: ['gameScores'], queryFn: fetchGameScores })

  if (gamesQuery.isLoading || gameScoresQuery.isLoading) {
    return <span>Loading...</span>
  }

  return (
    <Container maxWidth="xl" sx={{marginTop: 5 }}>
      <Typography variant="h2" component="h2">Games</Typography>
      {gamesQuery.data?.map((game: Game) => {
        const scores = gameScoresQuery.data?.find(scores => scores.gameId == game.id);

        return <GameCard key={game.startedAt} game={game} scores={scores} gamesQuery={async () => { await gamesQuery.refetch(); await gameScoresQuery.refetch(); return; }}/>;
      })}
    </Container>
  )
}

export default Games
  