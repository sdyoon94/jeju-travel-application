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
          textAlign: "start"
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
        {show && <div className="warning2">동행가능인원은 1~8명 이에요</div>}
        <label className="membercnt-input-box" htmlFor="member-cnt-input">
          <div className="control-member-cnt">
            <button className="member-cnt-btn" onClick={decrementCount}>
              <Minus width="5vw" height="5vw"></Minus>
            </button>
            <ExampleTextField
              id="member-cnt-input"
              className="member-cnt-input"
              type="number"
              value={props.inputValues.maxMemberCnt}
              onChange={handleChangeMemberCnt}
              InputProps={{ style: { fontSize : '5vw' }, endAdornment: <InputAdornment position="start"><div style={{fontSize : '5vw', color:"black" }}>명</div></InputAdornment>}}
              disabled
            />
            <button className="member-cnt-btn" onClick={incrementCount}>
              <Plus width="5vw" height="5vw"></Plus>
            </button>
          </div>
        </label>
      </div>
    </div>
  );
}

export default MemberCnt;
