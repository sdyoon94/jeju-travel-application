import { useState } from 'react'
import { useDispatch } from "react-redux"
import { editCourses } from "store/modules/courseListSlice"
import Spot from './Spot'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import "globalStyle.css"
import "routes/TravelEdit.css"


const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid,
  margin: `0 0 ${grid * 2}px 0`,
  border: "5px solid #BBDEFB",
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  borderRadius: "10px",
  background: isDragging ? "rgba(0, 0, 0, 0.25)" : "white",
  ...draggableStyle
})

const getListStyle = () => ({
  padding: grid,
  width: 310,
  position: "relative",
  margin: "auto"
})

const queryAttr = "data-rbd-drag-handle-draggable-id";

function Spots({idx, routes}) {
  const dispatch = useDispatch()

  const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
  }

  const [spots, setSpots] = useState(routes)
  const setPlaceholderProps = useState({})[1]

  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return
  }  
    setPlaceholderProps({})
    const newSpots = reorder(spots, result.source.index, result.destination.index)
    setSpots(spots => reorder(spots, result.source.index, result.destination.index))
    console.log('new',newSpots)
    dispatch(editCourses({idx, newSpots}))
  };
    
  const onDragUpdate = update => {
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
  
  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
          >
          {spots.map((item, index) => (
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
              <Spot dayIdx={idx} courseIdx={index} item={item} />
            </div>
            )}
          </Draggable>
          ))}
          {provided.placeholder}
	      </div>
        )}
	  </Droppable>
    </DragDropContext>
  );
};



export default Spots

