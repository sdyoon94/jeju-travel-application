import { ReactComponent as AngleLeft } from "assets/angle-left.svg"
import { ReactComponent as AngleRight } from "assets/angle-right.svg"

import "./Day.css"

function Day({ day, date, prev, next }) {
    const className = "day day-" + day

    return (
        <div 
            className={className}
            style={{
                display: day === 1 ? "grid": "none"
            }}
        >
            <AngleLeft 
                className="angle"
                onClick={prev}
            />
            <p>DAY{day}({date})</p>
            <AngleRight 
                className="angle"
                onClick={next}
            />
        </div>
    )
}

export default Day