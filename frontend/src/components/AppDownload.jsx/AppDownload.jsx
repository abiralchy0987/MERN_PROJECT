import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
   <p> <span>For Better Experience Download  Khajasathi App</span></p>
   <div className="app-dawnload-platforms">
    <img src={assets.play_store} alt="" />
    <img src={assets.app_store} alt="" />
   </div>
    </div>
  )
}

export default AppDownload

