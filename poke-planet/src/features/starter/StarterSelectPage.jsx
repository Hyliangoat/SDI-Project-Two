import React from 'react'
import StarterCard from './StarterCard'

export default function StarterSelectPage() {

  return (
    <div className='starter-page'>
      <h1 className='title'>Welcome to Poke-Planet</h1>
      <div className='starter-grid'>
        <StarterCard name='Sol'/>
        <StarterCard name='Luna'/>
        <StarterCard name='Uranus'/>
        <StarterCard name='Gaia'/>
        <StarterCard name='Jupiter'/>
        <StarterCard name='Pluto'/>
      </div>
    </div>
  )
}
