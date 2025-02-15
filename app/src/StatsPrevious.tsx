import {
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useQuery } from "react-query";
import { maps } from "./maps";
import { fetchGameScoresSeason, fetchGamesSeason } from "./types";
import {
  calculateTimesPlayed,
  calculateGamesWon,
  calculateGamesLast,
  calculateTimesPlayedPerMap,
  formatPercentOrNa,
} from "./statsHelper";

function StatsPrevious() {
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

  const timesPlayed = calculateTimesPlayed(gamesQuery.data);

  const gamesWon = calculateGamesWon(gameScoresQuery.data);

  const gamesLast = calculateGamesLast(gameScoresQuery.data);

  const timesPlayedPerMap = calculateTimesPlayedPerMap(gamesQuery.data);

  const firstGame = gamesQuery.data?.sort(
    (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
  )[0];
  const lastGame = gamesQuery.data?.sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  )[0];

  const calcPercent = (
    instances: number | undefined,
    totalTimes: number | undefined,
  ) => (!totalTimes ? 0 : ((instances ?? 0) / totalTimes) * 100);

  return (
    <Container maxWidth="xl" sx={{ marginTop: 5, minWidth: "600px" }}>
      <Typography
        variant="h2"
        component="h2"
        sx={{ m: 1 }}
      >{`Stats - Season ${season}`}</Typography>
      <Typography
        variant="h5"
        component="h5"
        sx={{ m: 1 }}
      >{`${gamesQuery.data?.length} games played`}</Typography>
      <Typography
        variant="h5"
        component="h5"
        sx={{ m: 1 }}
      >{`${firstGame && new Date(firstGame?.startedAt).toDateString()} to ${lastGame && new Date(lastGame?.startedAt).toDateString()}`}</Typography>
      <Divider>
        <Typography variant="h5" component="h5">
          Win rate (%)
        </Typography>
      </Divider>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        {gamesWon &&
          timesPlayed &&
          [
            { name: "JV", percent: calcPercent(gamesWon.jv, timesPlayed.jv) },
            { name: "GM", percent: calcPercent(gamesWon.gm, timesPlayed.gm) },
            { name: "H", percent: calcPercent(gamesWon.h, timesPlayed.h) },
            { name: "T", percent: calcPercent(gamesWon.t, timesPlayed.t) },
          ]
            .sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0))
            .map(({ name, percent }) => (
              <Grid item key={`player_${name}`} xs={3}>
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ m: 1 }}
                >{`${name}`}</Typography>
                <Typography variant="h6" component="h6" sx={{ m: 1 }}>
                  {formatPercentOrNa(percent)}
                </Typography>
              </Grid>
            ))}
      </Grid>
      <Divider>
        <Typography variant="h5" component="h5">
          Last rate (%)
        </Typography>
      </Divider>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        {gamesLast &&
          timesPlayed &&
          [
            { name: "JV", percent: calcPercent(gamesLast.jv, timesPlayed.jv) },
            { name: "GM", percent: calcPercent(gamesLast.gm, timesPlayed.gm) },
            { name: "H", percent: calcPercent(gamesLast.h, timesPlayed.h) },
            { name: "T", percent: calcPercent(gamesLast.t, timesPlayed.t) },
          ]
            .sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0))
            .map(({ name, percent }) => (
              <Grid item key={`player_${name}`} xs={3}>
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ m: 1 }}
                >{`${name}`}</Typography>
                <Typography variant="h6" component="h6" sx={{ m: 1 }}>
                  {formatPercentOrNa(percent)}
                </Typography>
              </Grid>
            ))}
      </Grid>
      <Divider>
        <Typography variant="h5" component="h5">
          Played map
        </Typography>
      </Divider>
      <Grid container justifyContent="center">
        <List>
          {maps.map((map) => (
            <ListItem key={map.id}>
              <ListItemText
                primary={
                  map.name + " " + (timesPlayedPerMap?.[map.id] ?? 0) + " times"
                }
              />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Container>
  );
}

export default StatsPrevious;
