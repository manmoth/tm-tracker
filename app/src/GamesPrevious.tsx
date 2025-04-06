import { Container, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import GameCard from "./GameCard";
import { Game, fetchGameScoresSeason, fetchGamesSeason } from "./types";

function GamesPrevious() {
  const season = 2;
  const gamesQuery = useQuery({
    queryKey: ["games"],
    queryFn: () => fetchGamesSeason(season),
  });
  const gameScoresQuery = useQuery({
    queryKey: ["gameScores"],
    queryFn: () => fetchGameScoresSeason(season),
  });

  if (gamesQuery.isLoading || gameScoresQuery.isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <Container maxWidth="xl" sx={{ marginTop: 5 }}>
      <Typography
        variant="h2"
        component="h2"
      >{`Games - Season ${season}`}</Typography>
      {gamesQuery.data?.map((game: Game) => {
        const scores = gameScoresQuery.data?.find(
          (scores) => scores.gameId == game.id,
        );

        return (
          <GameCard
            key={game.startedAt}
            game={game}
            scores={scores}
            gamesQuery={async () => {
              await gamesQuery.refetch();
              await gameScoresQuery.refetch();
              return;
            }}
          />
        );
      })}
    </Container>
  );
}

export default GamesPrevious;
