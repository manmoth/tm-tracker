import { Container, Divider, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useQuery } from "react-query";
import { maps } from "./maps";
import { fetchGameScoresSeason, fetchGamesSeason } from "./types";
import { calculateTimesPlayed, calculateGamesWon, calculateGamesLast, calculateTimesPlayedPerMap } from "./statsHelper";

function StatsPrevious() {
    const season = 1;
    const gamesQuery = useQuery({ queryKey: ['games'], queryFn: () => fetchGamesSeason(season) })
    const gameScoresQuery = useQuery({ queryKey: ['gameScores'], queryFn: () => fetchGameScoresSeason(season) })
  
    if (gamesQuery.isLoading || gameScoresQuery.isLoading) {
      return <span>Loading...</span>
    }

    const timesPlayed = calculateTimesPlayed(gamesQuery.data);

    const gamesWon = calculateGamesWon(gameScoresQuery.data);

    const gamesLast = calculateGamesLast(gameScoresQuery.data);

    const timesPlayedPerMap = calculateTimesPlayedPerMap(gamesQuery.data);
    
    const firstGame = gamesQuery.data?.sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())[0];
    const lastGame = gamesQuery.data?.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0];

    return (
      <Container maxWidth="xl" sx={{marginTop: 5, minWidth: "600px" }}>
        <Typography variant="h2" component="h2" sx={{ m: 1 }}>{`Stats - Season ${1}`}</Typography>
        <Typography variant="h5" component="h5" sx={{ m: 1 }}>{`${gamesQuery.data?.length} games played`}</Typography>
        <Typography variant="h5" component="h5" sx={{ m: 1 }}>{`${firstGame && new Date(firstGame?.startedAt).toDateString()} to ${lastGame && new Date(lastGame?.startedAt).toDateString()}`}</Typography>
        <Divider><Typography variant="h5" component="h5">Win rate (%)</Typography></Divider>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
          {gamesWon && timesPlayed && [{ name: "JV", percent: (gamesWon.jv / timesPlayed.jv) * 100 }, { name: "GM", percent: (gamesWon.gm / timesPlayed.gm) * 100 }, { name: "H", percent: (gamesWon.h / timesPlayed.h) * 100 }, { name: "T", percent: (gamesWon.t / timesPlayed.t) * 100 }]
          .sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0))
          .map(({ name, percent }) => (<Grid item key={`player_${name}`} xs={3}>
              <Typography variant="h6" component="h6" sx={{ m: 1 }}>{`${name}`}</Typography>
              <Typography variant="h6" component="h6" sx={{ m: 1 }}>{percent.toFixed(1) + "%" ?? "N/A"}</Typography>
            </Grid>
          ))}
        </Grid>
        <Divider><Typography variant="h5" component="h5">Last rate (%)</Typography></Divider>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
          {gamesLast && timesPlayed && [{ name: "JV", percent: (gamesLast.jv / timesPlayed.jv) * 100 }, { name: "GM", percent: (gamesLast.gm / timesPlayed.gm) * 100 }, { name: "H", percent: (gamesLast.h / timesPlayed.h) * 100 }, { name: "T", percent: (gamesLast.t / timesPlayed.t) * 100 }]
          .sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0))
          .map(({ name, percent }) => (<Grid item key={`player_${name}`} xs={3}>
              <Typography variant="h6" component="h6" sx={{ m: 1 }}>{`${name}`}</Typography>
              <Typography variant="h6" component="h6" sx={{ m: 1 }}>{percent.toFixed(1) + "%" ?? "N/A"}</Typography>
            </Grid>
          ))}
        </Grid>
        <Divider><Typography variant="h5" component="h5">Played map</Typography></Divider>
        <Grid container justifyContent="center">
          <List>
            {
              maps.map(map => (
                <ListItem key={map.id}>
                  <ListItemText
                    primary={map.name + " " + ((timesPlayedPerMap?.[map.id]) ?? 0) + " times"}
                  />
                </ListItem>
              ))}
            </List>
        </Grid>
      </Container>
    )
}

export default StatsPrevious;