
import "globalStyle.css";
import "./EditVehicle.css";

import { ReactComponent as Car } from "assets/vehicles/car.svg";
import { ReactComponent as Bus } from "assets/vehicles/bus.svg";




function Vehicle({ inputValues, setInputValues }) {

  const setSvg = (i) => {
    return inputValues.vehicle[i] ? "#1565C0" : "#8C8C8C";
  };

  const vehicles = [
    {
      eng: "car",
      kor: "자동차",
      svg: <Car fill={setSvg(0)} width="5vw" height="5vw" className="vehicle-icon"></Car>,
    },
    {
      eng: "bus",
      kor: "대중교통",
      svg: <Bus fill={setSvg(1)} width="5vw" height="5vw" className="vehicle-icon"></Bus>,
    },  
  ];

  const isClicked = (i) => {
    console.log(inputValues.vehicle);
    let newArray = [...inputValues.vehicle];
    newArray[i] = newArray[i] * -1 + 1;
    setInputValues(["vehicle", newArray]);
  };

  const setButton = (i) => {
    return {
      border: inputValues.vehicle[i] ? "2px solid #1565C0" :"2px solid #8C8C8C",
      color: inputValues.vehicle[i] ? "#1565C0" : "#8C8C8C",
    };
  };



  return (
  <div className="vehicle-container">
      <div className="vehicle-header">
        <div className="inline-block subcontentfont-weight title-size">
          이동수단변경
        </div>
      </div>
      <div className="vehicle-body">
        <div className="vehicle-select-btns">
          {vehicles.map((vehicle, i) => {
            return (
              <button
                type="button"
                key={i}
                id={vehicle.eng}
                onClick={() => isClicked(i)}
                vehicle={setButton(i)}
              >
                {vehicle.svg}
                <span>{vehicle.kor}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>

)






}

export default Vehicle