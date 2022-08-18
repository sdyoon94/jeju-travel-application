const dayOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const SEPARATOR = "."

// date format == "yy.mm.dd"
function getAllDates(date, periodInDays) {
    const ymd = date.split(SEPARATOR)
    if (ymd.length !== 3)
        return []

    let year = Number(ymd[0])
    let month = Number(ymd[1])
    let day = Number(ymd[2])

    let dates = []

    dates.push(buildDate(year, month, day))

    for (let d = 1; d < periodInDays; d++) {
        day++
        if (day > dayOfMonth[month-1]) {
            day = 1
            if (++month > 12) {
                month = 1
                ++year
            }
        }
        dates.push(buildDate(year, month, day))
    }

    return dates
}

function getEndDate(startDate, periodInDays) {
    const ymd = startDate.split(SEPARATOR)
    if (ymd.length !== 3)
        return []

    let year = Number(ymd[0])
    let month = Number(ymd[1])
    let day = Number(ymd[2])

    day += periodInDays
    while (day > dayOfMonth[month-1]) {
        day -= dayOfMonth[month-1]
        if (++month > 12) {
            month = 1
            ++year
        }
    }

    return buildDate(year, month, day)
}

function buildDate(year, month, day) {
    let date = ""
    if (year < 10) {
        date = "0" + year + SEPARATOR
    }
    else {
        date = year + SEPARATOR
    }

    if (month < 10) {
        date += "0" + month + SEPARATOR
    }
    else {
        date += month + SEPARATOR
    }

    if (day < 10) {
        date += "0" + day
    }
    else {
        date += day
    }

    return date
}

export { getAllDates, getEndDate, buildDate }