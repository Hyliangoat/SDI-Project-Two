import { useState, useEffect, useRef } from 'react'
import MainRouter from './MainRouter'
import { EnergyProvider, InventoryProvider, PlayerProvider, ShopProvider } from './Providers'
import '../index.css'
import clickSound from '../assets/music/slimeyfox-last-credit-remaining-485095.mp3'

function App() {
  const [player, setPlayer] = useState(null)
  const audioRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio(clickSound)
    audioRef.current.loop = true;
  }, [])

  const playMusic = () => {
    if(audioRef.current){
      audioRef.current.play().catch(err => {
        console.log('Failed', err)
      })
    }
  }

  return (
    <>
      <PlayerProvider>
        <EnergyProvider>
          <ShopProvider>
            <InventoryProvider>
              <MainRouter />
            </InventoryProvider>
          </ShopProvider>
        </EnergyProvider>
      </PlayerProvider>
      <button className='musicButton' onClick={playMusic}>Music On</button>
    </>
  )
}

export default App
