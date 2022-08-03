import { TextField } from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import "globalStyle.css";
import "./MemberCnt.css";

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
    } else if (8 < cnt) {
      props.setInputValues(["maxMemberCnt", "8"]);
      setShow(true);
    }
  }
  function decrementCount() {
    const cnt = String(Number(props.inputValues.maxMemberCnt) - 1);
    if (1 <= cnt) {
      props.setInputValues(["maxMemberCnt", cnt]);
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
  });

  return (
    <div className="departure-container">
      <div className="departure-header">
        <div className="mention" style={{ color: "#1E88E5" }}>
          본인포함 몇명이서
        </div>
        <div className="mention">떠나시나요?</div>
      </div>
      <div className="departure-body">
        <div></div>
        {show && <div className="warning">최소 1 최대 8 ㄱㄱ하셈</div>}
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
        <label item className="input-box" htmlFor="member-cnt-input">
          <label className="input-label" htmlFor="member-cnt-input">
            인원수
          </label>
          <div className="control-member-cnt">
            <button className="member-cnt-btn" onClick={decrementCount}>
              -
            </button>
            <ExampleTextField
              id="member-cnt-input"
              className="member-cnt-input"
              type="number"
              value={props.inputValues.maxMemberCnt}
              onChange={handleChangeMemberCnt}
              // variant="standard"
              InputProps={{ style: { fontSize: 20 } }}
              autoFocus
            />
            <button className="member-cnt-btn" onClick={incrementCount}>
              +
            </button>
          </div>
        </label>
      </div>
    </div>
  );
}

export default MemberCnt;
