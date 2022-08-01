import TravelList from "components/Home/TravelList"
import Drawer from "components/Home/Drawer"
import Gamgyul from "components/Header/Gamgyul"
import "globalStyle.css"
import "routes/Home.css"


function Home() {

  return (
    <div>
      <Gamgyul />
      <TravelList />
      <Drawer />
    </div>
  )
}

export default Home