import { TextField } from "@mui/material";
import "globalStyle.css";
import "./EditTravelName.css";

// 여행 경비 입력
function ExitTravel({inputValues,setInputValues}) {
  // const [show, setShow] = useState(false);

  // const handleChange = (event) => {
  //   if (0 <= event.target.value && event.target.value <= 9999) {
  //     props.setInputValues(["title", event.target.value]);
  //     setShow(false);
  //   } else if (event.target.value >= 10000) {
  //     props.setInputValues(["title", "9999"]);
  //     setShow(true);
  //   }
  // };

  

  return (
    <div className="title-container">
      <div className="title-header">
        <div className="inline-block subcontentfont-weight title-size text-center" >
          <span>여행을 </span>
          <span style={{color: 'red'}}>삭제 </span>
          <span>하시겠어요?</span>
        </div>
        <div style={{marginTop: "1vh"}} className="subcontentfont-weight content-size text-center gray">삭제된 일정은 다시 볼 수 없어요</div>
      </div>
    </div>
    
  );
}

export default ExitTravel