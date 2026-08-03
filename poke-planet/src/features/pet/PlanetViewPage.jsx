import { useContext } from 'react'
import { EnergyContext, InventoryContext, PlayerContext } from '../../context/GameContexts'
import { useGameActions } from '../../hooks/useGameActions'
import { useNavigate } from 'react-router-dom'
import FloatingPlanet from './FloatingPlanet'

export default function PlanetViewPage() {
  const {player} = useContext(PlayerContext)
  const {inventory} = useContext(InventoryContext)
  const {energy} = useContext(EnergyContext)
  const { feedPlanet: persistFeed } = useGameActions()
  const navi = useNavigate()

  const feedPlanet = async () => {
    try { await persistFeed(); } catch (error) { console.error(error); }
  }


  const returnMenu = () => {
    navi('/main')
  }



  return (
    <>
      <button className='petButton' onClick = {returnMenu}>Return to main menu</button>
      <div className='petPage'>
        <div className= "petPlanetSection">
          <FloatingPlanet />
        </div>
        <div className='petToolsSection'>
          <p>Current affinity: {player.affinity}</p>
          <p>Favorite element: {player.favoriteElement}</p>
          <p>Feed planet (5 energy)</p>
          <p>Your energy: {energy.amount}</p>
          <button className='petButton' onClick={feedPlanet}>Feed Planet</button>
          <p>Your items: {inventory.length === 0 ? <span>None</span> : 
          inventory.map((item) => <img key={item.code} src={item.image} alt={item.name} height='50px' width='50px'/>)}</p>
        </div>
    </div>
    </>
  )
}