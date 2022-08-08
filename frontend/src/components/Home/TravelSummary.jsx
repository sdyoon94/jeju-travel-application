import { Link } from "react-router-dom"
import Avatar from "@mui/material/Avatar"
import AvatarGroup from "@mui/material/AvatarGroup"


function TripSummary({travelUid, idx, title, startDate, members, travelLength}) {


  return (
    <>
      <div className="trip-summary-box">
        <Link style={{ textDecoration: "none"}} to={`travel/${travelUid}`}>
          <p className="subtitle-size travel-list-title">{title}</p>
        </Link>
        <AvatarGroup sx={{"& .MuiAvatar-root": { width: 20, height: 20, fontSize: 15 }}} max={4}>
          {members.map(({memberUid, nickname, profileImg}) =>
            <Avatar key={memberUid} alt={nickname} src={profileImg} />
          )}
        </AvatarGroup>
      </div>
      <span className="subcontent-size travel-list-date inline-block">{startDate}~22.07.28</span>
      {idx === travelLength - 1
      ? null
      : <hr className="hr-margin" />
      }
    </>
  )
}

export default TripSummary