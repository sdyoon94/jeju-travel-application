import MapDrawer from "./Drawer/MapDrawer"

import "./TravelFooter.css"

function TravelFooter({ courseIdx }) {
    return (
        <div className="travel-footer">
            <MapDrawer
                courseIdx={ courseIdx }
            />
        </div>
    )
}

export default TravelFooter