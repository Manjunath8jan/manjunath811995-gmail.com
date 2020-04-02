const logger = require('pino')()
const moment = require('moment')

let captureError = (errorMessage, errorOrigin, errorLevel) => {

    let currentTime = moment()

    let errorResponse ={
        timeStamp : currentTime,
        errorMessage : errorMessage,
        errorOrigin: errorOrigin,
        errorLevel: errorLevel
    }

    logger.error(errorResponse)
    return errorresponse
}

let captureInfo = (message, origin, importance) => {
    let currentTime = moment()

    let infoMessage = {
        timeStamp: currentTime,
        message: message,
        origin: origin,
        level: importance
    }

    logger.info(infoMessage)
    return infoMessage
}

module.exports = {

    error: captureError,
    info: captureInfo

}

