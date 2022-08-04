import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"

import Header from "components/Header/Header"
import TravelTitle from "components/Travel/TravelTitle"
import TravelBody from "components/Travel/TravelBody"
import TravelFooter from "components/Travel/TravelFooter"

import ConfigDrawer from "components/Travel/Drawer/ConfigDrawer"
import { initDirection } from "store/modules/directionSlice"

// import { initDirections, fetchDirection } from "store/modules/distanceSlice"
// import { fetchDistanceMatrix } from "store/modules/distanceMatrixSlice"

function Travel() {
    // get travel
    const travel = useSelector((state) => state.travel)
    console.log(travel)

    // immutable
    const travelUid = travel.travelUid
    
    // TravelTitle
    const maxMemberCnt = travel.maxMemberCnt
    const joinAddress = travel.joinAddress
    const [ title, setTitle ] = useState(travel.title)
    const [ members, setMembers ] = useState(travel.members)
    const [ budget, setBudget ] = useState(travel.budget)
    const [ styles, setStyles ] = useState(travel.styles)
    const [ vehicle, setVehicle ] = useState(travel.vehicle)

    // TravelTitle, TravelBody
    const [ startDate, setStartDate ] = useState(travel.startDate)
    const [ periodInDays, setPeriodInDays ] = useState(travel.periodInDays)

    // TravelBody, TravelFooter
    const [ courses, setCourses ] = useState(travel.courses)
    const [ courseIdx, setCourseIdx ] = useState(0)

    // TravelBody
    const [ startTime, setStartTime ] = useState(travel.startTime)
    const [ endTime, setEndTime ] = useState(travel.endTime)

    // only config
    const [ lastModified, setLastModified ] = useState(travel.lastModified)
    const [ startDateList, setStartDateList ] = useState(travel.startDateList)
    
    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(initDirection(periodInDays))
    }, [])

    return (
        <>
            <div className="travel-container">
                <Header>
                    <ConfigDrawer
                        title={title}
                        setTitle={setTitle}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        styles={styles}
                        setStyles={setStyles}
                        budget={budget}
                        setBudget={setBudget}
                        vehicle={vehicle}
                        setVehicle={setVehicle}
                    />
                </Header>
                <TravelTitle />
                <TravelBody
                    courseIdx={courseIdx}
                    setCourseIdx={setCourseIdx}
                />
                <TravelFooter
                    courseIdx={courseIdx}
                />
            </div>
        </>
    )
}

export default Travel