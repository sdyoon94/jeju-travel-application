import { createLogger, format, transports } from "winston"

const { combine, timestamp, label, printf } = format

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

const createTravelLogger = (actor) => {
  return createLogger({
    format: combine(
      label({ label: `travel ${actor}` }),
      timestamp(),
      myFormat
    ),
    transports: [new transports.Console()],
    exitOnError: false
  })
}

export { createTravelLogger }