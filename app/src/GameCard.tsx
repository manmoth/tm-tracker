import { Box, Button, Chip, Divider, FormControlLabel, Grid, Modal, Paper, TextField, Typography } from "@mui/material";
import MapIcon from '@mui/icons-material/Map';
import LoopIcon from '@mui/icons-material/Loop';
import { maps } from "./maps";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Game, GameScores } from "./Games";

// TODO: Fix CSRF
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

// TODO: Fix CSRF
async function setScores(scores: GameScores) {
  const response = await fetch("/gamescores", {
      method: "put",
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      
      body: JSON.stringify(scores)
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

function GameCard(props: { game: Game, scores?: GameScores, gamesQuery: () => Promise<void>}){
    const { game, scores, gamesQuery } = props;

    const handleEndGame = (game: Game) => { void (async () => { await endGame(game); await gamesQuery();})(); };
    const startedAtDate = new Date(game.startedAt);
    const endedAtDate = new Date(game.endedAt);
  
    const scoresSet = game.ended && (!game.jv || scores?.jv) && (!game.h || scores?.h) && (!game.gm || scores?.gm) && (!game.t || scores?.t);
  
    const canSetScores = game.ended && (endedAtDate.getTime() - new Date().getTime()) / 1000 / 60 < 60;
    const lastedTotalMinutes = ((game.ended ? endedAtDate : new Date()).getTime() - startedAtDate.getTime()) / 1000 / 60;
    const lastedHours = Math.floor(lastedTotalMinutes / 60);
    const lastedMinutes = Math.floor(lastedTotalMinutes - lastedHours * 60);
  
    const { control, handleSubmit } = useForm<GameScores>({
      defaultValues: {
        gm: 0,
        jv: 0,
        h: 0,
        t: 0,
      },
    });
  
    const [open, setOpen] = useState(false);
  
    const style = {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };
  
    const handleOpen = () => {
      setOpen(true);
    }
  
    const handleClose = () => {
      setOpen(false);
    }
    
    const onSubmit: SubmitHandler<GameScores> = async (data) => {
      const submittedScores = {
        gm: game.gm ? data.gm : undefined,
        jv: game.jv ? data.jv : undefined,
        h: game.h ? data.h : undefined,
        t: game.t ? data.t : undefined
      };

      await setScores({...submittedScores, gameId: game.id}); await gamesQuery();
  
      handleClose();
    }
  
    return (
    <Paper elevation={8} square={false} sx={{m:6}}>    
      {!game.ended && 
        <Button variant="outlined" color="primary" sx={{m:1}} onClick={() => handleEndGame(game)}>
          End game
        </Button>
      }
      {
        game.ended && !scoresSet && canSetScores &&
        <Button variant="outlined" color="primary" sx={{m:1}} onClick={handleOpen}>
          Set scores
        </Button>
      }
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit(onSubmit)}>

          { game.gm &&
          <Controller
            name="gm"
            control={control}
            render={({ field }) => 
              <FormControlLabel control={<TextField {...field} type="number" />} label="GM" />}
          />
          }
          { game.h &&
          <Controller
            name="h"
            control={control}
            render={({ field }) => 
              <FormControlLabel control={<TextField {...field} type="number" />} label="H" />}
          />
          }
          { game.jv &&
          <Controller
            name="jv"
            control={control}
            render={({ field }) => 
              <FormControlLabel control={<TextField {...field} type="number" />} label="JV" />}
          />
          }
          { game.t &&
          <Controller
            name="t"
            control={control}
            render={({ field }) => 
              <FormControlLabel control={<TextField {...field} type="number" />} label="T" />}
          />
          }
          <Divider></Divider>
          <Button variant="outlined" color="primary" sx={{m: 1}} type="submit">
            Submit
          </Button>
        </form>
        </Box>
      </Modal>
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

  export default GameCard;