import React from 'react'
import StarterCard from './StarterCard'

export default function StarterSelectPage() {

  return (
    <>
      <h1>Welcome to Poke-Planet</h1>
      <input type='text' placeholder='My Name'></input>
        <StarterCard name='Sol'/>
        <StarterCard name='Luna'/>
        <StarterCard name='Uranus'/>
        <StarterCard name='Gaia'/>
        <StarterCard name='Jupiter'/>
        <StarterCard name='Pluto'/>
    </>
  )
}
