import MapDrawer from "./Drawer/MapDrawer"

import "./TravelFooter.css"

function TravelFooter({ startDate, courses, courseIdx }) {
    return (
        <div className="travel-footer">
            <MapDrawer
                startDate={ startDate }
                courses={ courses }
                courseIdx={ courseIdx }
            />
        </div>
    )
}

export default TravelFooter