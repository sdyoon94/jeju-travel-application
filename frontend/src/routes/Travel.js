import Header from "components/Header"
import TravelTitle from "components/Travel/TravelTitle";
import React from "react";

function Travel() {
    return (
        <React.Fragment>
            <Header>
                <p style={{"fontSize": "10px"}}>여행 계획 기록</p>
            </Header>
            <TravelTitle />
            <hr width="80%" />
        </React.Fragment>
    )
}

export default Travel;