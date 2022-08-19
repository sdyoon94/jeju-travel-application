import { ReactComponent as AngleLeft } from "assets/angle-left.svg"
import { ReactComponent as AngleRight } from "assets/angle-right.svg"

import "./Day.css"
import "globalStyle.css"
import { useState } from "react"
import { useEffect } from "react"

const buildTitle = (day, date) => {
  return date 
    ? `${day}일차 (${date})` 
    : `${day}일차`
}

function Day({ day, date, prev, next }) {
  const className = "day day-" + day
  const [ title, setTitle ] = useState(buildTitle(day, date))

  useEffect(() => {
    setTitle(buildTitle(day, date))
  }, [ day, date ])

  return (
    <div
      className={className}
      style={{
        display: day === 1 ? "grid" : "none"
      }}
    >
      <AngleLeft
        className="angle"
        onClick={prev}
      />
      <span className="subtitle-size subtitle-weight">{title}</span>
      <AngleRight
        className="angle"
        onClick={next}
      />
    </div>
  )
}

export default Day