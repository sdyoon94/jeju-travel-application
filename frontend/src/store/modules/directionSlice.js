import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const VEHICLE_CAR = "car"
const VEHICLE_TRANSIT = "walk"

const TRANSIT = "transit"

// kakao
const KAKAO_API_KEY = "569fba90c6fa51f00c98cc28c0abb1d8"

const KAKAO_NAVI_DOMAIN = "https://apis-navi.kakaomobility.com"

const KAKAO_DIRECTIONS_PATH = "/v1/directions"
const KAKAO_WAYPOINTS_PATH = "/v1/waypoints/directions"

// google
const PROXY_SERVER_DOMAIN = "http://localhost:3001"

const GOOGLE_API_KEY = "AIzaSyA_Kp9lPUVHWZ5i3blrGYJRk8yG70ZovsM"
// const GOOGLE_MAPS_DOMAIN = "https://maps.googleapis.com"

const GOOGLE_DISTANCEMAT_PATH = "/maps/api/distancematrix/json"

const buildURI = (domain, path) => domain + path

// encoded polyline algorithm
// coord = Number format
const encodePolyline = (coord) => {
    const isNeg = coord < 0

    coord = Math.round(coord * 1e5)
    coord = coord << 1
    if (isNeg) {
        coord = ~coord
    }

    const chunks = []

    while (coord >= 0x20) {
        chunks.push(String.fromCharCode((0x20 | (coord & 0x1f)) + 63))
        coord >>= 5
    }
    chunks.push(String.fromCharCode(coord + 63))

    return chunks.join("")
}

const buildKakaoDirectionsConfig = (route) => {
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

        const url = encodeURI(`${KAKAO_NAVI_DOMAIN + KAKAO_DIRECTIONS_PATH}?origin=${origin}&destination=${destination}&waypoints=${waypoints}`)

        return {
            method: "get",
            url,
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

        // const url = KAKAO_WAYPOINTS_DIRECTIONS_URL
        const url = `${KAKAO_NAVI_DOMAIN + KAKAO_WAYPOINTS_PATH}`

        return {
            method: "post",
            url,
            headers: {
                Authorization: `KakaoAK ${KAKAO_API_KEY}`,
                "Content-Type": "application/json"
            },
            data
        }
    }
    return null
}

const buildGoogleDistanceMatrixConfig = (route) => {
    const len = route.length
    if (len < 2 || len > 25) {
        return null
    }

    const encodedCoords = route.map(({ lat, lng }) => 
        `enc:${encodePolyline(lat) + encodePolyline(lng)}:`
    ).join("|")

    const url = encodeURI(`${buildURI(PROXY_SERVER_DOMAIN, GOOGLE_DISTANCEMAT_PATH)}?origins=${encodedCoords}&destinations=${encodedCoords}&mode=${TRANSIT}&key=${GOOGLE_API_KEY}`)

    return {
        method: "get",
        url,
        headers: { }
    }
}

export const fetchDirection = createAsyncThunk(
    "maps/api/directions",
    async ({ index, route, vehicle }, { getState, dispatch }) => {
        let ret = { index, directions: [] }
        let config

        switch (vehicle) {
            case VEHICLE_CAR: 
                config = buildKakaoDirectionsConfig(route)

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
                            ret.directions = directions
                        }
                        else {
                            const { distance, duration, bound } = summary
                            ret.directions = [{ distance, duration, bound }]
                        }
                    }
                }

                break
            case VEHICLE_TRANSIT: 
                config = buildGoogleDistanceMatrixConfig(route)

                if (config) {
                    const response = await axios(config)

                    if (response.status === 200 && response.data.status === "OK") {
                        const len = route.length
                        const rows = response.data.rows
                        const directions = []

                        for (let i = 1; i < len; i++) {
                            const { distance, duration, status } = rows[i-1].elements[i]
                            directions.push({ 
                                distance: distance.value, 
                                duration: duration.value, 
                                status 
                            })
                        }

                        ret.directions = directions
                    }
                }

                break
            default: 
                break
        }
        
        return ret
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
        initDirection: (state, action) => {
            const periodInDays = action.payload
            state.directions = new Array(periodInDays)
        }, 
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDirection.fulfilled, (state, action) => {
            const { index, directions } = action.payload
            state.directions[index] = directions
        })
    }
})

const { actions, reducer } = directionSlice

export const { initDirection, updateDistanceMatrix } = actions
export default reducer