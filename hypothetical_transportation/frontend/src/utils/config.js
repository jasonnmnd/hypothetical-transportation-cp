export default function config(token) {
    return {headers: { Authorization: `Token ${token}` }};
}


const userDefaultCols = [
    "full_name",
    "email",
    "phone_number",
    "address",
    "group_name"
]

const studentDefaultCols = [
    "student_id",
    "full_name",
    "school_name",
    "route_name",
    "parent_name",
    "parent_phone_number",
    "email",
    "phone_number"
]

const schoolDefaultCols = [
    "name",
    "address",
    "bus_arrival_time",
    "bus_departure_time"
]

const routeDefaultCols = [
    "name",
    "school_name",
    "num_students",
]

const stopDefaultCOls = [
    "name",
    "drop_off",
    "pick_up",
    "stop_number"
]

const activeDriveDefaultCols = [
    "driver",
    "bus_number",
    "route",
    "school",
    "direction",
    "start_time",
    "duration"
]

const stopColumns = {
    name: {
        colTitle: "Name",
        dataPath: "name",
        search_key: "",
        sortable: false,
        filterable: false
    },

    location: {
        colTitle: "Location",
        dataPath: "location",
        search_key: "",
        sortable: false,
        filterable: false
    },


    stop_number: {
        colTitle: "Stop Number",
        dataPath: "stop_number",
        search_key: "stop_number",
        sortable: false,
        filterable: false
    },

    drop_off: {
        colTitle: "Drop Off Time",
        dataPath: "dropoff_time",
        search_key: "",
        sortable: false,
        filterable: false
    },

    pick_up: {
        colTitle: "Pick Up Time",
        dataPath: "pickup_time",
        search_key: "",
        sortable: false,
        filterable: false
    }
}

const userColumns = {
    full_name: {
        colTitle: "Full Name",
        dataPath: "full_name",
        search_key: "full_name",
        sortable: true,
        filterable: true
    },
    email: {
        colTitle: "Email Address",
        dataPath: "email",
        search_key: "email",
        sortable: true,
        filterable: true
    },
    address: {
        colTitle: "Address",
        dataPath: "address",
        search_key: "",
        sortable: false,
        filterable: false
    },
    phone_number: {
        colTitle: "Phone Number",
        dataPath: "phone_number",
        search_key: "",
        sortable: false,
        filterable: false
    },
    group_name: {
        colTitle: "Group",
        dataPath: "groups.0.name",
        search_key: "groups",
        sortable: false,
        filterable: true,
    }
}



const studentColumns = {
    student_id: {
        colTitle: "Student ID",
        dataPath: "student_id",
        search_key: "student_id",
        sortable: true,
        filterable: true
    },
    full_name: {
        colTitle: "Full Name",
        dataPath: "full_name",
        search_key: "full_name",
        sortable: true,
        filterable: true
    },
    school_name: {
        colTitle: "School",
        dataPath: "school.name",
        search_key: "school__name",
        sortable: true,
        filterable: false
    },
    route_name: {
        colTitle: "Route",
        dataPath: "routes.name",
        search_key: "",
        sortable: false,
        filterable: false
    },
    parent_name: {
        colTitle: "Parent",
        dataPath: "guardian.full_name",
        search_key: "",
        sortable: false,
        filterable: false
    },
    parent_phone_number: {
        colTitle: "Parent Phone",
        dataPath: "guardian.phone_number",
        search_key: "",
        sortable: false,
        filterable: false
    },

    email: {
        colTitle: "Own Email",
        dataPath: "email",
        search_key: "email",
        sortable: true,
        filterable: true,
    },

    phone_number: {
        colTitle: "Own Phone",
        dataPath: "phone_number",
        search_key: "",
        sortable: false,
        filterable: false,
    }
}

const schoolColumns = {
    name: {
        colTitle: "Name",
        dataPath: "name",
        search_key: "name",
        sortable: true,
        filterable: true
    },
    address: {
        colTitle: "Address",
        dataPath: "address",
        search_key: "",
        sortable: false,
        filterable: false
    },
    bus_arrival_time: {
        colTitle: "Bus Arrival Time",
        dataPath: "bus_arrival_time",
        search_key: "bus_arrival_time",
        sortable: true,
        filterable: false
    },
    bus_departure_time: {
        colTitle: "Bus Departure Time",
        dataPath: "bus_departure_time",
        search_key: "bus_departure_time",
        sortable: true,
        filterable: false
    }
}


const routeColumns = {
    name: {
        colTitle: "Name",
        dataPath: "name",
        search_key: "name",
        sortable: true,
        filterable: true
    },
    school_name: {
        colTitle: "School Name",
        dataPath: "school.name",
        search_key: "school__name",
        sortable: true,
        filterable: false
    },
    num_students: {
        colTitle: "Number of Students",
        dataPath: "student_count",
        search_key: "students",
        sortable: true,
        filterable: false
    }
}

const activeDriveColumns = {
    driver: {
        colTitle: "Driver Name",
        dataPath: "driver.full_name",
        search_key: "driver__full_name",
        sortable: true,
        filterable: true
    },
    bus_number: {
        colTitle: "Bus Number",
        dataPath: "bus_number",
        search_key: "bus_number",
        sortable: true,
        filterable: true
    },
    school: {
        colTitle: "School",
        dataPath: "school.name",
        search_key: "school__name",
        sortable: true,
        filterable: true
    },
    route: {
        colTitle: "Route",
        dataPath: "route.name",
        search_key: "route__name",
        sortable: true,
        filterable: true
    },
    direction: {
        colTitle: "Direction",
        dataPath: "direction",
        search_key: "direction",
        sortable: true,
        filterable: false
    },
    start_time: {
        colTitle: "Start Time",
        dataPath: "start_time",
        search_key: "start_time",
        sortable: true,
        filterable: false
    },
    duration: {
        colTitle: "Duration",
        dataPath: "duration",
        search_key: "duration",
        sortable: true,
        filterable: false
    }
}

const allColumns = {
    user: userColumns,
    student: studentColumns,
    school: schoolColumns,
    route: routeColumns,
    stop: stopColumns,
    activeDrive: activeDriveColumns
}

const defaultColumns = {
    user: userDefaultCols,
    student: studentDefaultCols,
    school: schoolDefaultCols,
    route: routeDefaultCols,
    stop: stopDefaultCOls,
    activeDrive: activeDriveDefaultCols
}

const getColsFromArr = (colObj, colTitles) => {
    return colTitles.map(col => {return {colTitle: colObj[col].colTitle, dataPath: colObj[col].dataPath,
        search_key: colObj[col].search_key,sortable: colObj[col].sortable}})
}

const getFiltersFromArr = (colObj, colTitles) => {
    return colTitles.map(col => {return {key: colObj[col].search_key, text: colObj[col].colTitle}})
}

export const getColumns = (type, columnNames = []) => {
    if(columnNames.length == 0){
        return getColsFromArr(allColumns[type], defaultColumns[type])
    }

    return getColsFromArr(allColumns[type], columnNames)
}




export const getFilterOptions = (type, columnNames = []) => {
    const columnObj = allColumns[type];
    let filterNames = columnNames
    if(columnNames.length == 0){
        filterNames = Object.keys(columnObj).filter(col => columnObj[col].filterable == true);
    }

    return getFiltersFromArr(columnObj, filterNames)
}

const getSortFromArr = (colObj, colTitles) => {
    let sortNamesAsc = colTitles.map(col => {return {key: colObj[col].search_key, text: `${colObj[col].colTitle} Ascending`}})
    let sortNamesDesc = colTitles.map(col => {return {key: `-${colObj[col].search_key}`, text: `${colObj[col].colTitle} Descending`}})

    return sortNamesAsc.concat(sortNamesDesc);
}

export const getSortOptions = (type, columnNames = []) => {
    const columnObj = allColumns[type];
    let sortNames = columnNames;
    if(columnNames.length == 0){
        sortNames = Object.keys(columnObj).filter(col => columnObj[col].sortable == true);
    }
    

    return getSortFromArr(columnObj, sortNames)
}
