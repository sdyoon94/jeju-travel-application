import Schedule from "components/Travel/Body/Schedule"
import { addTime, secToTime } from "components/DateTime/time"

import "./Course.css"
import { useEffect, useState } from "react"
import { fetchDirection } from "store/modules/directionSlice"
import { useDispatch } from "react-redux"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

const grid = 6
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  // padding: grid,
	paddingBottom: "1vh",
  margin :isDragging ? `0 0 ${grid}px 0` : "0px",
  // background: isDragging ? "rgba(0, 0, 0, 0.25)" : "white",
  ...draggableStyle
})
const getListStyle = () => ({
  // padding: grid,
  width: "80vw",
  position: "relative",
  margin: "auto"
})

const queryAttr = "data-rbd-drag-handle-draggable-id"

// const VEHICLE_CAR = "car"
// const VEHICLE_TRANSIT = "walk"

function Course({ day, course, courseIndex, vehicle }) {
	const [route, setRoute] = useState(course.route)
	const dispatch = useDispatch()

	const className = "course day-" + day
	const [ startTimes, setStartTimes ] = useState([ course.startTime ])
	const [ timeReqs, setTimeReqs ] = useState([])

	useEffect(() => {
		let startTime = course.startTime
		let startTimes_ = [ startTime ]
		let timeReqs_ = []

		const fetchData = async ({ index, route, vehicle }) => {
			const response = await dispatch(fetchDirection({ index, route, vehicle }))

			const len = route.length
			for (let i = 1; i < len; i++) {
				const duration = route[i-1].duration
				const timeReq = secToTime(response.payload.directions[i-1].duration)

				startTime = addTime(startTime, duration, timeReq)
				startTimes_.push(startTime)
				timeReqs_.push(timeReq)
			}
			setStartTimes(startTimes_)
			setTimeReqs(timeReqs_)
		}
		fetchData({index: day-1, route, vehicle})
	}, [course, route, day, vehicle, dispatch])

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list)
		const [removed] = result.splice(startIndex, 1)
		result.splice(endIndex, 0, removed)
		return result
	}

	const setPlaceholderProps = useState({})[1]
	const [ hold, setHold ] = useState(false)

	const onDragEnd = result => {
		setHold(false)
    if (!result.destination) {
      return
		}
		setPlaceholderProps({})
		setRoute(route => reorder(route, result.source.index, result.destination.index))
  } 

	const onDragUpdate = update => {
		setHold(true)
    if(!update.destination){
      return
    }
    const draggableId = update.draggableId
    const destinationIndex = update.destination.index
        
    const domQuery = `[${queryAttr}='${draggableId}']`
    const draggedDOM = document.querySelector(domQuery)
        
    if (!draggedDOM) {
      return
    }
    const { clientHeight, clientWidth } = draggedDOM;
        
    const clientY = parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) + [...draggedDOM.parentNode.children]
    .slice(0, destinationIndex)
    .reduce((total, curr) => {
      const style = curr.currentStyle || window.getComputedStyle(curr)
      const marginBottom = parseFloat(style.marginBottom)
      return total + curr.clientHeight + marginBottom
    }, 0)
        
    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft)
    })
  }
    // course가 변경되었을 때 로직

	return (
		<DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
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
					display: day === 1 ? "grid": "none"
					}}
					>
				{route.map((place, index) => (
				<Draggable key={index} draggableId={index.toString()} index={index}>
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
					<Schedule
						key={index}
						scheduleIndex={index}
						courseIndex={courseIndex}
						place={place}
						startTime={startTimes[index]}
						timeReq={timeReqs[index]}
						isFirst={index === 0}
						isLast={index === timeReqs.length}
						hold={hold}
						vehicle={vehicle}
					/>
				</div>
				)}
			</Draggable>
			))}
			</div>
			{provided.placeholder}
				</div>
				)}
			</Droppable>
		</DragDropContext>

	)
}

export default Course
