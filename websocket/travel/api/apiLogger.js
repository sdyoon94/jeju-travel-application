import { createTravelLogger } from "../logger.js"

const logger = createTravelLogger("api request")

const logApiInfo = (apiName, ...args) => {
  let msg = `(${apiName})`
  msg += ` - `
  msg += `${args.map(({ key, value }) => `{${key}: ${value}}`).join(", ")}`
  logger.info(msg)
}

const logApiError = (apiName, err, ...args) => {
  let msg = `(${apiName})`
  msg += ` - `
  msg += `${args.map(({ key, value }) => `{${key}: ${value}}`).join(", ")}`

  if (err.response) {
    msg += `{status: ${err.response.status}}, `
    msg += `{headers: ${JSON.stringify(err.response.headers)}}, `
  }
  else if (err.request) {
    msg += `{request: ${JSON.stringify(err.request)}}, `
  }
  else {
    msg += `{message: ${JSON.stringify(err.message)}}, `
  }
  msg += `{config: ${JSON.stringify(err.config)}}`

  logger.error(msg)
}

export { logApiInfo, logApiError }