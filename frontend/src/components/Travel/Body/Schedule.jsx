import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

import Place from "components/Travel/Body/Place"

import { add, convert, revert } from "components/DateTime/time"
import { fetchDirection } from "store/modules/directionSlice"
import "./Schedule.css"
// import SwipeToDelete from 'react-swipe-to-delete-component';

// import 'react-swipe-to-delete-component/dist/swipe-to-delete.css';
import SwipeToDelete from "./SwipeToDelete"
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

function Schedule({ day, travel, scheduleIdx, setSchedule, vehicle }) {
	const className = "schedule day-" + day

	const dispatch = useDispatch()
	const [ startTimes, setStartTimes ] = useState([ convert(travel.schedules[scheduleIdx][0].stayTime) ])
	const [ timeReqs, setTimeReqs ] = useState([])
	const [ directionError, setDirectionError ] = useState(false)

	// schedules 혹은 vehicle이 변경되었을 때 경로를 다시 탐색
	useEffect(() => {
		const fetchData = async ({ index, route, vehicle }) => {
			let startTime = convert(travel.schedules[scheduleIdx][0].stayTime)
			const startTimes_ = [ startTime ]
			const timeReqs_ = []
			let directionError_ = false

			const response = await dispatch(fetchDirection({ index, route, vehicle }))

			if (response.error || (response.payload.directions && response.payload.directions.length === 0)) {
				directionError_ = true
			}

			const len = route.length
			for (let i = 1; i < len; i++) {
				const stayTime = route[i-1].stayTime
				const duration = 
					directionError_ ? 
						timeReqs[i-1] ? 
							revert(timeReqs[i-1]) :
								0 :
								Math.round(response.payload.directions[i-1].duration / 60)

				startTime = add(startTime, stayTime, duration)
				startTimes_.push(startTime)
				timeReqs_.push(convert(duration))
			}

			setStartTimes(startTimes_)
			setTimeReqs(timeReqs_)
			setDirectionError(directionError_)
		}

		fetchData({
			index: scheduleIdx, 
			route: travel.schedules[scheduleIdx].slice(1), 
			vehicle
		})
	  // eslint-disable-next-line
	}, [ travel.schedules[scheduleIdx], vehicle ])

	useEffect(() => {
		const len = startTimes.length
		const route = travel.schedules[scheduleIdx].slice(1)

		let startTime = startTimes[0]
		const startTimes_ = [ startTime ]

		for (let i = 1; i < len; i++) {
			const stayTime = route[i-1].stayTime

			startTime = add(startTime, stayTime, revert(timeReqs[i-1]))
			startTimes_.push(startTime)
		}

		setStartTimes(startTimes_)
	  // eslint-disable-next-line
	}, [ timeReqs ])

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

		const schedule = reorder(travel.schedules[scheduleIdx], result.source.index + 1, result.destination.index + 1)

		setSchedule({ 
			scheduleIdx, 
			schedule
		})
		
		// setRoute(route => reorder(route, result.source.index, result.destination.index))
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
							{travel.schedules[scheduleIdx].slice(1).map((place, index) => (
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
											<SwipeToDelete
												key={index}
												place={place}
												placeIdx={index+1}
												scheduleIdx={scheduleIdx}
												startTime={startTimes[index]}
												timeReq={timeReqs[index]}
												timeReqs={timeReqs}
												setTimeReqs={setTimeReqs}
												directionError={directionError}
												isFirst={index === 0}
												isLast={index === travel.schedules[scheduleIdx].length - 2}
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

export default Schedule
