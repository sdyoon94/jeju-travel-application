import "globalStyle.css";
import "../Inputs/Dates.css";
import 'components/EditModal/EditDates.css'
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file




function Calender({inputValues,setInputValues}) {
  const [isFirst, setIsFirst] = useState(true)
  const handleChange = (item) => {
    const startDate = isFirst? item.selection.startDate : item.selection.endDate
    const endDate = addDays(startDate, inputValues.periodInDays - 1)
    const newRange = [{
      startDate : startDate,
      endDate : endDate,
      key: "selection",
    }]

    setInputValues(['range',newRange])
    setIsFirst(!isFirst)

  }


  return (
    <div className="edit-dates-container">
      <div className="dates-header">
      <div className="inline-block subcontentfont-weight title-size" >
          <span>여행 </span>
          <span className="color-1">날짜 </span>
          <span>정하기</span>
        </div>
        <div className="subcontentfont-weight content-size text-center gray">
          여행 기간은 {inputValues.periodInDays}일로 변경 할 수 없어요
        </div>
      </div>
      <div className="adates-body">
        <DateRange
          locale={ko}
          onChange={(item)=> handleChange(item)}
          showSelectionPreview={false}
          retainEndDateOnFirstSelection={true}
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
      </div>
  );
}

export default Calender;

