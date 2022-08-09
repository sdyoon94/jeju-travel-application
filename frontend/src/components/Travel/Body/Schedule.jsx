import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

import Place from "components/Travel/Body/Place"

import { add, convert } from "components/DateTime/time"
import { fetchDirection } from "store/modules/directionSlice"

import "./Schedule.css"

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

function Schedule({ day, travel, schedule, scheduleIdx, setSchedule, vehicle }) {
	const className = "schedule day-" + day

	const dispatch = useDispatch()

	const [ route, setRoute ] = useState(travel.schedules[scheduleIdx].slice(1))
	const [ startTimes, setStartTimes ] = useState([ convert(travel.schedules[scheduleIdx][0].stayTime) ])
	const [ timeReqs, setTimeReqs ] = useState([])

	// schedules 혹은 vehicle이 변경되었을 때 경로를 다시 탐색
	useEffect(() => {
		const fetchData = async ({ index, route, vehicle }) => {
			let startTime = convert(travel.schedules[scheduleIdx][0].stayTime)
			const startTimes_ = [ startTime ]
			const timeReqs_ = []

			const response = await dispatch(fetchDirection({ index, route, vehicle }))

			const directionsError = response.payload.directions.length === 0

			const len = route.length
			for (let i = 1; i < len; i++) {
				const stayTime = route[i-1].stayTime
				const duration = 
					directionsError ? 
					60 : 
					Math.round(response.payload.directions[i-1].duration / 60)

				startTime = add(startTime, stayTime, duration)
				startTimes_.push(startTime)
				timeReqs_.push(convert(duration))
			}
			setStartTimes(startTimes_)
			setTimeReqs(timeReqs_)
		}

		fetchData({index: scheduleIdx, route, vehicle})
	}, [ travel.schedules[scheduleIdx], vehicle ])

	// route가 변경되었을 때 schedule을 다시 설정
	useEffect(() => {
		const newSchedule = [travel.schedules[scheduleIdx][0]].concat(...route)

		setSchedule({scheduleIdx, schedule: newSchedule})
	}, [ route ])

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
											<Place
												key={index}
												place={place}
												placeIdx={index+1}
												schedule={schedule}
												scheduleIdx={scheduleIdx}
												setSchedule={setSchedule}
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

export default Schedule
