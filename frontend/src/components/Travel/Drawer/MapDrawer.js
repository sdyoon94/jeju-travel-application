import { Drawer } from "@mui/material"
import { ReactComponent as MapMarker } from "assets/map-marker.svg"

import { useState } from "react"

import "./MapDrawer.css"

function MapDrawer(props) {
    const [ isDrawerOpened, setIsDrawerOpened ] = useState(false)

    const toggleDrawer = () => {
        setIsDrawerOpened(true)
    }
    const closeDrawer = () => {
        setIsDrawerOpened(false)
    }

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
                <h1>Map</h1>
                <p>Map here</p>
                <p>Selected place description</p>
            </Drawer>
        </>
    )
}

export default MapDrawer