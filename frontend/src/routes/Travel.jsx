import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import Header from "components/Header/Header"
import TravelTitle from "components/Travel/TravelTitle"
import TravelBody from "components/Travel/TravelBody"

import ConfigDrawer from "components/Travel/Drawer/ConfigDrawer"
import { initDirection } from "store/modules/directionSlice"
import { setTravel } from "store/modules/travelSlice"
// import { initDirections, fetchDirection } from "store/modules/distanceSlice"
// import { fetchDistanceMatrix } from "store/modules/distanceMatrixSlice"

function Travel() {
    // travelUid를 통해 여행 정보 가져오기
    const { travelUid } = useParams()
    // get travel
    const travel = useSelector((state) => state.travel)
    const dispatch = useDispatch()
    


    // // immutable
    // const travelUid = travel.travelUid
    
    // // TravelTitle
    // const maxMemberCnt = travel.maxMemberCnt
    // const joinAddress = travel.joinAddress
    // const [ title, setTitle ] = useState(travel.title)
    // const [ members, setMembers ] = useState(travel.members)
    // const [ budget, setBudget ] = useState(travel.budget)
    // const [ styles, setStyles ] = useState(travel.styles)
    // const [ vehicle, setVehicle ] = useState(travel.vehicle)

    // // TravelTitle, TravelBody
    // const [ startDate, setStartDate ] = useState(travel.startDate)
    const [ periodInDays, setPeriodInDays ] = useState(travel.periodInDays)

    // TravelBody, TravelFooter
    const [ courses, setCourses ] = useState(travel.courses)
    const [ courseIdx, setCourseIdx ] = useState(0)

    // // TravelBody
    // const [ startTime, setStartTime ] = useState(travel.startTime)
    // const [ endTime, setEndTime ] = useState(travel.endTime)

    // // only config
    // const [ lastModified, setLastModified ] = useState(travel.lastModified)
    // const [ startDateList, setStartDateList ] = useState(travel.startDateList)
    
    
    
    useEffect(() => {
        dispatch(initDirection(periodInDays))
    }, [])

    return (
        <>
            <div className="travel-container">
                <Header>
                    <ConfigDrawer
                        travel={travel}
                        setTravel={(v)=>{dispatch(setTravel(v))}}
                    />
                </Header>
                <TravelTitle />
                <TravelBody
                    courseIdx={courseIdx}
                    setCourseIdx={setCourseIdx}
                />
            </div>
        </>
    )
}

export default Travel