import Avatar from '@mui/material/Avatar'
import 'globalStyle.css'

function Profile() {
  return (
    <div className="profile-box">
      <Avatar className="text-center" alt="Remy Sharp" src="icons/personIcon.png" sx={{ width: 60, height: 60 }} />
      <h1 className="subtitle-size">하르방</h1>
    </div>
  )
}

export default Profile