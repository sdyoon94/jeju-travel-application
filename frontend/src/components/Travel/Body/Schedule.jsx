import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import SwipeToDelete from "./SwipeToDelete";

import { add, convert, revert } from "components/DateTime/time";
import { fetchDirection } from "store/modules/directionSlice";
import "./Schedule.css";
import { ReactComponent as AddSpot } from "assets/add.svg";
import Place from "./Place";

const grid = 6;
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  // padding: grid,
  paddingBottom: "1vh",
  margin: isDragging ? `0 0 ${grid}px 0` : "0px",
  // background: isDragging ? "rgba(0, 0, 0, 0.25)" : "white",
  ...draggableStyle,
});
const getListStyle = () => ({
  // padding: grid,
  width: "80vw",
  position: "relative",
  margin: "auto",
});

const queryAttr = "data-rbd-drag-handle-draggable-id";

// const VEHICLE_CAR = "car"
// const VEHICLE_TRANSIT = "walk"

function Schedule({ day, travel, scheduleIdx, setSchedule, vehicle }) {
  const navigate = useNavigate();
  const travelId = useSelector((state) => state.travel.info.tripId);
  const handleAddSpot = () => {
    navigate(`/search/${travelId}/${scheduleIdx}`);
  };
  const className = "schedule day-" + day;

  const dispatch = useDispatch();
  const [startTimes, setStartTimes] = useState([
    convert(travel.schedules[scheduleIdx][0].stayTime),
  ]);
  const [timeReqs, setTimeReqs] = useState([]);
  const [directionError, setDirectionError] = useState(false);
  const [visibility, setVisibility] = useState("visible");

  const setPlaceholderProps = useState({})[1];
  const [hold, setHold] = useState(false);

  // schedules 혹은 vehicle이 변경되었을 때 경로를 다시 탐색
  useEffect(() => {
    const fetchData = async ({ index, route, vehicle }) => {
      let startTime = convert(travel.schedules[scheduleIdx][0].stayTime);
      const startTimes_ = [startTime];
      const timeReqs_ = [];
      let directionError_ = false;

      const response = await dispatch(
        fetchDirection({ index, route, vehicle })
      );

      if (
        response.error ||
        (response.payload.directions &&
          response.payload.directions.length === 0)
      ) {
        directionError_ = true;
      }

      const duration = directionError_
        ? timeReqs[0]
          ? revert(timeReqs[0])
          : 0
        : Math.round(response.payload.directions[0].duration / 60);

      startTime = add(startTime, 0, duration);
      startTimes_.push(startTime);
      timeReqs_.push(convert(duration));

      const len = route.length;

      for (let i = 1; i < len - 1; i++) {
        const stayTime = route[i].stayTime;
        const duration = directionError_
          ? timeReqs[i]
            ? revert(timeReqs[i])
            : 0
          : Math.round(response.payload.directions[i].duration / 60);

        startTime = add(startTime, stayTime, duration);
        startTimes_.push(startTime);
        timeReqs_.push(convert(duration));
      }

      setStartTimes(startTimes_);
      setTimeReqs(timeReqs_);
      setDirectionError(directionError_);
    };

    fetchData({
      index: scheduleIdx,
      route: travel.schedules[scheduleIdx],
      vehicle,
    });

    // eslint-disable-next-line
  }, [travel.schedules[scheduleIdx], vehicle]);

  useEffect(() => {
    if (timeReqs.length) {
      const len = startTimes.length;
      const route = travel.schedules[scheduleIdx];

      let startTime = startTimes[0];
      const startTimes_ = [startTime];

      startTime = add(startTime, 0, revert(timeReqs[0]));
      startTimes_.push(startTime);

      for (let i = 1; i < len - 1; i++) {
        const stayTime = route[i].stayTime;

        startTime = add(startTime, stayTime, revert(timeReqs[i]));
        startTimes_.push(startTime);
      }
      setStartTimes(startTimes_);
    }
    // eslint-disable-next-line
  }, [timeReqs]);

  useEffect(() => {
    if (hold) {
      setVisibility("hidden");
    } else {
      setVisibility("visible");
    }
  }, [hold]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    setHold(false);
    setPlaceholderProps({});

    // schedule 권한 요청
    socket.emit(
      "grant schedules authority",
      { day: scheduleIdx },
      (response) => {
        if (response.status === "bad") {
          return;
        }
        console.log("authority", response);
        // schedule swap 요청
        socket.emit(
          "swap schedule",
          {
            day: scheduleIdx,
            turn1: result.source.index,
            turn2: result.destination.index,
          },
          (response) => {
            if (response.status === "ok") {
              const schedule = reorder(
                travel.schedules[scheduleIdx],
                result.source.index,
                result.destination.index
              );
              setSchedule({
                scheduleIdx,
                schedule,
              });
            }
            console.log("swap", response);
            // schedule 권한 회수 요청
            socket.emit(
              "revoke schedules authority",
              { day: scheduleIdx },
              (response) => {
                console.log("revoke", response);
              }
            );
          }
        );
      }
    );

    // setRoute(route => reorder(route, result.source.index, result.destination.index))
  };

  const onDragUpdate = (update) => {
    if (!update.destination) {
      return;
    }
    const draggableId = update.draggableId;
    const destinationIndex = update.destination.index;

    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);

    if (!draggedDOM) {
      return;
    }
    const { clientHeight, clientWidth } = draggedDOM;

    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      [...draggedDOM.parentNode.children]
        .slice(0, destinationIndex)
        .reduce((total, curr) => {
          const style = curr.currentStyle || window.getComputedStyle(curr);
          const marginBottom = parseFloat(style.marginBottom);
          return total + curr.clientHeight + marginBottom;
        }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(
        window.getComputedStyle(draggedDOM.parentNode).paddingLeft
      ),
    });
  };
  // course가 변경되었을 때 로직

  const socket = useSelector((state) => state.socket.socket);

  const onDragStart = (e) => {
    console.log("drag start");
    setHold(true);
  };

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragUpdate={onDragUpdate}
      onDragStart={onDragStart}
    >
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <div
              className={className}
              style={{
                display: day === 1 ? "grid" : "none",
              }}
            >
              {travel.schedules[scheduleIdx].map((_, index) => {
                if (
                  index === 0 ||
                  index === travel.schedules[scheduleIdx].length - 1
                ) {
                  return (
                    <Place
                      key={index}
                      travel={travel}
                      placeIdx={index}
                      scheduleIdx={scheduleIdx}
                      startTime={startTimes[index]}
                      timeReq={timeReqs[index]}
                      timeReqs={timeReqs}
                      setTimeReqs={setTimeReqs}
                      directionError={directionError}
                      isFirst={index === 0}
                      isLast={
                        index === travel.schedules[scheduleIdx].length - 1
                      }
                      hold={hold}
                      vehicle={vehicle}
                      visibility={visibility}
                    />
                  );
                }

                return (
                  <Draggable
                    key={index}
                    draggableId={index.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <SwipeToDelete
                          key={index}
                          travel={travel}
                          placeIdx={index}
                          scheduleIdx={scheduleIdx}
                          startTime={startTimes[index]}
                          timeReq={timeReqs[index]}
                          timeReqs={timeReqs}
                          setTimeReqs={setTimeReqs}
                          directionError={directionError}
                          hold={hold}
                          vehicle={vehicle}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {!hold && (
                <AddSpot onClick={handleAddSpot} className="add-spot" />
              )}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Schedule;
