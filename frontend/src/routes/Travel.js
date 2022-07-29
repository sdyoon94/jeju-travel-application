import Header from "components/Header/Header"
import TravelTitle from "components/Travel/TravelTitle";
import TravelBody from "components/Travel/TravelBody"
import React from "react";
import Dummy from "dummies/DummyTravel.json"

function Travel() {
    return (
        <React.Fragment>
            <Header>
                <p style={{"fontSize": "10px"}}>여행 계획 기록</p>
            </Header>
            <TravelTitle 
                Dummy={{profileURL: "./icons/plane.png", ...Dummy}}
            />
            <hr width="80%" />
            <TravelBody 
                travel={Dummy}
            />
        </React.Fragment>
    )
}

export default Travel;