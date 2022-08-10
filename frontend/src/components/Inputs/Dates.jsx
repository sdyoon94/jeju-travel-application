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

  const abc = function () {
    // console.log(state);
    // console.log(state[0]);
    // console.log(format("","yyyy-MM-dd"));
    // console.log(format(inputValues.range[0].startDate, "yyyy-MM-dd"));
    // console.log(inputValues.range[0].startDate)
    // console.log(format(parseISO(""),"yyyy-MM-dd"))
    // console.log(input,Values.range[0])
    // console.log(inputValues.range[0].startDate)
    // console.log(inputValues.range[0].endDate)
    // console.log(differenceInDays(inputValues.range[0].endDate,inputValues.range[0].startDate))
    // console.log(inputValues.periodInDays)

  };
  // const [startDate, setStartDate] = useState(inputValues.range[0].startDate)
  // const [endDate, setEndDate] = useState(inputValues.range[0].endDate)
  // const [periodInDays, setPeriodInDays] = useState(inputValues.periodInDays)


  const handleChange = (item) => {

    const startDate = item.selection.startDate
    const limitEndDate = {
      startDate: startDate,
      endDate: addDays(startDate, 19),
      key: "selection",
    }
    
    setInputValues(['range',[item.selection]])
    const periodInDays = differenceInDays(item.selection.endDate, item.selection.startDate )
    if (periodInDays >= 19) {
      setWarningMessage("19일 이상 못감")
      setShow(true)
      setInputValues(['range',[limitEndDate]])
      setInputValues(['periodInDays','19'])
    } else if (periodInDays == 0) {
      setWarningMessage("최소 1박 2일은 가야죠")
      setShow(true)
      setInputValues(['periodInDays',""])
    } else { 
      setShow(false)
      setInputValues(['periodInDays',String(periodInDays)])
    }

  }

  return (
    <div className="dates-container">
      {/* <button onClick={abc}>button</button> */}
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
          // onChange={(item) => setInputValues(['range',[item.selection]])}
          onChange={(item)=> handleChange(item)}
          showSelectionPreview={false}
          moveRangeOnFirstSelection={false}
          months={1}
          ranges={inputValues.range}
          showMonthArrow={false}
          direction="vertical"
          scroll={{ enabled: true}}
          minDate={new Date()}
          // maxDate={addDays(state[0].startDate, 30)}
          showDateDisplay={false}
          color={"#1E88E5"}
        />
      </div>
      {show && <div className="warning2">{warningMessage}</div>}
      </div>
  );
}

export default Calender;

// // 일기에보 API(기상청)
// async function getData() {
//   try {
//     //응답 성공
//     const url =
//       "https://cors-anywhere.herokuapp.com/http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst";
//     const response = await axios.get(url, {
//       params: {
//         serviceKey:
//           "0BoSnxgUEMovWssUhhE6OrVQzQcIz1zClRi8CpXcaAlra0P4go9saixx7I9e5dMsArgQSG7Ug/szrxTBogIobg==",
//         numOfRows: 1,
//         pageNo: 1,
//         dataType: "JSON",
//         regId: "11G00401",
//         tmFc: "202207310600",
//       },
//     });
//     console.log(response.data);
//   } catch (error) {
//     //응답 실패
//     console.error(error);
//   }
// }