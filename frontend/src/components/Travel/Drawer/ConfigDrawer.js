import { Drawer } from "@mui/material"
import { useState } from "react"

import { ReactComponent as Settings } from "assets/settings.svg"

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Modal from '../../Modal/Modal'

import Budget from "components/Inputs/Budget";



import "./ConfigDrawer.css"

function ConfigDrawer(props) {
    const [ isDrawerOpened, setIsDrawerOpened ] = useState(false)

    const toggleDrawer = () => {
        setIsDrawerOpened(true)
    }
    const closeDrawer = () => {
        setIsDrawerOpened(false)
    }

    //Modal 호출
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    // const [travel, setTravel] = useState(props.travel)





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
                <p onClick={handleClickOpen}>여행경비변경</p>
                <p>이동수단 변경</p>
                <p>여행 나가기</p>
            </Drawer>
            <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogContent>
                <Budget
                    inputValues={props.travel}
                    setInputValues={props.setTravel}
                ></Budget>
                {/* <DialogContentText id="alert-dialog-description">
                Let Google help apps determine location. This means sending anonymous
                location data to Google, even when no apps are running.
                </DialogContentText> */}
            </DialogContent>    
            <DialogActions>
                <Button onClick={handleClose}>Disagree</Button>
                <Button onClick={handleClose} autoFocus>
                Agree
            </Button>
            </DialogActions>

            </Dialog>
        </div>
    )
}

export default ConfigDrawer