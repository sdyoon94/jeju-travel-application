import api from "api"
import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

function PrivateRoute({ component: Component, children }) {

  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)

  const [ loadable, setLoadable ] = useState(false)

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios({
            method: "get", 
            url: api.accounts.verifyUrl(),
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          console.log(response)
          if (response.status === 200) {
            setLoadable(true)
            return
          }
        }
        catch (err) {
          console.log(err)
        }
      }
      navigate("/login", { replace : true })
    }

    verifyToken()
  }, [])

  return (
    loadable ?
    <Component>
      {children}
    </Component> : 
    null
  )
}

export default PrivateRoute