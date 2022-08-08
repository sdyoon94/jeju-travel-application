import "globalStyle.css";
import "./Dates.css";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
// import axios from "axios";


function Calender({inputValues,setInputValues}) {
  const [show, setShow] = useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
  },
  ]);

  const abc = function () {
    console.log(state);
    console.log(state[0]);
  };
  
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
        onChange={(item) => setState([item.selection])}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={true}
        months={1}
        ranges={state}
        showMonthArrow={false}
        direction="vertical"
        scroll={{ enabled: true }}
        minDate={new Date()}
        maxDate={addDays(state[0].startDate, 30)}
        showDateDisplay={false}
        />
      </div>
        {show && <div className="warning">경비는 최대 9999만원이에요</div>}
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