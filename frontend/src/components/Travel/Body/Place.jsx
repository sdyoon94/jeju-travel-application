import { ReactComponent as Car } from "assets/car-side.svg";
import { ReactComponent as Bus } from "assets/bus-alt.svg";

import StartTime from "./StartTime";
import Exclamation from "./Exclamation";
import "./Place.css";
import "globalStyle.css";
import TimeReq from "./TimeReq";
import StayTime from "./StayTime";

function Place({
  travel,
  placeIdx,
  scheduleIdx,
  startTime,
  timeReq,
  timeReqs,
  setTimeReqs,
  directionError,
  isFirst,
  isLast,
  hold,
  vehicle,
  visibility,
}) {

	return (
    <>
      {isFirst && (
        <StartTime
          style={{
            padding: "0vh 2vw",
            visibility,
          }}
          travel={travel}
          placeIdx={0}
          scheduleIdx={scheduleIdx}
        />
      )}
      {!isFirst && !hold && (
        <span className="span-padding subcontent-size" style={{ visibility : visibility }}>{startTime}</span>
      )}

      <div className="place-info place-box" style={{ visibility }}>
        <span className="overflow-x-dots">
          {travel.schedules[scheduleIdx][placeIdx].placeName}
        </span>
        {!isFirst && !isLast && (
          <StayTime
            travel={travel}
            placeIdx={placeIdx}
            scheduleIdx={scheduleIdx}
          />
        )}
      </div>

      {!isLast && !hold && (
        <div className="text-center transportation" style={{ visibility }}>
          {directionError ? (
            <Exclamation msg="현재 교통정보 제공이 원활하지 않습니다." />
          ) : vehicle === "car" ? (
            <Car className="vehicle" />
          ) : (
            <Bus className="vehicle" />
          )}
          {directionError ? (
            <TimeReq
              placeIdx={placeIdx}
              timeReq={timeReq}
              timeReqs={timeReqs}
              setTimeReqs={setTimeReqs}
            />
          ) : (
            <span className="subcontent-size">{timeReq}</span>
          )}
        </div>
      )}
    </>
  );
}

export default Place;
