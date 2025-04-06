import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import LoopIcon from "@mui/icons-material/Loop";
import { maps } from "./maps";
import { useState } from "react";
import {
  Control,
  Controller,
  SubmitHandler,
  UseFormHandleSubmit,
  useForm,
} from "react-hook-form";
import { Game, GameScores } from "./types";
import { corporations } from "./corporations";
import { calculateGameResult } from "./statsHelper";

async function endGame(game: Game) {
  game.ended = true;

  return updateGame(game);
}

// TODO: Fix CSRF
async function setScores(scores: GameScores) {
  const response = await fetch("/gamescores", {
    method: "put",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: JSON.stringify(scores),
  });

  if (!response.ok) {
    throw new Error("Fetch error " + response.statusText);
  }

  return;
}

// TODO: Fix CSRF
async function updateGame(game: Game) {
  const response = await fetch("/trackedgames", {
    method: "put",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: JSON.stringify(game),
  });

  if (!response.ok) {
    throw new Error("Fetch error " + response.statusText);
  }

  return;
}

function RenderScore(
  name: string,
  corp: string,
  score?: number,
  isWinner?: boolean,
  isLast?: boolean,
) {
  return (
    <>
      <Typography
        variant="h5"
        component="h5"
        sx={{ m: 1 }}
      >{`👨‍🚀${name}`}</Typography>
      <Typography variant="h5" component="h5" sx={{ m: 1 }}>
        {isWinner ? "🏆" : isLast ? "💩" : ""}
        {score ?? "N/A"}
      </Typography>
      <Typography
        variant="h6"
        component="h6"
        fontSize={14}
        sx={{ m: 1 }}
      >{`${corp || ""}`}</Typography>
    </>
  );
}

function RenderExpansion(name: string, played: boolean) {
  return (
    <Chip
      label={name}
      color={played ? "info" : "default"}
      sx={{ display: "inline-flex", m: 1 }}
      variant={played ? "filled" : "outlined"}
    />
  );
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function RenderSetPausedTimeModal(
  game: Game,
  open: boolean,
  control: Control<{ totalPausedMinutes: number }>,
  handleClose: () => void,
  handleSubmit: UseFormHandleSubmit<{ totalPausedMinutes: number }>,
  gamesQuery: () => Promise<void>,
) {
  const onSubmit: SubmitHandler<{ totalPausedMinutes: number }> = async (
    data,
  ) => {
    await updateGame({ ...game, totalPausedMinutes: data.totalPausedMinutes });
    await gamesQuery();

    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="totalPausedMinutes"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<TextField {...field} type="number" />}
                label="Total paused minutes"
              />
            )}
          />
          <Divider></Divider>
          <Button
            variant="outlined"
            color="primary"
            sx={{ m: 1 }}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

function RenderSetGameScoresModal(
  game: Game,
  open: boolean,
  control: Control<GameScores>,
  handleClose: () => void,
  handleSubmit: UseFormHandleSubmit<GameScores>,
  gamesQuery: () => Promise<void>,
) {
  const onSubmit: SubmitHandler<GameScores> = async (data) => {
    const submittedScores = {
      gm: game.gm ? data.gm : undefined,
      gmWonTieBreaker: game.gm ? data.gmWonTieBreaker : undefined,
      jv: game.jv ? data.jv : undefined,
      jvWonTieBreaker: game.jv ? data.jvWonTieBreaker : undefined,
      h: game.h ? data.h : undefined,
      hWonTieBreaker: game.h ? data.hWonTieBreaker : undefined,
      t: game.t ? data.t : undefined,
      tWonTieBreaker: game.t ? data.tWonTieBreaker : undefined,
    };

    await setScores({ ...submittedScores, gameId: game.id });
    await gamesQuery();

    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 1, md: 1 }}
          >
            {game.gm && (
              <Grid key="player_gm" size={{ xs: 11 }}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 2, sm: 2, md: 2 }}
                >
                  <Grid key="player_score" size={{ xs: 2 }}>
                    <Typography sx={{ m: 1 }}>{"GM"}</Typography>
                  </Grid>
                  <Grid key="player_score" size={{ xs: 6 }}>
                    <Controller
                      name="gm"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} type="number" />
                      )}
                    />
                  </Grid>
                  <Grid key="player_tb" size={{ xs: 4 }}>
                    <Controller
                      name="gmWonTieBreaker"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox {...field} checked={field.value} />
                          }
                          label="Won tie-breaker?"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
            {game.h && (
              <Grid key="player_h" size={{ xs: 11 }}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 2, sm: 2, md: 2 }}
                >
                  <Grid key="player_score" size={{ xs: 2 }}>
                    <Typography sx={{ m: 1 }}>{"H"}</Typography>
                  </Grid>
                  <Grid key="player_score" size={{ xs: 6 }}>
                    <Controller
                      name="h"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} type="number" />
                      )}
                    />
                  </Grid>
                  <Grid key="player_tb" size={{ xs: 4 }}>
                    <Controller
                      name="hWonTieBreaker"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox {...field} checked={field.value} />
                          }
                          label="Won tie-breaker?"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
            {game.jv && (
              <Grid key="player_jv" size={{ xs: 11 }}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 2, sm: 2, md: 2 }}
                >
                  <Grid key="player_score" size={{ xs: 2 }}>
                    <Typography sx={{ m: 1 }}>{"JV"}</Typography>
                  </Grid>
                  <Grid key="player_score" size={{ xs: 6 }}>
                    <Controller
                      name="jv"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} type="number" />
                      )}
                    />
                  </Grid>
                  <Grid key="player_tb" size={{ xs: 4 }}>
                    <Controller
                      name="jvWonTieBreaker"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox {...field} checked={field.value} />
                          }
                          label="Won tie-breaker?"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
            {game.t && (
              <Grid key="player_t" size={{ xs: 11 }}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 2, sm: 2, md: 2 }}
                >
                  <Grid key="player_score" size={{ xs: 2 }}>
                    <Typography sx={{ m: 1 }}>{"T"}</Typography>
                  </Grid>
                  <Grid key="player_score" size={{ xs: 6 }}>
                    <Controller
                      name="t"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} type="number" />
                      )}
                    />
                  </Grid>
                  <Grid key="player_tb" size={{ xs: 4 }}>
                    <Controller
                      name="tWonTieBreaker"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox {...field} checked={field.value} />
                          }
                          label="Won tie-breaker?"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
          <Divider></Divider>
          <Button
            variant="outlined"
            color="primary"
            sx={{ m: 1 }}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

function RenderSetCorporationsModal(
  game: Game,
  open: boolean,
  control: Control<{
    corpGM: string;
    corpJV: string;
    corpH: string;
    corpT: string;
  }>,
  handleClose: () => void,
  handleSubmit: UseFormHandleSubmit<{
    corpGM: string;
    corpJV: string;
    corpH: string;
    corpT: string;
  }>,
  gamesQuery: () => Promise<void>,
) {
  const onSubmit: SubmitHandler<{
    corpGM: string;
    corpJV: string;
    corpH: string;
    corpT: string;
  }> = async (data) => {
    await updateGame({ ...game, ...data });
    await gamesQuery();

    handleClose();
  };

  const corpsSorted = corporations.map((corp) => corp.name).sort();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {game.gm && (
            <Controller
              control={control}
              name="corpGM"
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  freeSolo
                  options={corpsSorted}
                  onChange={(_, values) => onChange(values)}
                  value={value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="GM"
                      variant="outlined"
                      onChange={onChange}
                      sx={{ mt: 2 }}
                    />
                  )}
                />
              )}
            />
          )}
          {game.h && (
            <Controller
              control={control}
              name="corpH"
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  freeSolo
                  options={corpsSorted}
                  onChange={(_, values) => onChange(values)}
                  value={value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="H"
                      variant="outlined"
                      onChange={onChange}
                      sx={{ mt: 2 }}
                    />
                  )}
                />
              )}
            />
          )}
          {game.jv && (
            <Controller
              control={control}
              name="corpJV"
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  freeSolo
                  options={corpsSorted}
                  onChange={(_, values) => onChange(values)}
                  value={value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="JV"
                      variant="outlined"
                      onChange={onChange}
                      sx={{ mt: 2 }}
                    />
                  )}
                />
              )}
            />
          )}
          {game.t && (
            <Controller
              control={control}
              name="corpT"
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  freeSolo
                  options={corpsSorted}
                  onChange={(_, values) => onChange(values)}
                  value={value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="T"
                      variant="outlined"
                      onChange={onChange}
                      sx={{ mt: 2 }}
                    />
                  )}
                />
              )}
            />
          )}
          <Divider></Divider>
          <Button
            variant="outlined"
            color="primary"
            sx={{ m: 1 }}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

function GameCard(props: {
  game: Game;
  scores?: GameScores;
  gamesQuery: () => Promise<void>;
}) {
  const { game, scores, gamesQuery } = props;

  const handleEndGame = (game: Game) => {
    void (async () => {
      await endGame(game);
      await gamesQuery();
    })();
  };
  const startedAtDate = new Date(game.startedAt);
  const endedAtDate = new Date(game.endedAt);

  const scoresSet =
    game.ended &&
    (!game.jv || scores?.jv) &&
    (!game.h || scores?.h) &&
    (!game.gm || scores?.gm) &&
    (!game.t || scores?.t);

  const minutesSinceGameEnded = game.ended
    ? (new Date().getTime() - endedAtDate.getTime()) / 1000 / 60
    : 0;
  const canEditScores = game.ended && minutesSinceGameEnded < 24 * 60;
  const canEditTotalPausedTime = !game.ended || minutesSinceGameEnded < 24 * 60;
  const canEditCorps = !game.ended || minutesSinceGameEnded < 24 * 60;

  const totalPausedMinutes = game.totalPausedMinutes ?? 0;
  const lastedTotalMinutes =
    ((game.ended ? endedAtDate : new Date()).getTime() -
      startedAtDate.getTime()) /
      1000 /
      60 -
    totalPausedMinutes;
  const lastedHours = Math.floor(lastedTotalMinutes / 60);
  const lastedMinutes = Math.floor(lastedTotalMinutes - lastedHours * 60);

  const {
    control: setGameScoresControl,
    handleSubmit: handleSubmitSetGameScores,
  } = useForm<GameScores>({
    defaultValues: {
      gm: 0,
      gmWonTieBreaker: false,
      jv: 0,
      jvWonTieBreaker: false,
      h: 0,
      hWonTieBreaker: false,
      t: 0,
      tWonTieBreaker: false,
    },
  });

  const [openSetScoresModal, setOpenSetScoresModal] = useState(false);

  const handleOpenSetScoresModal = () => {
    setOpenSetScoresModal(true);
  };

  const handleCloseSetScoresModal = () => {
    setOpenSetScoresModal(false);
  };

  const {
    control: setTotalPausedTimeControl,
    handleSubmit: handleSubmitSetTotalPausedTime,
  } = useForm<{ totalPausedMinutes: number }>({
    defaultValues: {
      totalPausedMinutes: 0,
    },
  });
  const [openSetTotalPausedTimeModal, setOpenSetTotalPausedTimeModal] =
    useState(false);

  const handleOpenSetTotalPausedTimeModal = () => {
    setOpenSetTotalPausedTimeModal(true);
  };

  const handleCloseSetTotalPausedTimeModal = () => {
    setOpenSetTotalPausedTimeModal(false);
  };

  const { control: setCorpsControl, handleSubmit: handleSubmitSetCorps } =
    useForm<{ corpGM: string; corpJV: string; corpH: string; corpT: string }>({
      defaultValues: {
        corpGM: game.corpGM || corporations[0].name,
        corpJV: game.corpJV || corporations[0].name,
        corpH: game.corpH || corporations[0].name,
        corpT: game.corpT || corporations[0].name,
      },
    });
  const [openSetCorpsModal, setOpenSetCorpsModal] = useState(false);

  const handleOpenSetCorpsModal = () => {
    setOpenSetCorpsModal(true);
  };

  const handleCloseSetCorpsModal = () => {
    setOpenSetCorpsModal(false);
  };

  const expansionGridItems = [
    game.promos && (
      <Grid key={"promos"} size={{ xs: 6 }}>
        {RenderExpansion("Promos", game.promos)}
      </Grid>
    ),
    game.corporateEra && (
      <Grid key={"corpEra"} size={{ xs: 6 }}>
        {RenderExpansion("Corporate Era", game.corporateEra)}
      </Grid>
    ),
    game.prelude && (
      <Grid key={"prelude"} size={{ xs: 6 }}>
        {RenderExpansion("Prelude", game.prelude)}
      </Grid>
    ),
    game.milestonesAndAwards && (
      <Grid key={"milestonesAndAwards"} size={{ xs: 6 }}>
        {RenderExpansion("Milestones & Awards", game.milestonesAndAwards)}
      </Grid>
    ),
    game.colonies && (
      <Grid key={"colonies"} size={{ xs: 6 }}>
        {RenderExpansion("Colonies", game.colonies)}
      </Grid>
    ),
    game.venusNext && (
      <Grid key={"venusNext"} size={{ xs: 6 }}>
        {RenderExpansion("Venus Next", game.venusNext)}
      </Grid>
    ),
    game.turmoil && (
      <Grid key={"turmoil"} size={{ xs: 6 }}>
        {RenderExpansion("Turmoil", game.turmoil)}
      </Grid>
    ),
  ].filter((item) => !!item);

  const gameResult = scores && calculateGameResult(scores);

  return (
    <Paper elevation={8} square={false} sx={{ m: 6 }}>
      {!game.ended && (
        <Button
          variant="outlined"
          color="primary"
          sx={{ m: 1 }}
          onClick={() => handleEndGame(game)}
        >
          End game
        </Button>
      )}
      {game.ended && (!scoresSet || canEditScores) && (
        <Button
          variant="outlined"
          color="primary"
          sx={{ m: 1 }}
          onClick={handleOpenSetScoresModal}
        >
          Set scores
        </Button>
      )}
      {canEditTotalPausedTime && (
        <Button
          variant="outlined"
          color="primary"
          sx={{ m: 1 }}
          onClick={handleOpenSetTotalPausedTimeModal}
        >
          Set paused time
        </Button>
      )}
      {canEditCorps && (
        <Button
          variant="outlined"
          color="primary"
          sx={{ m: 1 }}
          onClick={handleOpenSetCorpsModal}
        >
          Set corporations
        </Button>
      )}
      {RenderSetGameScoresModal(
        game,
        openSetScoresModal,
        setGameScoresControl,
        handleCloseSetScoresModal,
        handleSubmitSetGameScores,
        gamesQuery,
      )}
      {RenderSetPausedTimeModal(
        game,
        openSetTotalPausedTimeModal,
        setTotalPausedTimeControl,
        handleCloseSetTotalPausedTimeModal,
        handleSubmitSetTotalPausedTime,
        gamesQuery,
      )}
      {RenderSetCorporationsModal(
        game,
        openSetCorpsModal,
        setCorpsControl,
        handleCloseSetCorpsModal,
        handleSubmitSetCorps,
        gamesQuery,
      )}
      <Divider>
        <Typography variant="h5" component="h5">
          {startedAtDate.toLocaleDateString("nb-NO", { dateStyle: "short" })} at{" "}
          {startedAtDate.toLocaleTimeString("nb-NO", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </Divider>
      <Typography variant="h6" component="h6">
        {game.ended ? "Played " : "Still playing "}
        {`${lastedHours}h ${lastedMinutes}m`}
      </Typography>
      {totalPausedMinutes > 0 && (
        <Typography
          variant="h6"
          component="h6"
          fontSize={14}
        >{`Paused ${totalPausedMinutes}m`}</Typography>
      )}
      <Chip
        icon={<MapIcon />}
        label={maps.find((map) => map.id == game.map)?.name ?? "Unknown map"}
        color="info"
        sx={{ display: "inline-flex", m: 1 }}
        variant="filled"
      />
      <Chip
        icon={<LoopIcon />}
        label="Drafting"
        color={game.drafting ? "info" : "default"}
        sx={{ display: "inline-flex", m: 1 }}
        variant={game.drafting ? "filled" : "outlined"}
      />
      <Divider>
        <Typography variant="h5" component="h5">
          Players & Points
        </Typography>
      </Divider>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        {[
          {
            name: "JV",
            corp: game.corpJV,
            score: scores?.jv,
            played: game.jv,
            isWinner: gameResult?.jv.won,
            isLast: gameResult?.jv.last,
          },
          {
            name: "H",
            corp: game.corpH,
            score: scores?.h,
            played: game.h,
            isWinner: gameResult?.h.won,
            isLast: gameResult?.h.last,
          },
          {
            name: "GM",
            corp: game.corpGM,
            score: scores?.gm,
            played: game.gm,
            isWinner: gameResult?.gm.won,
            isLast: gameResult?.gm.last,
          },
          {
            name: "T",
            corp: game.corpT,
            score: scores?.t,
            played: game.t,
            isWinner: gameResult?.t.won,
            isLast: gameResult?.t.last,
          },
        ]
          .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
          .map(
            (player) =>
              player.played && (
                <Grid key={`player_${player.name}`} size={{ xs: 3 }}>
                  {RenderScore(
                    player.name,
                    player.corp,
                    game.ended ? player.score : undefined,
                    player.isWinner,
                    player.isLast,
                  )}
                </Grid>
              ),
          )}
      </Grid>
      <Divider>Expansions</Divider>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        {expansionGridItems.length > 0 ? (
          expansionGridItems
        ) : (
          <Grid key={"promos"} size={{ xs: 12 }}>
            <Typography variant="h6" component="h6" fontSize={14} sx={{ m: 1 }}>
              No expansions
            </Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}

export default GameCard;
