import { useState, useEffect } from 'react'
import MainRouter from './MainRouter'
import { PlayerProvider } from './Providers'

function App() {
  const [player, setPlayer] = useState(null)


  return (
    <>
      <PlayerProvider>
        <MainRouter />
      </PlayerProvider>
    </>
  )
}

export default App
