import React from 'react'
import { EnergyContext, InventoryContext } from '../../app/Providers'
import { useContext, useState, useEffect } from 'react'
import ShopItem from './ShopItem'
import { ShopContext } from '../../app/Providers'
import { useNavigate } from 'react-router-dom'
import './ShopPage.css'

export default function ShopPage() {
  const {energy, setEnergy} = useContext(EnergyContext)
  const {shop} = useContext(ShopContext)
  const {inventory} = useContext(InventoryContext)
  const navi = useNavigate()

  const handleClick = () => {
    navi('/main')
  }

  return (
    <div>
      <button className='shopButton' onClick={handleClick}>Return To Menu</button>
      <h1 className='shopTitle'>Welcome to the Planet Shop</h1>
      <p className='shopCurrency'>You have {energy.amount} energy!</p>
      <div className='shopItemsGrid'>
        {inventory.includes(shop[0]) ? <p></p> : <ShopItem item={shop[0]} energyCost={350} name='Crown' description='Stand tall, king, your crown is falling. Increases attack by 100, defense by 30, evasion by 20, aura by 100.' stat='crown' statIncrease='crown'/>}
        {inventory.includes(shop[1]) ? <p></p> : <ShopItem item={shop[1]} energyCost={60} name='Flat Bill' description='For the planet that hangs outside 7/11. Increases defense by 20.' stat='defense' statIncrease={20}/>}
        {inventory.includes(shop[2]) ? <p></p> : <ShopItem item={shop[2]} energyCost={60} name='Shades' description='Be good at it, or look good doing it. Increases evasion by 20.' stat='evasion' statIncrease={20}/>}
        {inventory.includes(shop[3]) ? <p></p> :<ShopItem item={shop[3]} energyCost={60} name='Anime Smart Glasses' description='Hmm... I have analyzed your attack patterns, you will no longer win. Increases attack by 20' stat='attack' statIncrease={20}/>}
        {inventory.includes(shop[4]) ? <p></p> : <ShopItem item={shop[4]} energyCost={60} name='Bling' description='Who can bring you down with all this ice around your neck? Increases health by 100' stat='hp' statIncrease={20}/>}
      </div>

    </div>
  )
}
