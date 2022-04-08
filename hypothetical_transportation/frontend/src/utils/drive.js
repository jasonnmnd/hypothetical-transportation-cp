
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
