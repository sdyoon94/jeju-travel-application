import { Drawer } from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ReactComponent as Settings } from "assets/settings.svg";

import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";

import Budget from "components/Inputs/Budget";
import Dates from "components/EditModal/EditDates";
import Vehicle from "components/EditModal/EditVehicle";
import Style from "components/Inputs/Style";
import TravelName from "components/EditModal/EditTravelName";
import Exit from "components/EditModal/ExitTravel";
import ReRecommend from "components/EditModal/ReRecommend";
import Fix from "routes/ScheduleFix";

import { parseISO, addDays, format } from "date-fns";

import "./ConfigDrawer.css";
import "globalStyle.css";
import "components/EditModal/ModalCommon.css";
import {setTravelInfo} from "store/modules/travelSlice"
import {changeTravelList} from "store/modules/travelListSlice"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ConfigDrawer({ travel, setTravel }) {
  ///// Drawer 조작 부분 /////
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpened(true);
    // socket.emit("grant travelinfo authority",()=>);
  };
  const closeDrawer = () => {
    setIsDrawerOpened(false);
  };

  const dispatch = useDispatch()
  const navigate = useNavigate()
  ///// Modal 조작 부분 /////

  //스타일 속성 정수형에서 배열로
  const integerToArray = (n) => {
    const str = String(n);
    const mapfn = (arg) => Number(arg);
    const arr = Array.from(str, mapfn);
    const emptyArr = Array(7 - arr.length).fill(0);
    return [...emptyArr, ...arr];
  };

  // prop 용이하게 info 형변환
  const initialInfo = {
    ...travel.info,
    range: travel.info.startDate
      ? [
          {
            startDate: parseISO(travel.info.startDate),
            endDate: addDays(
              parseISO(travel.info.startDate),
              travel.info.periodInDays - 1
            ),
            key: "selection",
          },
        ]
      : [
          {
            startDate: new Date(),
            endDate: addDays(new Date(), travel.info.periodInDays - 1),
            key: "selection",
          },
        ],
    // style : integerToArray(travel.info.style),
    style: integerToArray(travel.info.style),
  };

  const [info, setInfo] = useState(initialInfo);
  // 여행정보 변경 후 Drawer state 재설정
  useEffect(()=>{
    setInfo({
      ...travel.info,
      range: travel.info.startDate
        ? [
            {
              startDate: parseISO(travel.info.startDate),
              endDate: addDays(
                parseISO(travel.info.startDate),
                travel.info.periodInDays - 1
              ),
              key: "selection",
            },
          ]
        : [
            {
              startDate: new Date(),
              endDate: addDays(new Date(), travel.info.periodInDays - 1),
              key: "selection",
            },
          ],
      // style : integerToArray(travel.info.style),
      style: integerToArray(travel.info.style),
    }) 
  },[travel.info])



  // form 들로부터 올라온 변경값 저장
  const editInfo = (params) => {
    const ky = params[0];
    const val = params[1];
    setInfo({
      ...info,
      [ky]: val,
    });
  };
  const [ newRecommend, setNewRecommend ] = useState(false)
  
  const forms = [
    {
      name: "tripName",
      form: (
        <TravelName inputValues={info} setInputValues={editInfo}></TravelName>
      ),
      isFull: false,
    },
    {
      name: "budget",
      form: <Budget inputValues={info} setInputValues={editInfo}></Budget>,
      isFull: false,
    },
    {
      name: "range",
      form: <Dates inputValues={info} setInputValues={editInfo}></Dates>,
      isFull: true,
    },
    {
      name: "style",
      form: <Style inputValues={info} setInputValues={editInfo}></Style>,
      isFull: true,
    },
    {
      name: "vehicle",
      form: <Vehicle inputValues={info} setInputValues={editInfo}></Vehicle>,
      isFull: false,
    },
    {
      name: "fix",
      form: <Fix inputValues={info} setInputValues={editInfo} newRecommend={newRecommend} ></Fix>,
      isFull: true,
    },
    {
      name: "exit",
      form: <Exit inputValues={info} setInputValues={editInfo}></Exit>,
      isFull: false,
    },
    {
      name: "rerecommend",
      form: (
        <ReRecommend inputValues={info} setInputValues={editInfo}></ReRecommend>
      ),
      isFull: false,
    },
  ];

  //Modal 호출
  const [open, setOpen] = useState({
    tripName: false,
    range: false,
    budget: false,
    style: false,
    vehicle: false,
    exit: false,
    fix: false,
    rerecommend: false,
  });

  const socket = useSelector((state) => state.socket.socket);

  const socketInfoSubmit = () => {
    // 데이터 재 가공
    const data = {
      ...info,
      startDate: format(info.range[0].startDate, "yyyy-MM-dd"),
      style: info.style.join(""),
    };
    socket.emit("put travel info", data, (response) => {
      if (response.status === "ok") {
        dispatch(setTravelInfo(data))
        dispatch(changeTravelList(data)) // TravelList
        alert("여행정보가 변경되었습니다");
      } else if (response.status === "bad") {
        alert("여행정보변경에 실패했습니다 다시 시도해주세요");
      }
    });
  };

  // 수정권한 뺏음
  const revoke = () => {
    socket.emit("revoke travelinfo authority", (response) => {
    });
  };

  // 모달 열기
  const handleClickOpen = (formName) => {
    if (formName === "exit") {
      // 여행 Exit 용 grant 새로 만들기
      // 자신이 마지막 여행 멤버라면 -> 여행 삭제
      // 자신 제외 다른 멤버가 남아 있으면 -> 본인만 memberlist에서 삭제
    } 
    
    socket.emit("grant travelinfo authority", (response) => {
    if (response.status === 'ok') {
      setOpen({
        ...open,
        [formName]: true,
      })
    } else if (response.status === 'bad') {
      alert("현재 다른 사용자가 수정 중 입니다 잠시 후 다시 시도해주세요")
    } else {
      console.log("그랜트 ok/bad 도 아닌 오류")
    } 
     
    })
  };

  //취소 버튼 시 동작

  // re-recommend 일때만 취소버튼 ===> 그냥수정요청
  // 나머지 상황에서는 취소버튼 ===> 모달닫고, setInfo
  const handleClose = (formName) => {
    //재추천-취소
    if (formName === "rerecommend") {
      console.log("변경실행");
      socketInfoSubmit();
      // alert("여행 정보가 변경 되었습니다");
    }

    if (formName === "fix") {
      console.log("변경실행");
      socketInfoSubmit();
      // alert("그냥 정보만 변경 되었음");
    }

    setOpen({
      ...open,
      [formName]: false,
    });

    revoke();

    // !!!!!!!! Drawer의 state 초기화 시켜주기 (수정중 취소를 누르고 다시 들어오면 변경중이던 데이터가 남아있음)
    setInfo(initialInfo);
  };

  // 확인 버튼 시 동작

  // 나가기상황 ===> 소켓접근 권한 제거, 남은 인원이 한명 일 때는 버튼 이름 여행삭제 (?????????????????)
  // 재추천상황 ===> 재추천요청
  // 나머지 ===>  수정요청


  const handleConfirm = (name) => {
    //재추천일 때
    if (name === "rerecommend") {
      setNewRecommend(false)
      setOpen({
        ...open,
        [name]: false,
        ["fix"]: true,
      });
      
      return;
    }
    
    if (name === "fix") {
      console.log("재주천");
      /// 재추천 요청
      setNewRecommend(true)
      setOpen({
        ...open,
        [name]: false,
      });
      // 재추천 EMIT ㄲ////////////////////!!!!!!!!!
      return;
    }

    if (name === "exit") {
      socket.emit("여행탈퇴", (response)=>{
        if (response.status === "ok"){
          /////////
        }
      })
      setOpen({
        ...open,
        [name]: false,
      });
      window.location.replace("/")
      return;
    }

    // 실제로 변경 된 값이 있는지 판단 => 변경 값없으면 걍 꺼줌
    if (JSON.stringify(initialInfo[name]) === JSON.stringify(info[name])) {
      console.log("그냥꺼짐");
      handleClose(name);
    } else {
      // style/budget의 경우 재추천 물어보기
      if (name === "budget" || name === "style") {
        setOpen({
          ...open,
          [name]: false,
          ["rerecommend"]: true,
        });
      } else {
        console.log("인포정보그냥변경"); 
        socketInfoSubmit();
        handleClose(name);
      }
    }

    // style/budget/fix 창에서 확인 클릭시 자기는 닫고 재추천 모달 열기
  };

  // 모달 버튼 이름 바꿔주기
  const buttonName = (name) => {
    if (name === "exit") {
      return "삭제하기";
    } else if (name === "rerecommend") {
      return "재추천 받기";
    } else {
      return "수정완료";
    }
  };

  return (
    <div className="travel-config">
      <Settings className="icon" onClick={toggleDrawer} />
      <Drawer
        anchor={"bottom"}
        open={isDrawerOpened}
        onClose={closeDrawer}
        className="travel-drawer"
      >
        <header className="subcontent-size title-weight">설정</header>
        <p
          className="content-size content-weight"
          onClick={() => {
            handleClickOpen("tripName");
          }}
        >
          {" "}
          여행 제목 변경{" "}
        </p>
        <p
          className="content-size content-weight"
          onClick={() => {
            handleClickOpen("range");
          }}
        >
          {" "}
          여행 날짜 변경{" "}
        </p>
        <p
          className="content-size content-weight"
          onClick={() => {
            handleClickOpen("style");
          }}
        >
          {" "}
          여행 스타일 수정{" "}
        </p>
        {/* <p className="content-size content-weight" onClick={()=>{handleClickOpen("budget")}}> 여행경비변경 </p> */}
        <p
          className="content-size content-weight"
          onClick={() => {
            handleClickOpen("vehicle");
          }}
        >
          {" "}
          이동수단 변경{" "}
        </p>
        {/* <p className="content-size content-weight" onClick={()=>{handleClickOpen("fix")}} > 여행지 고정  </p> */}
        <p
          className="content-size content-weight red"
          onClick={() => {
            handleClickOpen("exit");
          }}
        >
          {" "}
          여행 나가기{" "}
        </p>
      </Drawer>

      {/* ////////////////////////////DIALOGS//////////////////////////////////////////////////// */}

      {forms.map((value, index) => {
        return (
          <Dialog
            className={
              value.isFull
                ? "full-modal modal-container"
                : "small-modal modal-container"
            }
            key={value.name}
            fullScreen={value.isFull}
            open={open[value.name]}
            onClose={
              value.name === "rerecommend"
                ? () => {}
                : () => {
                    handleClose(value.name);
                  }
            }
          >
            {value.isFull && (
              <div className="dialog-btns-top">
                <Button
                  style={{ color: "black" }}
                  onClick={() => {
                    handleClose(value.name);
                  }}
                >
                  취소
                </Button>
                <Button
                  style={{ color: "black" }}
                  onClick={() => {
                    handleConfirm(value.name);
                  }}
                >
                  {buttonName(value.name)}
                </Button>
              </div>
            )}

            <div
              className={
                value.isFull ? "full-dialog-content" : "small-dialog-content"
              }
            >
              {value.form}
            </div>

            {!value.isFull && (
              <div className="dialog-btns-bottom">
                <Button
                  variant="contained"
                  onClick={() => {
                    handleClose(value.name);
                  }}
                >
                  {" "}
                  {value.name === "rerecommend" ? "취소" : "취소"}{" "}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleConfirm(value.name);
                  }}
                >
                  {" "}
                  {buttonName(value.name)}{" "}
                </Button>
              </div>
            )}
          </Dialog>
        );
      })}

    </div>
  );
}

export default ConfigDrawer;
