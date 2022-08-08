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
    console.log(format(inputValues.range[0].startDate, "yyyy-MM-dd"));
    console.log(inputValues.range[0].startDate)
    console.log(format(parseISO(""),"yyyy-MM-dd"))
    // console.log(input,Values.range[0])
    // console.log(inputValues.range[0].startDate)
    // console.log(inputValues.range[0].endDate)
    // console.log(differenceInDays(inputValues.range[0].endDate,inputValues.range[0].startDate))
    // console.log(inputValues.periodInDays)

  };

  const handleChange = (item) => {
    const endDate = item.selection.endDate
    const startDate = item.selection.startDate
    const periodInDays = differenceInDays(endDate, startDate)
    const limitEndDate = {
      startDate: startDate,
      endDate: addDays(startDate, 19),
      key: "selection",
    }
    if (startDate == endDate) {
      setInputValues(['range', [item.selection]])
      setInputValues(['periodInDays',''])
      setWarningMessage("최소1박2일은가라") 
      setShow(true)
      console.log(inputValues.periodInDays )
    } else if (periodInDays >= 20) {
      setInputValues(['range', [limitEndDate]])
      setInputValues(['periodInDays','19'])  
      // setInputValues(['periodInDays',String(periodInDays)])  
      setWarningMessage("최대 20일까지만 가라") 
      console.log(inputValues.periodInDays )

      // console.log(inputValues.periodInDays )
      setShow(true)
    } else {
      // console.log(differenceInDays(endDate,startDate) )
      setInputValues(['range',[item.selection]])
      setInputValues(['periodInDays', String(periodInDays)])
      console.log(inputValues.periodInDays )




      setShow(false)
      // console.log(inputValues.periodInDays )
    }

  }
  
  return (
    <div className="dates-container">
      <button onClick={abc}>button</button>
      <div className="dates-header">
        <div className="mention">
          여행
          <div style={{ color: "#1E88E5", display: "inline-block" }}>
          기간
          </div>
          정하기
        </div>
        <div className="mention2">
          여행기간은 최대 20일 이에요ㅠ
        </div>
      </div>
      <div className="dates-body">
            <DateRange
        locale={ko}
        // onChange={(item) => setInputValues(['range',[item.selection]])}
        onChange={(item)=> handleChange(item)}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={1}
        ranges={inputValues.range}
        showMonthArrow={false}
        direction="vertical"
        scroll={{ enabled: true }}
        minDate={new Date()}
        // maxDate={addDays(state[0].startDate, 30)}
        showDateDisplay={false}
        />
      </div>
      {show && <div className="warning">{warningMessage}</div>}
      </div>
    


    // <div>
    //   <button onClick={abc}>button</button>

    //   <DateRange
    //     locale={ko}
    //     // onChage={item => console.log(item)}
    //     onChange={(item) => setState([item.selection])}
    //     showSelectionPreview={true}
    //     moveRangeOnFirstSelection={false}
    //     months={1}
    //     ranges={state}
    //     showMonthArrow={false}
    //     direction="vertical"
    //     scroll={{ enabled: true }}
    //     minDate={new Date()}
    //     maxDate={addDays(state[0].startDate, 30)}
    //     showDateDisplay={false}
    //     />
    // </div>
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