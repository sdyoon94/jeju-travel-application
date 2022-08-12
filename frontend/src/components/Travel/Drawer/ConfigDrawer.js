import { Drawer } from "@mui/material"
import { useState } from "react"

import { ReactComponent as Settings } from "assets/settings.svg"

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import EditModal from 'components/EditModal/EditModal'

import Budget from "components/Inputs/Budget";
import Dates from "components/EditModal/EditDates"
import Vehicle from "components/EditModal/EditVehicle"

import { ko } from "date-fns/locale";
import {parseISO,addDays} from "date-fns"

import "./ConfigDrawer.css"


function ConfigDrawer({travel, setTravel}) {
    const [ isDrawerOpened, setIsDrawerOpened ] = useState(false)

    const toggleDrawer = () => {
        setIsDrawerOpened(true)
    }
    const closeDrawer = () => {
        setIsDrawerOpened(false)
    }

    
    //Modal prop용 자체 state 생성 
    console.log(typeof travel.info.periodInDays)
    const initialInfo = {
        ...travel.info,
        range : travel.info.startDate? 
        [
            {
                startDate: parseISO(travel.info.startDate),
                endDate: addDays(parseISO(travel.info.startDate), travel.info.periodInDays - 1),
                key: "selection",
            }
        ]: 
        [ 
            {
                startDate: new Date(),
                endDate: addDays(new Date(), travel.info.periodInDays - 1 ),
                key: "selection",
            }

            ],

    }

    const [info, setInfo] = useState(initialInfo)

    const [schedules, setSchedules] = useState(travel.schedules)

    const [dialogOpen, setDialogOpen] = useState({
        title : false,
        dates : false,
        style : false,
        budget : false,
        vehicle : false,
        delete : false,
    })
    


    //자체 함수 
    const editInfo = (params) => {
        const ky = params[0]
        const val = params[1]
        
        // newInfo[params[0]] = params[1]
        // setInfo(newInfo)
        console.log('여기여기', ky, val)
        setInfo({
            ...info,
            [ky] : val,
        })
    }


    const forms = [
        { 
            name : 'budget',
            form: <Budget inputValues={info} setInputValues={editInfo}></Budget>,
            isFull : false
        },
        {
            name : "dates",
            form : <Dates inputValues={info} setInputValues={editInfo}></Dates>,
            isFull : true,
        },
        {
            name : "vehicle",
            form : <Vehicle inputValues={info} setInputValues={editInfo}></Vehicle>,
            isFull : false,
        },
    ]


    // const setTarget = (target) => {
        
    //     return a[target]
    // }

    
    let target = null
    
    
    //Modal 호출
    const [open, setOpen] = useState({
        "dates" : false,
        "budget": false,
        "vehicle": false,
    });
    // const [target, setTarget] = useState(false)

    
    const handleClickOpen = (formName) => {
        // console.log(t)
        target = forms[formName]
        // console.log(target)
        // setTarget(target)
        setOpen({
            ...open,
            [formName] : true,
        });
    };
  
    const handleClose = (formName) => {
        
        setOpen({
            ...open,
            [formName] : false,
        });

        // !!!!!!!! Drawer의 state 초기화 시켜주기 (수정중 취소를 누르고 다시 들어오면 변경중이던 데이터가 남아있음)

        setInfo(travel.info)


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
                <p onClick={()=>{handleClickOpen("dates")}}>여행 날짜 변경</p>
                <p > 여행 스타일 수정 </p>
                <p onClick={()=>{handleClickOpen("budget")}}> 여행경비변경 </p>
                <p onClick={()=>{handleClickOpen("vehicle")}} >이동수단 변경  </p>
                <p>여행 나가기</p>
            </Drawer>
            
            {/* ////////////////////////////DIALOGS//////////////////////////////////////////////////// */}
            
            { forms.map((value,index) => {
                return (
                   <Dialog key={index} fullScreen={value.isFull} open={open[value.name]} onClose={()=>{handleClose(value.name)}}>
                    {value.form}
                   </Dialog> 
                )
            
            })
            }



            {/* <Dialog
             fullScreen={true}
             open={open}
             onClose={handleClose}
            >
            <DialogContent>
                {target}    
            </DialogContent>
            <div>
                <Button onClick={handleClose}>Disagree</Button>
                <Button variant="outlined"onClick={handleClose} autoFocus>
                AGREE
                </Button >
            </div>
            </Dialog> */}



            
            
            
{/*             
            <Dialog
            // fullScreen
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogContent>
                <Budget
                    inputValues={info}
                    setInputValues={editInfo}
                ></Budget>
                <DialogContentText id="alert-dialog-description">
                Let Google help apps determine location. This means sending anonymous
                location data to Google, even when no apps are running.
                </DialogContentText>
            </DialogContent>    
            <div>
                <Button onClick={handleClose}>Disagree</Button>
                <Button variant="outlined"onClick={handleClose} autoFocus>
                Agree
            </Button >
            </div>

            </Dialog> */}
        
        
            
        
        </div>
    )
}

export default ConfigDrawer