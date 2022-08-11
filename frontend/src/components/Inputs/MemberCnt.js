import { TextField,InputAdornment } from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import "globalStyle.css";
import "./MemberCnt.css";
import {ReactComponent as Minus} from "assets/button/minus.svg"
import {ReactComponent as Plus} from "assets/button/plus.svg"

// 인원선택
function MemberCnt(props) {
  const [show, setShow] = useState(false);

  const handleChangeMemberCnt = (event) => {
    if (0 <= event.target.value && event.target.value <= 8) {
      props.setInputValues(["maxMemberCnt", event.target.value]);
      setShow(false);
    } else if (8 < event.target.value) {
      console.log(event.target.value);
      console.log(typeof event.target.value);
      props.setInputValues(["maxMemberCnt", "8"]);
      setShow(true);
    }
  };

  function incrementCount() {
    const cnt = String(Number(props.inputValues.maxMemberCnt) + 1);
    if (cnt <= 8) {
      props.setInputValues(["maxMemberCnt", cnt]);
      setShow(false);
    } else if (8 < cnt) {
      props.setInputValues(["maxMemberCnt", "8"]);
      setShow(true);
    }
  }
  function decrementCount() {
    const cnt = String(Number(props.inputValues.maxMemberCnt) - 1);
    if (1 <= cnt) {
      props.setInputValues(["maxMemberCnt", cnt]);
      setShow(false);
    } else {
      props.setInputValues(["maxMemberCnt", "1"]);
      setShow(true);
    }
  }

  const ExampleTextField = styled(TextField)({
    backgroundColor: "transparent",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    },
    "& .MuiInputBase-root": {
      "& input": {
          textAlign: "center"
      }
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "rgb(0 0 0)",
      color: "rgb(0 0 0)",
    }
  });

  return (
    <div className="departure-container">
      <div className="departure-header">
        <div className="inline-block subcontentfont-weight title-size text-center" >
          <span className="color-1">몇명</span>
          <span>이서</span>
        </div>
        <div className=" subcontentfont-weight title-size text-center ">떠나시나요?</div>
      </div>
      <div className="departure-body">
        <div></div>
        {show && <div className="warning2">최소 1 최대 8 ㄱㄱ하셈</div>}
        {/* <label className="input-box" for="member-cnt-input">
          <label className="input-label" htmlFor="select-departure">
            출발지
          </label>
          <ExampleTextField
            className="select-departure"
            id="select-departure"
            select
            value={departure}
            onChange={handleChangeDeparture}
            InputProps={{ style: { fontSize: 20 } }}
          >
            {departures.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </ExampleTextField>
        </label> */}
        <label className="membercnt-input-box" htmlFor="member-cnt-input">
          {/* <label className="input-label" htmlFor="member-cnt-input">
            인원수
          </label> */}
          <div className="control-member-cnt">
            <button className="member-cnt-btn" onClick={decrementCount}>
              <Minus className="member-btn"></Minus>
            </button>
            <ExampleTextField
              id="member-cnt-input"
              className="member-cnt-input"
              type="number"
              value={props.inputValues.maxMemberCnt}
              onChange={handleChangeMemberCnt}
              // variant="standard"
              InputProps={{ style: { fontSize: 20 }, endAdornment: <InputAdornment position="start"><div style={{fontSize: "20px",color:"black" }}>명</div></InputAdornment>}}
              // autoFocus
              disabled
            />
            <button className="member-cnt-btn" onClick={incrementCount}>
              <Plus className="member-btn"></Plus>
            </button>
          </div>
        </label>
      </div>
    </div>
  );
}

export default MemberCnt;
