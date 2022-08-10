import { Link } from "react-router-dom"

function gamgyul() {
  return (
    <Link className="logo" style={{ textDecoration: "none", color:"black" }} to={'/'}>
      <span>놀멍쉬멍</span>
      <img className="gamgyul" alt="gamgyulImg" src="/icons/gamgyul.jpg" />
    </Link>
  )
}

export default gamgyul