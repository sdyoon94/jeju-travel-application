import "globalStyle.css";
import "./Dates.css";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
// import axios from "axios";
import { format, differenceInDays,parseISO} from "date-fns";


function Calender({inputValues,setInputValues}) {
  const [show, setShow] = useState(false);
  const [warningMessage, setWarningMessage] = useState("")
  const handleChange = (item) => {

    const startDate = item.selection.startDate
    const limitEndDate = {
      startDate: startDate,
      endDate: addDays(startDate, 19),
      key: "selection",
    }
    console.log('여기', [item.selection])
    setInputValues(['range',[item.selection]])
    const periodInDays = differenceInDays(item.selection.endDate, item.selection.startDate )
    if (periodInDays >= 19) {
      setWarningMessage("20일 이상의 일정은 추천이 어려워요")
      setShow(true)
      setInputValues(['range',[limitEndDate]])
      setInputValues(['periodInDays','19'])
    } else if (periodInDays === 0) {
      setShow(false)
      setInputValues(['periodInDays',"0"])
    } else { 
      setShow(false)
      setInputValues(['periodInDays',String(periodInDays)])
    }

  }

  return (
    <div className="dates-container">
      <div className="dates-header">
      <div className="inline-block subcontentfont-weight title-size" >
          <span>여행 </span>
          <span className="color-1">기간 </span>
          <span>정하기</span>
        </div>
        <div className="subcontentfont-weight content-size text-center gray">
          여행 기간은 최대 20일이에요
        </div>
      </div>
      <div className="adates-body">
        <DateRange
          locale={ko}
          onChange={(item)=> handleChange(item)}
          showSelectionPreview={false}
          moveRangeOnFirstSelection={false}
          months={1}
          ranges={inputValues.range}
          showMonthArrow={false}
          direction="vertical"
          scroll={{ enabled: true}}
          minDate={new Date()}
          showDateDisplay={false}
          color={"#1E88E5"}
        />
      </div>
      {show && <div className="warning2">{warningMessage}</div>}
      </div>
  );
}

export default Calender;

