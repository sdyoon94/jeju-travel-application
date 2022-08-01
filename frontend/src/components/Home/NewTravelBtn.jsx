import { useNavigate } from "react-router-dom"


function NewTravelBtn({ content }) {
  const navigate = useNavigate()
  const onClick = function(e) {
    e.preventDefault()
    navigate("/new")
  }
  return (
    <button onClick={onClick} className="new-user-btn">{content}</button>
  )
}

export default NewTravelBtn