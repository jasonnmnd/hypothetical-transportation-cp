export default function config(token) {
    return {headers: { Authorization: `Token ${token}` }};
}


const userDefaultCols = [
    "full_name",
    "email",
    "address",
    "group_name"
]

const studentDefaultCols = [
    "student_id",
    "full_name",
    "school_name",
    "route_name",
    "parent_name"
]

const schoolDefaultCols = [
    "name",
    "address",
]

const routeDefaultCols = [
    "name",
    "school_name",
    "num_students",
]

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
    group_name: {
        colTitle: "Group",
        dataPath: "groups.0.name",
        search_key: "",
        sortable: false,
        filterable: false
    },
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

const allColumns = {
    user: userColumns,
    student: studentColumns,
    school: schoolColumns,
    route: routeColumns
}

const defaultColumns = {
    user: userDefaultCols,
    student: studentDefaultCols,
    school: schoolDefaultCols,
    route: routeDefaultCols
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
