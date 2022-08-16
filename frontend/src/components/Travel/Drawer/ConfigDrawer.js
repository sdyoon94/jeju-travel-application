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
import Style from "components/Inputs/Style"
import TravelName from "components/EditModal/EditTravelName"
import Exit from "components/EditModal/ExitTravel"
import ReRecommend from "components/EditModal/ReRecommend"
import Fix from "routes/ScheduleFix"

import {parseISO,addDays} from "date-fns"

import "./ConfigDrawer.css"
import "globalStyle.css"
import "components/EditModal/ModalCommon.css"


function ConfigDrawer({travel, setTravel}) {
    ///// Drawer 조작 부분 /////
    const [ isDrawerOpened, setIsDrawerOpened ] = useState(false)

    const toggleDrawer = () => {
        setIsDrawerOpened(true)
    }
    const closeDrawer = () => {
        setIsDrawerOpened(false)
    }

    
    ///// Modal 조작 부분 ///// 
    
    //스타일 속성 정수형에서 배열로
    const integerToArray =  (n) => {
        const str = String(n)
        const mapfn  = (arg) => Number(arg)
        const arr = Array.from(str,mapfn)
        const emptyArr = Array(7-arr.length).fill(0)
        
        return [...emptyArr, ...arr]    
    }
    
    // prop 용이하게 info 형변환
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
        // style : integerToArray(travel.info.style),
        style : integerToArray(travel.info.style)
    }
    
    const [info, setInfo] = useState(initialInfo)

    const [schedules, setSchedules] = useState(travel.schedules)    
    
    



    // form 들로부터 올라온 변경값 저장
    const editInfo = (params) => {
        const ky = params[0]
        const val = params[1]
        setInfo({
            ...info,
            [ky] : val,
        })
    }

    const forms = [
        { 
            name : 'tripName',
            form: <TravelName inputValues={info} setInputValues={editInfo}></TravelName>,
            isFull : false
        },
        { 
            name : 'budget',
            form: <Budget inputValues={info} setInputValues={editInfo}></Budget>,
            isFull : false
        },
        {
            name : "range",
            form : <Dates inputValues={info} setInputValues={editInfo}></Dates>,
            isFull : true,
        },
        {
            name : "style",
            form : <Style inputValues={info} setInputValues={editInfo}></Style>,
            isFull : true,
        },
        {
            name : "vehicle",
            form : <Vehicle inputValues={info} setInputValues={editInfo}></Vehicle>,
            isFull : false,
        },
        {
            name : "fix",
            form : <Fix inputValues={info} setInputValues={editInfo}></Fix>,
            isFull : true,
        },
        {
            name : "exit",
            form : <Exit inputValues={info} setInputValues={editInfo}></Exit>,
            isFull : false,
        },
        {
            name : "rerecommend",
            form : <ReRecommend inputValues={info} setInputValues={editInfo}></ReRecommend>,
            isFull : false,
        },
        

    ]


 


    
    
    
    
    //Modal 호출
    const [open, setOpen] = useState({
        "tripName" : false,
        "range" : false,
        "budget": false,
        "style" : false,
        "vehicle": false,
        "exit" : false,
        "fix" : false,
        "rerecommend" : false,
    });

    // 모달 열기
    const handleClickOpen = (formName) => {
        setOpen({
            ...open,
            [formName] : true,
        });
    };
    
    
    
    //취소 버튼 시 동작
    
    // re-recommend 일때만 취소버튼 ===> 그냥수정요청
    // 나머지 상황에서는 취소버튼 ===> 모달닫고, setInfo
    const handleClose = (formName) => {
        //재추천-취소
        if (formName === 'rerecommend') {
            console.log('변경실행')
        }
        
        
        setOpen({
            ...open,
            [formName] : false,
        });

        // !!!!!!!! Drawer의 state 초기화 시켜주기 (수정중 취소를 누르고 다시 들어오면 변경중이던 데이터가 남아있음)

        setInfo(initialInfo)


    };


    // 확인 버튼 시 동작

    // 나가기상황 ===> 소켓접근 권한 제거, 남은 인원이 한명 일 때는 버튼 이름 여행삭제 (?????????????????)
    // 재추천상황 ===> 재추천요청
    // 나머지 ===>  수정요청
    
    const handleConfirm = (name) => {
        
        // console.log(initialInfo[name])
        // console.log(info[name])
        // console.log(JSON.stringify(initialInfo[name]))
        // console.log(JSON.stringify(info[name]))
        
        //재추천일 때 
        if (name === "rerecommend") {
            setOpen({
                ...open,
                [name] : false,
                ['fix'] : true
               })
            
            return
        }

        if (name === 'fix') {
            console.log('재주천')
            setOpen({
                ...open,
                [name] : false,
            })
            return
        }

        if (name === 'exit') {
            console.log('여행탈퇴')
            setOpen({
                ...open,
                [name] : false,
            })
            return
        }
        

        // 실제로 변경 된 값이 있는지 판단 => 변경 값없으면 걍 꺼줌 
        if ( JSON.stringify(initialInfo[name]) === JSON.stringify(info[name]) ){
            console.log('그냥꺼짐')
            handleClose(name)
        
        } else {
            // style/budget의 경우 재추천 물어보기
            if (name === 'budget'|| name === 'style') {
                setOpen({
                 ...open,
                 [name] : false,
                 ['rerecommend'] : true
                })
             } else {
                console.log("인포정보그냥변경")
                handleClose(name)
             }




        }

        // style/budget/fix 창에서 확인 클릭시 자기는 닫고 재추천 모달 열기
        
    }

    // 모달 버튼 이름 바꿔주기
    const buttonName = (name) => {
        if (name === 'exit') {
            return '삭제하기'
        } else if (name === 'rerecommend') {
            return '재추천 받기'
        } else {
            return '수정완료'
        }
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
                className="travel-drawer"
            >
                <header className="subcontent-size title-weight">설정</header>
                <p className="content-size content-weight" onClick={()=>{handleClickOpen("tripName")}}> 여행 제목 변경 </p>
                <p className="content-size content-weight" onClick={()=>{handleClickOpen("range")}}> 여행 날짜 변경 </p>
                <p className="content-size content-weight" onClick={()=>{handleClickOpen("style")}}> 여행 스타일 수정 </p>
                {/* <p className="content-size content-weight" onClick={()=>{handleClickOpen("budget")}}> 여행경비변경 </p> */}
                <p className="content-size content-weight" onClick={()=>{handleClickOpen("vehicle")}} > 이동수단 변경  </p>
                {/* <p className="content-size content-weight" onClick={()=>{handleClickOpen("fix")}} > 여행지 고정  </p> */}
                <p className="content-size content-weight red" onClick={()=>{handleClickOpen("exit")}}> 여행 나가기 </p>
            </Drawer>
            
            {/* ////////////////////////////DIALOGS//////////////////////////////////////////////////// */}

            { forms.map((value,index) => {
                return (
                   <Dialog 
                        className={value.isFull? 'full-modal modal-container': 'small-modal modal-container'}
                        key={value.name} 
                        fullScreen={value.isFull} 
                        open={open[value.name]} 
                        onClose={()=>{handleClose(value.name)}}>
                        
                        {value.isFull &&
                        <div className="dialog-btns-top">
                            <Button style={{color: "black"}} onClick={()=>{handleClose(value.name)}}>취소</Button>
                            <Button style={{color: "black"}} onClick={()=>{handleConfirm(value.name)}}>{buttonName(value.name)}</Button >
                        </div> 
                        }
                        
                        <div className={value.isFull? "full-dialog-content" : "small-dialog-content"}>
                            {value.form}
                        </div>
                        
                        
                        {!value.isFull &&
                        <div className="dialog-btns-bottom">
                            <Button variant="contained" onClick={()=>{handleClose(value.name)}}> {value.name === 'rerecommend'? '필요없어요' : '취소'} </Button>
                            <Button variant="contained" onClick={()=>{handleConfirm(value.name)}}> {buttonName(value.name)} </Button >
                        </div>
                        }
                   </Dialog> 
                )
            
            })
            }

            {/* <Dialog
                className='small-modal modal-container'
                fullScreen={false} 
                open={open.rerecommend}> 
                <div className="dialog-content">
                    <ReRecommend></ReRecommend>
                </div>
                <div className="dialog-btns-bottom">
                    <Button onClick={()=>{handleClose('rerecommend')}}>필요없어요</Button>
                    <Button variant="outlined"onClick={()=>{handleClose('rerecommend')}}>재추천받기</Button >
                </div>
            </Dialog> */}



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