function convert(minute) {
    const mm = Math.round(minute / 5) * 5
    const HH = Math.floor(mm / 60)

    return `${twoDigits(HH)}:${twoDigits(mm % 60)}`
}

function twoDigits(n) {
    return n < 10 ? '0' + n : '' + n
}

function revert(time) {
    const [ hour, minute ] = time.split(":")

    return Number(hour)*60 + Number(minute)
}

function add(time, ...minutes) {
    let minute = revert(time)
    for (let min of minutes) {
        minute += min
    }
    return convert(minute)
}


// 시간은 5분 단위로 계산한다. 
function addTime(time1, time2, time3) {
    const [ hour1, min1 ] = time1.split(":")
    const [ hour2, min2 ] = time2.split(":")
    const [ hour3, min3 ] = time3.split(":")

    let hour = Number(hour1) + Number(hour2) + Number(hour3)
    let min = Number(min1) + Number(min2) + Number(min3)
    min = Math.round(min / 5) * 5

    if (min >= 60) {
        hour += Math.floor(min / 60)
        min %= 60
    }
    if (hour >= 24) {
        hour -= 24
    }

    return buildTime(hour, min)
}

function buildTime(hour, min) {
    let time = "";
    if (hour < 10) {
        time += "0" + hour + ":"
    }
    else {
        time += hour + ":"
    }

    if (min < 10) {
        time += "0" + min
    }
    else {
        time += min
    }

    return time
}

function secToTime(sec) {
    let min = Math.round(sec / 60)
    min = Math.round((min % 60) / 5) * 5
    if (min === 0) {
        min = 5
    }
    
    let hour = Math.floor(min / 60)

    return buildTime(hour, min)
}

export { addTime, buildTime, secToTime, convert, revert, add }