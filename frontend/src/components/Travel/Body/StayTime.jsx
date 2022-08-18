import { useState, useEffect } from "react";
import { convert, revert } from "components/DateTime/time";
import { editStartTime, editStayTime } from "store/modules/travelSlice";

import TimePicker from "rc-time-picker";
import moment from "moment";
import { useDispatch } from "react-redux";
import "rc-time-picker/assets/index.css";
import { useSelector } from "react-redux";

function StayTime({ travel, placeIdx, scheduleIdx, ...rest }) {
  const dispatch = useDispatch();

  const socket = useSelector((state) => state.socket.socket);
  const [startTime, setStartTime] = useState(
    moment(convert(travel.schedules[scheduleIdx][placeIdx].stayTime), "HH:mm")
  );

  const handleValue = (value) => {
    const newTime = value.format("HH:mm");

    const minute = revert(newTime);
    const data = {
      day: scheduleIdx,
      turn: placeIdx,
      stayTime: minute,
    };

    socket.emit("update staytime", data, (response) => {
      if (response.status === "ok") {
        if (placeIdx === 0) {
          dispatch(
            editStartTime({ scheduleIdx, placeIdx, stayTime: minute })
          );
        } else {
          dispatch(
            editStayTime({ scheduleIdx, placeIdx, stayTime: minute })
          );
        }
        setStartTime(value);
        socket.emit("revoke ")
      }
      socket.emit(
        "revoke schedules authority",
        { day: scheduleIdx },
        (_) => {}
      );
    });
  }

  useEffect(() => {
    setStartTime(
      moment(convert(travel.schedules[scheduleIdx][placeIdx].stayTime), "HH:mm")
    );
  }, [travel.schedules[scheduleIdx][placeIdx].stayTime]);

  return (
    <>
      <TimePicker
        className="place-start-time"
        {...rest}
        showSecond={false}
        onChange={handleValue}
        hideDisabledOptions
        minuteStep={5}
        value={startTime}
        use24Hours
      />
    </>
  );
}

export default StayTime;
