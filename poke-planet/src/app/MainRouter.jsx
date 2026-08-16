import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import StarterSelectPage from '../features/starter/StarterSelectPage'
import MainMenu from '../features/MainMenu'
import ShopPage from '../features/shop/ShopPage'
import PlanetViewPage from '../features/pet/PlanetViewPage'
import CampaignPage from '../features/campaign/CampaignPage'
import BattlePage from '../features/battle/BattlePage'
import BossBattlePage from '../features/boss/BossBattlePage'

export default function MainRouter() {
  return (
    <Router>
      <Routes>
        <Route path ='/' element={<StarterSelectPage />} />
        <Route path ='/main' element={<MainMenu/>} />
        <Route path ='/shop' element={<ShopPage />} />
        <Route path ='/campaign' element={<CampaignPage />} />
        <Route path ='/planet-care' element={<PlanetViewPage />} />
        <Route path ='/battle' element={<BattlePage />} />
        <Route path ='/boss' element={<BossBattlePage />} />
      </Routes>
    </Router>
  )
}
