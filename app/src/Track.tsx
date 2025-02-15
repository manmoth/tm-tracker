import {
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Select,
  Typography,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import { maps } from "./maps";
import { useNavigate } from "react-router-dom";

interface NewGame {
  drafting: boolean;
  map: number;
  gm: boolean;
  jv: boolean;
  h: boolean;
  t: boolean;
  promos: boolean;
  prelude: boolean;
  corporateEra: boolean;
  milestonesAndAwards: boolean;
  colonies: boolean;
  venusNext: boolean;
  turmoil: boolean;
}

// TODO: Fix CSRF
async function createOrUpdateGame(game: NewGame): Promise<NewGame> {
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

  return (await response.json()) as NewGame;
}

function TrackGame() {
  const { control, handleSubmit } = useForm<NewGame>({
    defaultValues: {
      drafting: true,
      map: 1,
      gm: true,
      jv: true,
      h: true,
      t: true,
      promos: true,
      prelude: true,
      corporateEra: true,
      milestonesAndAwards: true,
      colonies: false,
      venusNext: false,
      turmoil: false,
    },
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<NewGame> = async (data) => {
    await createOrUpdateGame(data);

    navigate("/");
  };

  return (
    <Container maxWidth="xl" sx={{ marginTop: 5 }}>
      <Typography variant="h2" component="h2" sx={{ m: 1 }}>
        Track new game
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="drafting"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Drafting"
            />
          )}
        />
        <Controller
          name="map"
          control={control}
          render={({ field }) => (
            <Select {...field}>
              {maps.map((map) => {
                return (
                  <MenuItem key={`map${map.id}`} value={map.id}>
                    {map.name}
                  </MenuItem>
                );
              })}
            </Select>
          )}
        />
        <Divider>Players</Divider>
        <Controller
          name="gm"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="GM"
            />
          )}
        />
        <Controller
          name="jv"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="JV"
            />
          )}
        />
        <Controller
          name="h"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="H"
            />
          )}
        />
        <Controller
          name="t"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="T"
            />
          )}
        />
        <Divider>Expansions</Divider>
        <Controller
          name="promos"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Promos"
            />
          )}
        />
        <Controller
          name="prelude"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Prelude"
            />
          )}
        />
        <Controller
          name="corporateEra"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Corporate Era"
            />
          )}
        />
        <Controller
          name="milestonesAndAwards"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Milestones & Awards"
            />
          )}
        />
        <Controller
          name="colonies"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Colonies"
            />
          )}
        />
        <Controller
          name="venusNext"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Venus Next"
            />
          )}
        />
        <Controller
          name="turmoil"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Turmoil"
            />
          )}
        />
        <Divider></Divider>
        <Button variant="outlined" color="primary" sx={{ m: 1 }} type="submit">
          Submit
        </Button>
      </form>
    </Container>
  );
}

export default TrackGame;
