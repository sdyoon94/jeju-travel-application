import { useEffect, useState } from "react"
import TravelList from "components/Home/TravelList"
import Drawer from "components/Home/Drawer"
import Gamgyul from "components/Header/Gamgyul"
import "globalStyle.css"
import "routes/Home.css"
import { useDispatch } from "react-redux"
import { setIsLoaded } from "store/modules/travelSlice"


function Home() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setIsLoaded(false))
  }, [])

  return (
    <div>
      <Gamgyul />
      <TravelList />
      <Drawer />
    </div>
  )
}

export default Home