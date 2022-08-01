import { Drawer } from "@mui/material"
import { useState } from "react"

import { ReactComponent as Settings } from "assets/settings.svg"

import "./ConfigDrawer.css"

function ConfigDrawer({ title, setTitle, startDate, setStartDate, styles, setStyles, budget, setBudget, vehicle, setVehicle }) {
    const [ isDrawerOpened, setIsDrawerOpened ] = useState(false)

    const toggleDrawer = () => {
        setIsDrawerOpened(true)
    }
    const closeDrawer = () => {
        setIsDrawerOpened(false)
    }

    return (
        <div className="travel-config">
            <Settings className="icon"
                onClick={toggleDrawer}
            />
            <Drawer
                anchor={"bottom"}
                open={isDrawerOpened}
                onClose={closeDrawer}
            >
                <h1>설정</h1>
                <p>여행 제목 변경</p>
                <p>여행 날짜 변경</p>
                <p>여행 스타일 수정</p>
                <p>여행 경비 변경</p>
                <p>이동수단 변경</p>
                <p>여행 나가기</p>
            </Drawer>
        </div>
    )
}

export default ConfigDrawer