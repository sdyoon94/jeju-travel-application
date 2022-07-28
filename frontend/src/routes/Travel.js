import React from "react";

import Header from "components/Header"
import TravelTitle from "components/Travel/TravelTitle";
import TravelBody from "components/Travel/TravelBody"
import TravelFooter from "components/Travel/TravelFooter";

import Dummy from "dummies/DummyTravel.json"

function Travel() {
    return (
        <>
            <div className="travel-container">
                <Header>
                    <p style={{"fontSize": "10px"}}>여행 계획 기록</p>
                </Header>
                <TravelTitle 
                    travel={{profileURL: "./icons/plane.png", ...Dummy}}
                />
                <TravelBody 
                    travel={Dummy}
                />
                <TravelFooter />
            </div>
        </>
        
    )
}

export default Travel;