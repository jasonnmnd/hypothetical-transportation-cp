
export const EXAMPLE_ACTIVE_RUN_1 = {
    route: {
        id: 1,
        name: "A ROUTE IS BORN"
    },
    bus_number: 8017,
    going_towards_school: false,
    previous_stop: {
        id: 5,
        name: "A STOPPPP"
    },
    start_time: "5:07",
    driver: {
        email: "driver@example.com",
        full_name: "Driver McDriverFace",
        address: "52 Walters Brook Drive",
        phone_num: "908505966",
        id: 28
    },
    school: {
        id: 5,
        name: "A SCHOOL's name"
    },
    duration: "1:17"
}

export const EXAMPLE_ACTIVE_RUN_2 = {
    route: {
        id: 4,
        name: "another route name"
    },
    bus_number: 8011,
    going_towards_school: true,
    previous_stop: {
        id: 3,
        name: "Another STOooop"
    },
    start_time: "15:07",
    driver: {
        email: "driver@example.com",
        full_name: "TheSecond DriverPerson",
        address: "52 Walters Brook Drive",
        phone_num: "908505966",
        id: 12
    },
    school: {
        id: 5,
        name: "A SCHOOL's name"
    },
    duration: null
}

export const EXAMPLE_ACTIVE_RUNS = {
    results: [
        EXAMPLE_ACTIVE_RUN_1,
        EXAMPLE_ACTIVE_RUN_2
    ],
    count: 2
}

export const EXAMPLE_BUS_LOCATION_1 = {
    "bus": "8017", 
    "lat": 38.17055019844234, 
    "lng": -87.255859375
}

export const EXAMPLE_BUS_LOCATION_2 = {
    "bus": "8011", 
    "lat": 37.17055019844234, 
    "lng": -86.255859375
}

export const EXAMPLE_BUS_LOCATION_3 = {
    "bus": "8066", 
    "lat": 48.17055019844234, 
    "lng": -67.255859375
}

export const EXAMPLE_BUS_LOCATION_INVALID = "unknown bus"

const getFormattedDate = (date) => {
    const dateParts = date.split("-")
    return `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`
}

const getFormattedTime = (time) => {
    const timeParts = time.split(":")
    return `${timeParts[0]}:${timeParts[1]}`
}

const applyTimezoneOffset = (date, time, offset) => {
    let offsetYear = parseInt(date.split("/")[2])
    let offsetMonth = parseInt(date.split("/")[0])
    let offsetDay = parseInt(date.split("/")[1]);
    const minute = time.split(":")[1]
    const preHour = parseInt(time.split(":")[0])
    let offsetHour = preHour - offset;
    if(offsetHour < 0){
        offsetHour = 24 + offsetHour;
        let offsetDay = offsetDay - 1;
        if(offsetDay < 0){
            offsetDay = 30;
            let offsetMonth = offsetMonth - 1;
            if(offsetMonth < 0){
                offsetMonth = 12
                let offsetYear = offsetYear - 1;
            }
    
            
        }
        
    } else if(offsetHour > 23){
        offsetHour = offsetHour - 24;
        let offsetDay = offsetDay + 1;
        if(offsetDay > 30){
            offsetDay = 1;
            let offsetMonth = offsetMonth + 1;
            if(offsetMonth > 12){
                offsetMonth = 1
                let offsetYear = offsetYear + 1;
            }
    
            
        }
    }
    return `${offsetMonth}/${offsetDay}/${offsetYear}  ${offsetHour}:${minute}`
}   

export const DATE_TIME_TO_STRING = (dateTime) => {
    const timezoneOffset = (new Date()).getTimezoneOffset();
    const hourOffset = timezoneOffset / 60;
    try {
        const dateTimeParts = dateTime.split("T");
    
        const dateFormatted = getFormattedDate(dateTimeParts[0]);

        const timeFormatted = getFormattedTime(dateTimeParts[1]);


        return applyTimezoneOffset(dateFormatted, timeFormatted, hourOffset)
        
    } catch (error) {
        console.log(error);
        return dateTime
    }

}

export const TIME_TO_STRING = (time) => {
    console.log(time)
    const timezoneOffset = (new Date()).getTimezoneOffset();
    const hourOffset = timezoneOffset / 60;
    console.log(hourOffset)

    try {
        const timeParts = time.split(":");
        const preHour = parseInt(timeParts[0]);
        let offsetHour = preHour - hourOffset;
        if(offsetHour < 0){
            offsetHour = 24 + offsetHour;
        } else if(offsetHour > 23) {
            offsetHour = offsetHour - 24;
        }
        

        return `${offsetHour}:${timeParts[1]}:${timeParts[2]}`
    } catch (error) {
        console.log(error);
        return time
    }

}

