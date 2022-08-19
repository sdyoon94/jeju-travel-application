import { useRef, useEffect, useState } from "react"
import "./SwipeToDelete.css"
import Place from "./Place"
import { useDispatch, useSelector } from "react-redux"
import { deleteSchedule } from "store/modules/travelSlice"
import api from "api"
import axios from "axios"

function SwipeToDelete({ travel, placeIdx, scheduleIdx, startTime, timeReq, timeReqs, setTimeReqs, directionError, isFirst, isLast, hold, vehicle }) {
  const listElementRef = useRef()
  const wrapperRef = useRef()
  const dragStartXRef = useRef(0)
  const dragStartYRef = useRef(0)
  const leftRef = useRef(0)
  const yRef = useRef(0)
  const draggedRef = useRef(false)
  const dispatch = useDispatch()
  const { scheduleId } = travel.schedules[scheduleIdx][placeIdx]
  const socket = useSelector(state => state.socket.socket)
  const [authority, setAuthority] = useState(false)


  const fetchDelete = async (scheduleId) => {
    socket.emit("delete schedule", {day: scheduleIdx, turn: placeIdx}, ({ status }) => {
      if (status === "ok") {
        dispatch(deleteSchedule({day: scheduleIdx, turn: placeIdx}))
      }
    })
  }
  

  useEffect(() => {
    window.addEventListener("mouseup", onDragEndMouse)
    window.addEventListener("touchend", onDragEndTouch)
    return () => {
      window.removeEventListener("mouseup", onDragEndMouse)
      window.removeEventListener("touchend", onDragEndTouch)
    }
  })

  const onDragStartMouse = (e) => {
    onDragStart(e.clientX)
    dragStartYRef.current = e.clientY
    window.addEventListener("mousemove", onMouseMove)
  }

  const onDragStartTouch = (e) => {
    dragStartYRef.current = e.targetTouches[0].clientY
    const touch = e.targetTouches[0]
    onDragStart(touch.clientX)
    window.addEventListener("touchmove", onTouchMove)
  }
  
  const onDragStart = (clientX) => {
    // grant
    socket.emit("grant schedules authority", {day: scheduleIdx}, (response) => {
      if (response.status === "ok") {
        setAuthority(true)
      }
		})
    draggedRef.current = true
    dragStartXRef.current = clientX
    requestAnimationFrame(updatePosition)
  }
  
  const updatePosition = () => {
    
    if (draggedRef.current) {
      requestAnimationFrame(updatePosition)
      const width = -leftRef.current - 10
      if (width > 0 && Math.abs(dragStartYRef.current - yRef.current) < 9 && !hold) {
        setDeleteStyle({
          ...deleteStyle,
          backgroundColor: "red",
          width: `${width}px`,
        })
      }
    }
    listElementRef.current.style.transform = `translateX(${leftRef.current}px)`
  }

  const onMouseMove = (e) => {
    const left = e.clientX - dragStartXRef.current
    if (left < 0) {
      leftRef.current = left;
    }
  }

  const onTouchMove = (e) => {
    const touch = e.targetTouches[0]
    yRef.current = touch.clientY
    const left = touch.clientX - dragStartXRef.current
    if (left < 0) {
      leftRef.current = left
    }
  }

  const onDragEndMouse = () => {
    window.removeEventListener("mousemove", onMouseMove)
    onDragEnd()
  }

  const onDragEndTouch = () => {
    window.removeEventListener("touchmove", onTouchMove)
    onDragEnd()
  }

  const onDragEnd = () => {
    if (draggedRef.current) {
      draggedRef.current = false
      const threshold = 0.4

      if (
        (leftRef.current < listElementRef.current.offsetWidth * threshold * -1)
        && Math.abs(dragStartYRef.current - yRef.current) < 9
      ) {
        fetchDelete(scheduleId)
      } 
      leftRef.current = 0
      listElementRef.current.style.transform = `translateX(${leftRef.current}px)`
    }
    setDeleteStyle({
      ...deleteStyle,
      backgroundColor: "white"
    })
    setAuthority(false)
  }
  
  useEffect(() => {
    if (authority === false) {
      socket.emit("revoke schedules authority", { day: scheduleIdx }, (response) => {
      })
    }
  }, [authority])

  const [ deleteStyle, setDeleteStyle ] = useState({
    position: "absolute",
    width: "0",
    height: "5vh",
    zIndex: "-1",
    color: "white",
    top: "2.5vh",
    right: "1vw",
    borderRadius: "5px",
    textAlign: "end",
    lineHeight: "5vh",
  })


  return (
    <>
      <div className="Wrapper" ref={wrapperRef}>
        <div style={deleteStyle}><span style={{marginRight :"10px"}}>삭제</span></div>
        <div
          className="BouncingListItem"
          ref={listElementRef}
          onMouseDown={onDragStartMouse}
          onTouchStart={onDragStartTouch}
        >
          <Place
            travel={travel}
            placeIdx={placeIdx}
            scheduleIdx={scheduleIdx}
            startTime={startTime}
            timeReq={timeReq}
            timeReqs={timeReqs}
            setTimeReqs={setTimeReqs}
            directionError={directionError}
            isFirst={isFirst}
            isLast={isLast}
            hold={hold}
            vehicle={vehicle}
          />
        </div>
      </div>
    </>
  )
}

export default SwipeToDelete