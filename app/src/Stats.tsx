import { Container, Divider, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useQuery } from "react-query";
import { maps } from "./maps";
import { fetchGameScores, fetchGames } from "./types";

function Stats() {
    const gamesQuery = useQuery({ queryKey: ['games'], queryFn: fetchGames })
    const gameScoresQuery = useQuery({ queryKey: ['gameScores'], queryFn: fetchGameScores })
  
    if (gamesQuery.isLoading || gameScoresQuery.isLoading) {
      return <span>Loading...</span>
    }

    const gamesWon = gameScoresQuery.data?.reduce<{ jv: number, gm: number, h: number, t: number}>(
        (prev, curr) => { 
            const winnerPoints = Math.max(curr.gm ?? 0, curr.jv ?? 0, curr.h ?? 0, curr.t ?? 0);

            if(winnerPoints === 0)
                return prev;

            return { jv: (curr.jv == winnerPoints ? prev.jv + 1 : prev.jv), gm: (curr.gm == winnerPoints ? prev.gm + 1 : prev.gm), h: (curr.h == winnerPoints ? prev.h + 1 : prev.h), t: (curr.t == winnerPoints ? prev.t + 1 : prev.t) };
        },
        { jv: 0, gm: 0, h: 0, t: 0 }
    );

    const timesAbsent = gamesQuery.data?.reduce<{ jv: number, gm: number, h: number, t: number}>(
        (prev, curr) => { 
            return { jv: (curr.jv ? prev.jv : prev.jv + 1), gm: (curr.gm ? prev.gm : prev.gm + 1), h: (curr.h ? prev.h : prev.h + 1), t: (curr.t ? prev.t : prev.t + 1) };
        },
        { jv: 0, gm: 0, h: 0, t: 0 }
    );

    const timesPerMap = gamesQuery.data?.reduce<Record<number, number>>(
        (prev, curr) => { 
            return { ...prev, [curr.map]: (prev[curr.map] ?? 0) + 1 };
        },
        {}
    );

    console.log(timesPerMap)
    
    return (
      <Container maxWidth="xl" sx={{marginTop: 5, minWidth: "600px" }}>
        <Typography variant="h2" component="h2" sx={{ m: 1 }}>Stats</Typography>
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
                    primary={map.name + " " + ((timesPerMap?.[map.id]) ?? 0) + " times"}
                  />
                </ListItem>
              ))}
            </List>
        </Grid>
      </Container>
    )
}

export default Stats;