import { useQuery } from "@tanstack/react-query";
import { fetchTip } from "./types";
import { Button, Container, Typography } from "@mui/material";
import { useState } from "react";

function Tips() {
  const tipQuery = useQuery({ queryKey: ["tip"], queryFn: fetchTip });

  const [whoseTip, setWhoseTip] = useState({
    jv: false,
    h: false,
    gm: false,
    t: false,
  });

  if (tipQuery.isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <Container maxWidth="xl" sx={{ marginTop: 5 }}>
      <Typography variant="h2" component="h2">
        Tips
      </Typography>
      <Button
        variant="contained"
        sx={{ m: 1 }}
        onClick={() => setWhoseTip({ jv: true, h: false, gm: false, t: false })}
      >
        JV
      </Button>
      <Button
        variant="contained"
        sx={{ m: 1 }}
        onClick={() => setWhoseTip({ jv: false, h: true, gm: false, t: false })}
      >
        H
      </Button>
      <Button
        variant="contained"
        sx={{ m: 1 }}
        onClick={() => setWhoseTip({ jv: false, h: false, gm: true, t: false })}
      >
        GM
      </Button>
      <Button
        variant="contained"
        sx={{ m: 1 }}
        onClick={() => setWhoseTip({ jv: false, h: false, gm: false, t: true })}
      >
        T
      </Button>
      <Typography variant="h5" component="h5">
        {whoseTip.jv && tipQuery.data?.textJv}
        {whoseTip.h && tipQuery.data?.textH}
        {whoseTip.gm && tipQuery.data?.textGm}
        {whoseTip.t && tipQuery.data?.textT}
      </Typography>
    </Container>
  );
}

export default Tips;
