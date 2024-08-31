import { Container, Divider, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useQuery } from "react-query";
import { maps } from "./maps";
import { fetchGameScores, fetchGames } from "./types";
import { calculateTimesPlayed, calculateGamesWon, calculateGamesLast, calculateTimeAbsent, calculateTimesPlayedPerMap } from "./statsHelper";

function StatsCurrent() {
    const gamesQuery = useQuery({ queryKey: ['games'], queryFn: fetchGames })
    const gameScoresQuery = useQuery({ queryKey: ['gameScores'], queryFn: fetchGameScores })
  
    if (gamesQuery.isLoading || gameScoresQuery.isLoading) {
      return <span>Loading...</span>
    }

    const timesPlayed = calculateTimesPlayed(gamesQuery.data);

    const gamesWon = calculateGamesWon(gameScoresQuery.data);

    const gamesLast = calculateGamesLast(gameScoresQuery.data);

    const timesAbsent = calculateTimeAbsent(gamesQuery.data);

    const timesPlayedPerMap = calculateTimesPlayedPerMap(gamesQuery.data);
    
    return (
      <Container maxWidth="xl" sx={{marginTop: 5, minWidth: "600px" }}>
        <Typography variant="h2" component="h2" sx={{ m: 1 }}>Stats - Current Season</Typography>
        <Typography variant="h5" component="h5" sx={{ m: 1 }}>{`${gamesQuery.data?.length} games played`}</Typography>
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
        <Divider><Typography variant="h5" component="h5">Times won</Typography></Divider>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
          {gamesWon && [{ name: "JV", count: gamesWon.jv }, { name: "GM", count: gamesWon.gm }, { name: "H", count: gamesWon.h }, { name: "T", count: gamesWon.t }]
          .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
          .map(({ name, count }) => (<Grid item key={`player_${name}`} xs={3}>
              <Typography variant="h6" component="h6" sx={{ m: 1 }}>{`${name}`}</Typography>
              <Typography variant="h6" component="h6" sx={{ m: 1 }}>{count ?? "N/A"}</Typography>
            </Grid>
          ))}
        </Grid>
        <Divider><Typography variant="h5" component="h5">Times last</Typography></Divider>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
          {gamesLast && [{ name: "JV", count: gamesLast.jv }, { name: "GM", count: gamesLast.gm }, { name: "H", count: gamesLast.h }, { name: "T", count: gamesLast.t }]
          .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
          .map(({ name, count }) => (<Grid item key={`player_${name}`} xs={3}>
              <Typography variant="h6" component="h6" sx={{ m: 1 }}>{`${name}`}</Typography>
              <Typography variant="h6" component="h6" sx={{ m: 1 }}>{count ?? "N/A"}</Typography>
            </Grid>
          ))}
        </Grid>
        <Divider><Typography variant="h5" component="h5">Times absent</Typography></Divider>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
          {timesAbsent && [{ name: "JV", count: timesAbsent.jv }, { name: "GM", count: timesAbsent.gm }, { name: "H", count: timesAbsent.h }, { name: "T", count: timesAbsent.t }]
          .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
          .map(({ name, count }) => (<Grid item key={`player_${name}`} xs={3}>
              <Typography variant="h6" component="h6" sx={{ m: 1 }}>{`${name}`}</Typography>
              <Typography variant="h6" component="h6" sx={{ m: 1 }}>{count ?? "N/A"}</Typography>
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

export default StatsCurrent;