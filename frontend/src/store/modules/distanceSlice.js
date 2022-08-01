import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const KAKAO_API_KEY = "569fba90c6fa51f00c98cc28c0abb1d8"
const KAKAO_DIRECTION_URL = "https://apis-navi.kakaomobility.com/v1/directions"
const KAKAO_WAYPOINTS_DIRECTIONS_URL = "https://apis-navi.kakaomobility.com/v1/waypoints/directions"

const buildConfig = (route) => {
    const len = route.length
    if (len < 2) {
        return null
    }
    if (len <= 7) {
        const origin = `${route[0].lng},${route[0].lat}`
        const destination = `${route[len-1].lng},${route[len-1].lat}`
        let waypoints = ""
        for (let i = 1; i < len - 1; i++) {
            waypoints += `${route[i].lng},${route[i].lat}`
            if (i !== len - 2) {
                waypoints += `|`
            }
        }

        return {
            method: "get",
            url: encodeURI(`${KAKAO_DIRECTION_URL}?origin=${origin}&destination=${destination}&waypoints=${waypoints}`),
            headers: {
                Authorization: `KakaoAK ${KAKAO_API_KEY}`
            }
        }
    }
    if (len <= 32) {
        const waypoints = []
        for (let i = 1; i < len-1; i++) {
            waypoints.push({
                x: route[i].lng,
                y: route[i].lat
            })
        }
        const data = {
            origin: {
                x: route[0].lng,
                y: route[0].lat
            },
            destination: {
                x: route[len-1].lng,
                y: route[len-1].lat
            },
            waypoints
        }


        return {
            method: "post",
            url: KAKAO_WAYPOINTS_DIRECTIONS_URL,
            headers: {
                Authorization: `KakaoAK ${KAKAO_API_KEY}`,
                "Content-Type": "application/json"
            },
            data
        }
    }
    return null
}

const fetchDirection = createAsyncThunk(
    "kakao/navi/api/direction",
    async ({ index, route }) => {
        const config = buildConfig(route)

        if (config) {
            const response = await axios(config)

            // 카카오 내비 API 비동기 요청 성공 시
            if (response.status === 200 && response.data.routes[0].result_code === 0) {
                const { sections, summary }  = response.data.routes[0]
                if ( sections ) {
                    const directions = []
                    sections.forEach(section => {
                        const { distance, duration, bound } = section
                        directions.push({ distance, duration, bound })
                    })
                    return { index, directions}
                }
                const { distance, duration, bound } = summary
                const directions = [{ distance, duration, bound }]
                return { index, directions }
            }
        }
        return { index, directions: [] }
    }
)

const initialState = {
    directions: [],
    loading: "idle"
}

const directionSlice = createSlice({
    name: "direction",
    initialState,
    reducers: {
        initDirections: (state, action) => {
            state.directions = new Array(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDirection.fulfilled, (state, action) => {
            const { index, directions } = action.payload
            state.directions[index] = directions

            console.log(index);
            console.log(directions);
        })
    }
})

const { actions, reducer } = directionSlice

export { fetchDirection }
export const { initDirections } = actions
export default reducer