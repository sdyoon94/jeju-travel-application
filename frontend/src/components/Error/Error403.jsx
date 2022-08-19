import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Error403() {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate("/")
    }, 3000)
  })
  return (
    <>
      <img alt="403" src="/icons/403.jpg" style={{width: "100vw", marginTop: "30vh"}}></img>
      <p className="text-center">잠시후 홈페이지로 이동합니다</p>
    </>
  )
}

export default Error403