import { CircularProgress, Drawer } from "@mui/material"
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { useCallback, useEffect, useState } from "react"
import { format, addDays } from "date-fns"

import { ReactComponent as MapIcon } from "assets/map.svg"

import "./MapDrawer.css"

const API_KEY = "AIzaSyA_Kp9lPUVHWZ5i3blrGYJRk8yG70ZovsM"
const containerStyle = {
    height: "max(30vh, 250px)",
    width: "90vw"
}
const center = {
    lat: 33.488830,
    lng: 126.498083
}
// Map 객체의 bounds, center 변경을 위한 함수
const updateBounds = (bounds, lat, lng) => {
    if (lat > bounds.north) {
        bounds.north = lat
    }
    if (lat < bounds.south) {
        bounds.south = lat
    }
    if (lng > bounds.east) {
        bounds.east = lng
    }
    if (lng < bounds.west) {
        bounds.west = lng
    }
}
const updateCenter = (center, lat, lng) => {
    center.lat += lat
    center.lng += lng
}
const divideCenter = (center, len) => {
    center.lat /= len
    center.lng /= len
}
// tag 처리 함수
const buildTags = (tag) => {
    const tags = tag.split(",")
    if (tags.length === 0) {
        return "#태그없음"
    }
    if (tags.length === 1) {
        return `#${tag}`
    }
    return tags.reduce((prev, curr) => `#${prev} #${curr}`)
}

function MapDrawer({ travel, scheduleIdx }) {

    const [ day, setDay ] = useState(scheduleIdx + 1)
    const [ route, setRoute ] = useState(travel.schedules[scheduleIdx])
    const [ date, setDate ] = useState(
        format(
            addDays(
                travel.info.startDate ? 
                new Date(travel.info.startDate) :
                new Date(), 
                scheduleIdx),
            "yyyy-MM-dd"
        )
    )

    // Drawer 컴포넌트에서 사용
    const [ isDrawerOpened, setIsDrawerOpened ] = useState(false)

    const toggleDrawer = () => {
        setIsDrawerOpened(true)
    }
    const closeDrawer = () => {
        setIsDrawerOpened(false)
    }

    useEffect(() => {
        setRoute(travel.schedules[scheduleIdx])
    }, [ travel.schedules[scheduleIdx], scheduleIdx ])

    useEffect(() => {
        setDay(scheduleIdx + 1)
        setDate(
            format(
                addDays(
                    travel.info.startDate ? 
                    new Date(travel.info.startDate) :
                    new Date(), 
                    scheduleIdx),
                "yyyy-MM-dd"
            )
        )
    }, [ travel.info.startDate, scheduleIdx ])

    const [ markers ] = useState([])

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: API_KEY
    })

    const PlaceInfo = () => {
        return (
        <div id="place">
            <div id="place-name">관광지 이름</div>
            <div id="place-spec">
                <img id="place-image" alt="장소 이미지" src=""></img>
                <div id="place-info">
                    <div id="place-addr">관광지 주소</div>
                    <div id="place-tag">
                        지도의 마커를 클릭하여 관광지 정보를 확인하고, 
                        사람 모양 아이콘을 드래그하여 스트리트 뷰를 확인할 수 있어요. 
                    </div>
                </div>
            </div>
        </div>
    )}

    const Map = ({ route, markers }) => {
        // 지도가 로드되었을 때 실행하는 로직
        const onLoad = useCallback((mapInstance) => {
            while (markers.length > 0) {
                markers.pop().setMap(null)
            }

            const bounds = {
                north: -90,
                south: 90,
                east: -180,
                west: 180
            }

            const center = {
                lat: 0,
                lng: 0
            }

            route.forEach((place, idx) => {
                const lat = place.lat
                const lng = place.lng

                updateBounds(bounds, lat, lng)
                updateCenter(center, lat, lng)

                const marker = new window.google.maps.Marker({
                    position: {
                        lat,
                        lng
                    },
                    title: `${idx+1}. ${place.placeName}`,
                    label: `${idx+1}`,
                    map: mapInstance,
                    optimized: false
                })

                marker.addListener("click", (e) => {
                    document.getElementById("place-name").innerText = place.placeName
                    document.getElementById("place-image").src = place.imgPath ? place.imgPath : "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Jeju_Island.jpg/320px-Jeju_Island.jpg"
                    document.getElementById("place-image").style.display = "block"
                    document.getElementById("place-addr").innerText = `주소: ${place.roadAddress}`
                    document.getElementById("place-addr").style.display = "block"
                    document.getElementById("place-tag").innerText = place.tag ? buildTags(place.tag) : "#태그없음"
                })

                markers.push(marker)
            })

            divideCenter(center, route.length)

            mapInstance.fitBounds(bounds)
            mapInstance.setCenter(center)

        }, [markers, route])

        return (
        <div className="google-map-container">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={11}
                onLoad={onLoad}
            >
            </GoogleMap>
        </div>
    )}

    return (
        <>
            <MapIcon
                className="map-marker"
                onClick={toggleDrawer} 
            />
            <Drawer
                anchor={"bottom"}
                open={isDrawerOpened}
                onClose={closeDrawer}
            >
                <div className="map-title">{ `${day}일차 지도 (${date})` }</div>
                { loadError ? 
                    <div>현재 지도 API 호출이 원활하지 않습니다. </div> :
                    isLoaded ? 
                        <Map route={route} markers={markers} /> : 
                        <CircularProgress />
                }
                <PlaceInfo />
            </Drawer>
        </>
    )
}

export default MapDrawer