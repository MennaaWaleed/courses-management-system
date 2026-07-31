import { useState } from 'react'
import Navbar  from './components/layout/Navbar/Navbar'
import HomeIntro from './features/home/HomeIntro/HomeIntro';
import Statistics  from './features/home/Statistics/Statistics';
function App() {
  return (
      <>
      <Navbar />
      <HomeIntro />
      <Statistics />
      </>
  )
}

export default App
