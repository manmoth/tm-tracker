import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import planetUrl from './assets/planet.png';
import { Link } from 'react-router-dom';

function TmAppBar() {
  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img src={planetUrl} style={{ height: '3rem', marginRight: '1rem' }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            TM Tracker
          </Typography>
          <Link to={''}><Typography textAlign="center"            
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 300,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >Games</Typography></Link>
          <Link to={'track'}><Typography textAlign="center"             
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 300,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >Track</Typography></Link>
          <Link to={'statsCurrent'}><Typography textAlign="center"             
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 300,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >Stats - Current</Typography></Link>          
          <Link to={'gamesPrevious'}><Typography textAlign="center"            
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 300,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >Games - Previous</Typography></Link>
          <Link to={'statsPrevious'}><Typography textAlign="center"             
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 300,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >Stats - Previous</Typography></Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default TmAppBar;