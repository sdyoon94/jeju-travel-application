import TripList from "components/Home/TripList"
import Drawer from "components/Home/Drawer"
// import { Link } from "react-router-dom"
import "globalStyle.css"
import "routes/Home.css"


function Home() {

  return (
    <div>
      <TripList />
      <Drawer />
    </div>
  )
}

export default Home