import { Drawer } from "@mui/material"
import { useState } from "react"

import "./ConfigDrawer.css"

function ConfigDrawer(props) {
    const [ isDrawerOpened, setIsDrawerOpened ] = useState(false)

    const toggleDrawer = () => {
        setIsDrawerOpened(true)
    }
    const closeDrawer = () => {
        setIsDrawerOpened(false)
    }

    return (
        <div className="travel-config">
            <p
                onClick={toggleDrawer}
            >설정</p>
            <Drawer
                anchor={"bottom"}
                open={isDrawerOpened}
                onClose={closeDrawer}
            >
                <h1>Config</h1>
                <p>Config 1</p>
                <p>Config 2</p>
                <p>Config 3</p>
                <p>Config 4</p>
                <p>Config 5</p>
            </Drawer>
        </div>
    )
}

export default ConfigDrawer