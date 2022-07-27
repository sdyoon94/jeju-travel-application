import { ReactComponent as MapMarker } from "assets/map-marker.svg"

import "./TravelFooter.css"

function TravelFooter(props) {
    return (
        <div className="travel-footer">
            <MapMarker width={40} height={40} />
        </div>
    )
}

export default TravelFooter