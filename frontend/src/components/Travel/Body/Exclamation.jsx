import { ReactComponent as Warning } from "assets/exclamation.svg"
import { Popover, Typography } from "@mui/material"
import { useState } from "react"

import "./Place.css"

function Exclamation({ msg }) {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Warning 
        aria-describedby={id} 
        onClick={handleClick} 
        className="vehicle"
        fill="red"
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography
          className="subcontent-size"
          sx={{ p: 2 }}
        >
          { msg }
        </Typography>
      </Popover>
    </>
  )
}

export default Exclamation