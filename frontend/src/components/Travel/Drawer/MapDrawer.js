import { CircularProgress, Drawer } from "@mui/material"
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { ReactComponent as MapMarker } from "assets/map-marker.svg"

import { useCallback, useEffect, useState } from "react"

import "./MapDrawer.css"

const API_KEY = "AIzaSyA_Kp9lPUVHWZ5i3blrGYJRk8yG70ZovsM"
const containerStyle = {
    height: "30vh",
    width: "90vw"
}

function MapDrawer({ courses, courseIdx }) {

    const [ route, setRoute ] = useState(courses[courseIdx].route)
    const [ isDrawerOpened, setIsDrawerOpened ] = useState(false)

    const [ center, setCenter ] = useState({
        lat: 33.488830,
        lng: 126.498083
    })
    const [ markers, setMarkers ] = useState([])


    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: API_KEY
    })

    const Map = () => {
        const onLoad = useCallback((mapInstance) => {
            const infoWindow = new window.google.maps.InfoWindow()

            while (markers.length > 0) {
                markers.pop().setMap(null)
            }

            const center_ = {
                lat: 0.0,
                lng: 0.0
            }

            route.forEach((place, idx) => {
                const lat = place.lat
                const lng = place.lng

                center_.lat += lat
                center_.lng += lng

                const marker = new window.google.maps.Marker({
                    position: {
                        lat,
                        lng
                    },
                    map: mapInstance,
                    title: `${idx+1}. ${place.name}`,
                    label: `${idx+1}`,
                    optimized: false
                })

                marker.addListener("click", () => {
                    infoWindow.close()
                    infoWindow.setContent(marker.getTitle())
                    infoWindow.open(marker.getMap(), marker)
                })

                markers.push(marker)
            })

            if (route.length > 0) {
                center_.lat /= route.length
                center_.lng /= route.length
                mapInstance.setCenter(center_)
            }
        })

        return <div className="google-map-container">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={11}
                onLoad={onLoad}
            >
            </GoogleMap>
        </div>
    }

    const toggleDrawer = () => {
        setIsDrawerOpened(true)
    }
    const closeDrawer = () => {
        setIsDrawerOpened(false)
    }

    useEffect(() => {
        setRoute(courses[courseIdx].route)
    }, [ courseIdx, courses ] )

    return (
        <>
            <MapMarker
                className="map-marker"
                onClick={toggleDrawer} 
            />
            <Drawer
                anchor={"bottom"}
                open={isDrawerOpened}
                onClose={closeDrawer}
            >
                <h2>Map</h2>
                { loadError ? 
                    <div>현재 지도 호출이 원활하지 않습니다. </div> :
                    isLoaded ? 
                        <Map /> : 
                        <CircularProgress />
                }
                {
                    route.map((place, i) => {
                        return <p key={i}>{ place.name }</p>
                    })
                }
            </Drawer>
        </>
    )
}

export default MapDrawer