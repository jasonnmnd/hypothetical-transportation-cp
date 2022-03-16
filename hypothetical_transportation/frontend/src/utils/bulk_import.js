

const USER_1_DATA = {
    "email": {
        value: "Alfredaadswe@example.com",
        errors: [],
        duplicates: []
    },
    "full_name": {
        value: "Alfwerwrwerwred TheButler",
        errors: [],
        duplicates: []
    },
    "address": {
        value: "40 Walters Brook Drive, Bridgewater, NJ",
        errors: [],
        duplicates: []
    },
    "phone_number": {
        value: "9083348450",
        errors: [],
        duplicates: []
    },
}

const USER_2_DATA = {
    "email": {
        value: "Alfredsdfsdfdsf@example.com",
        errors: [],
        duplicates: []
    },
    "full_name": {
        value: "Alfredfdsfdsfsfsf TheButler",
        errors: [],
        duplicates: []
    },
    "address": {
        value: "52 Walters Brook Drive, Bridgewater, NJ",
        errors: [],
        duplicates: []
    },
    "phone_number": {
        value: "9085005966",
        errors: [],
        duplicates: []
    },
}

const USER_3_DATA = {
    "email": {
        value: "Alfred@example.com",
        errors: [],
        duplicates: []
    },
    "full_name": {
        value: "Alfred TheButler",
        errors: [],
        duplicates: []
    },
    "address": {
        value: "60 Walters Brook Drive, Bridgewater, NJ",
        errors: [],
        duplicates: []
    },
    "phone_number": {
        value: "9088720608",
        errors: [],
        duplicates: []
    },
}

///////////////////// STUDENTS /////////////////////////////

const STUDENT_1_DATA = {
    "parent_email": {
        value: "sdfsdfs@example.com",
        errors: [],
        duplicates: []
    },
    "full_name": {
        value: "dsfssdfdsfdsfdsfsfsdffdr",
        errors: [],
        duplicates: []
    },
    "school_name": {
        value: "AAA School",
        errors: [],
        duplicates: []
    },
    "student_id": {
        value: 10,
        errors: [],
        duplicates: []
    },
}

const STUDENT_2_DATA = {
    "parent_email": {
        value: "sdfsdfs@example.com",
        errors: [],
        duplicates: []
    },
    "full_name": {
        value: "dsfsfdr",
        errors: [],
        duplicates: []
    },
    "school_name": {
        value: "AAA School",
        errors: [],
        duplicates: []
    },
    "student_id": {
        value: 10,
        errors: [],
        duplicates: []
    },
}

const STUDENT_3_DATA = {
    "parent_email": {
        value: "fdsfsfs@example.com",
        errors: [],
        duplicates: []
    },
    "full_name": {
        value: "fsdkflsdlfjsdlkf",
        errors: [],
        duplicates: []
    },
    "school_name": {
        value: "AAA School",
        errors: [],
        duplicates: []
    },
    "student_id": {
        value: 11,
        errors: [],
        duplicates: []
    },
}

export const FAKE_IMPORT_DATA = {
    users: [
        USER_1_DATA,
        USER_2_DATA,
        USER_3_DATA
    ],
    students: [
        STUDENT_1_DATA,
        STUDENT_2_DATA,
        STUDENT_3_DATA
    ]
}



export const USER_COLUMNS = [
    {
        header: 'Email',
        accessor: 'email',
    },
    {
        header: 'Name',
        accessor: 'full_name',
    },
    {
        header: 'Address',
        accessor: 'address',
    },
    {
        header: 'Phone Number',
        accessor: 'phone_number',
    },
]

export const STUDENT_COLUMNS = [
    {
        header: 'Name',
        accessor: 'full_name',
    },
    {
        header: 'Parent Email',
        accessor: 'parent_email',
    },
    {
        header: 'School Name',
        accessor: 'school_name',
    },
    {
        header: 'Student ID',
        accessor: 'student_id',
    },
]

