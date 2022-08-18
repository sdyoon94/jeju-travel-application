import axios from "axios"
import { APIS } from "../apiHandler.js"

// ===== Fetch New Recommendation =====
const fetchNewRecommend = async(travelId, token, fixedSpots) => {
  try {
    const response = await(axios({
      method: "post",
      url: `${APIS.HOST_SERVER}/schedule/recommend/${travelId}`,
      headers: {
        Authorization: token
      },
      data: fixedSpots
    }))

    console.log(response.data);

    if (response.data.message && 
        response.data.message.endsWith("success")) {
      return
    }
    else {
      throw new Error(response.toString())
    }
  }
  catch (err) {
    throw err
  }
}

export { fetchNewRecommend }