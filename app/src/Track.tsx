import { Button, Checkbox, Container, Divider, FormControlLabel, Select } from "@mui/material"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import MenuItem from '@mui/material/MenuItem';
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
  colonies: boolean;
  venusNext: boolean;
  turmoil: boolean;
}

async function createOrUpdateGame(game: NewGame): Promise<NewGame> {
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
  
  return await response.json() as NewGame;
}

function TrackGame() {
  const { control, handleSubmit } = useForm<NewGame>({
    defaultValues: {
      drafting: false,
      map: 1,
      gm: false,
      jv: false,
      h: false,
      t: false,
      promos: false,
      prelude: false,
      corporateEra: false,
      colonies: false,
      venusNext: false,
      turmoil: false
    },
  })

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<NewGame> = async (data) => {
    await createOrUpdateGame(data);

    navigate("/");
  }

  return (
    <Container maxWidth="xl">
      <h1>Track new game</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="drafting"
          control={control}
          render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label="Drafting" />}
        />
        <Controller
          name="map"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
            >
              {maps.map(map => {
                return <MenuItem key={`map${map.id}`} value={map.id}>{map.name}</MenuItem>;
              })}
            </Select>
          )}
        />
        <Divider>Players</Divider>
        <Controller
          name="gm"
          control={control}
          render={({ field }) => 
            <FormControlLabel control={<Checkbox {...field} />} label="GM" />}
        />
        <Controller
          name="jv"
          control={control}
          render={({ field }) => 
            <FormControlLabel control={<Checkbox {...field} />} label="JV" />}
        />
        <Controller
          name="h"
          control={control}
          render={({ field }) => 
            <FormControlLabel control={<Checkbox {...field} />} label="H" />}
        />
        <Controller
          name="t"
          control={control}
          render={({ field }) => 
            <FormControlLabel control={<Checkbox {...field} />} label="T" />}
        />
        <Divider>Expansions</Divider>
        <Controller
          name="promos"
          control={control}
          render={({ field }) => 
            <FormControlLabel control={<Checkbox {...field} />} label="Promos" />}
        />
        <Controller
          name="prelude"
          control={control}
          render={({ field }) => 
            <FormControlLabel control={<Checkbox {...field} />} label="Prelude" />}
        />
        <Controller
          name="corporateEra"
          control={control}
          render={({ field }) => 
            <FormControlLabel control={<Checkbox {...field} />} label="Corporate Era" />}
        />
        <Controller
          name="colonies"
          control={control}
          render={({ field }) => 
            <FormControlLabel control={<Checkbox {...field} />} label="Colonies" />}
        />
        <Controller
          name="venusNext"
          control={control}
          render={({ field }) => 
            <FormControlLabel control={<Checkbox {...field} />} label="Venus Next" />}
        />
        <Controller
          name="turmoil"
          control={control}
          render={({ field }) => 
            <FormControlLabel control={<Checkbox {...field} />} label="Turmoil" />}
        />
        <Divider></Divider>
        <Button variant="outlined" color="primary" sx={{m: 1}} type="submit">
          Submit
        </Button>
      </form>
    </Container>
  )
}
  
export default TrackGame
  