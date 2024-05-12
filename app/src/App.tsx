import './App.css'
import TmAppBar from './TmAppBar'
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <TmAppBar />
      <Outlet />
    </>
  )
}

export default App
