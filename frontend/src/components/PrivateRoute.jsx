import api from "api"
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { login, clear } from "store/modules/authSlice"

function PrivateRoute({ component: Component, children }) {

  const params = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)
  const refreshToken_ = useSelector((state) => state.auth.refreshToken)

  const [ loadable, setLoadable ] = useState(false)

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          await axios({
            method: "get", 
            url: api.accounts.verifyUrl(),
            validateStatus: status => status === 200,
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          setLoadable(true)
        }
        catch (err) {
          if (err.response && err.response.status === 401) {
            try {
              const response = await axios({
                method: "get",
                url: api.accounts.refreshUrl(),
                validateStatus: status => status === 200,
                headers: {
                  Authorization: `Bearer ${token}`,
                  RefreshToken: `Bearer ${refreshToken_}`
                }
              })

              const { accessToken, refreshToken } = response.data

              dispatch(login({ accessToken, refreshToken }))
              setLoadable(true)
            }
            catch (err) {
              dispatch(clear())
            }
          }
          else if (err.response) {
            dispatch(clear())
          }
          console.log(err)
        }
      }
      else {
        navigate("/login", { replace : true })
      }
    }

    verifyToken()
  }, [])

  return (
    loadable ?
    <Component params={params}>
      {children}
    </Component> : 
    null
  )
}

export default PrivateRoute