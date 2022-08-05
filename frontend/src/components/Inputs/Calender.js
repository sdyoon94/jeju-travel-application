import "globalStyle.css";
import "./Style.css";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import axios from "axios";

// 일기에보 API(기상청)
async function getData() {
  try {
    //응답 성공
    const url =
      "https://cors-anywhere.herokuapp.com/http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst";
    const response = await axios.get(url, {
      params: {
        serviceKey:
          "0BoSnxgUEMovWssUhhE6OrVQzQcIz1zClRi8CpXcaAlra0P4go9saixx7I9e5dMsArgQSG7Ug/szrxTBogIobg==",
        numOfRows: 1,
        pageNo: 1,
        dataType: "JSON",
        regId: "11G00401",
        tmFc: "202207310600",
      },
    });
    console.log(response.data);
  } catch (error) {
    //응답 실패
    console.error(error);
  }
}

function Calender() {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const abc = function () {
    console.log(state);
    console.log(state[0].startDate);
  };

  return (
    <div>
      <button onClick={abc}>button</button>
      <button onClick={getData}>getData</button>

      <DateRange
        locale={ko}
        // onChage={item => console.log(item)}
        onChange={(item) => setState([item.selection])}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
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
  );
}

export default Calender;
