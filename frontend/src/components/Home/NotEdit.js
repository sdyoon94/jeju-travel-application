import { useSelector } from "react-redux"
import { Avatar, Box } from "@mui/material"

function NotEdit ({ editStart }) {
  const nickname = useSelector((state) => state.auth.nickname)
  const profileImg = useSelector((state) => state.auth.profileImg)

  return (
    <Box sx={{ width: "50vw", padding: 2, marginTop: 6 }}>
      <div className="drawer-profile">
        <p className="title-size drawer-profile-item">{nickname}님</p>
        <Avatar className="drawer-profile-item" alt="profile-img" src={profileImg} sx={{ width: 85, height: 85 }} />
        <span onClick={editStart}>회원정보 수정</span>
      </div>
      <hr />
      <button className="logout-btn">로그아웃</button>
    </Box>
  )
}

export default NotEdit