
import "globalStyle.css";
import "./EditVehicle.css";

import { ReactComponent as Car } from "assets/vehicles/car.svg";
import { ReactComponent as Bus } from "assets/vehicles/bus.svg";




function Vehicle({ inputValues, setInputValues }) {

  const isSelected = (myName) => {
    return (inputValues.vehicle === myName)?  "#1565C0" : "#8C8C8C"
  };
      
  
  
  const vehicles = [
    {
      eng: "car",
      kor: "자동차",
      svg: <Car fill={isSelected('car')} width="10vw" height="10vw" className="vehicle-icon"></Car>,
    },
    {
      eng: "bus",
      kor: "대중교통",
      svg: <Bus fill={isSelected('bus')} width="10vw" height="10vw" className="vehicle-icon"></Bus>,
    },  
  ];
  
  
  
  
  const setButton = (myName) => {
    return {
      // border: inputValues.vehicle[i] ? "2px solid #1565C0" :"2px solid #8C8C8C",
      color: isSelected(myName)
    };
  };
  
  const isClicked = (vehicleName) => {
    setInputValues(['vehicle',vehicleName])
    
  };
  


  return (
  <div className="vehicle-container">
      <div className="vehicle-header">
        <div className="inline-block subcontentfont-weight title-size">
          <span className="color-1">이동수단 </span>
          <span>변경</span>
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
                onClick={() => isClicked(vehicle.eng)}
                style={setButton(vehicle.eng)}
              >
                {vehicle.svg}
                {vehicle.kor}
              </button>
            );
          })}
        </div>
      </div>
    </div>

)






}

export default Vehicle