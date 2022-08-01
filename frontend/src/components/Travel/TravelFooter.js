import MapDrawer from "./Drawer/MapDrawer"

import "./TravelFooter.css"

function TravelFooter({ courses, courseIdx }) {
    return (
        <div className="travel-footer">
            <MapDrawer
                courses={ courses }
                courseIdx={ courseIdx }
            />
        </div>
    )
}

export default TravelFooter