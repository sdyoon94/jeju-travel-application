import Profile from "components/Home/Profile"
import TripList from "components/Home/TripList"
import { Link } from "react-router-dom"
import { Box, Button } from "@mui/material"
import "globalStyle.css"
import "routes/Home.css"


function Home() {

  return (
    <div>
      <Profile />
      <TripList />
      <Box className="new-trip-btn">
        <Link className="link" to="/newtrip">
          <Button variant="outlined">새로운 여행을 떠나봐요!</Button>
        </Link>
      </Box>
    </div>
  )
}

export default Home