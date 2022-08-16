import { Link } from "react-router-dom"
import Avatar from "@mui/material/Avatar"
import AvatarGroup from "@mui/material/AvatarGroup"
import { format, addDays } from "date-fns"

function TripSummary({travelUid, idx, title, startDate, period, members, travelLength}) {
  
  const endDate = format(
    addDays(new Date(startDate), period - 1), "yyyy-MM-dd"
  )


  return (
    <>
      <div className="trip-summary-box">
        <Link style={{ textDecoration: "none"}} to={`travel/${travelUid}`}>
          <p className="subtitle-size travel-list-title">{title}</p>
        </Link>
        <AvatarGroup sx={{"& .MuiAvatar-root": { width: 20, height: 20, fontSize: 15 }}} max={4}>
          {members.map(({kakaoId, nickname, imagePath}) =>
            <Avatar key={kakaoId} alt={nickname} src={imagePath} />
          )}
        </AvatarGroup>
      </div>
      {
        startDate
        ? <span className="subcontent-size travel-list-date inline-block">{startDate}~{endDate}</span>
        : <span className="subcontent-size travel-list-date inline-block">{period - 1}박 {period}일 동행자와 날짜를 정해봐요!</span>
      }
      <hr className="hr-margin" />
    </>
  )
}

export default TripSummary