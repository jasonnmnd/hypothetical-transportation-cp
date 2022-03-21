import React from 'react';
import { Card } from "react-bootstrap"
import AddressInputWithMap from "../components/common/AddressInputWithMap"
import EditableTextField from "../components/common/EditableTextField"


const USER_1_DATA = {
    "email": {
        value: "Alfredaadswe@example.com",
        error: ["This is an error"],
        duplicates: [{
            "email": "user1@example.com",
            "full_name": "sebastian",
            "address": "an address",
            "phone_number": "9085005966",
        }]
    },
    "full_name": {
        value: "Alfwerwrwerwred TheButler",
        error: ["Another error"],
        duplicates: []
    },
    "address": {
        value: "40 Walters Brook Drive, Bridgewater, NJ",
        error: [],
        duplicates: [{
            "email": "user1@example.com",
            "full_name": "sebastian",
            "address": "an address",
            "phone_number": "9085005966",
        }]
    },
    "phone_number": {
        value: "9083348450",
        error: [],
        duplicates: []
    },
}

const USER_2_DATA = {
    "email": {
        value: "Alfredsdfsdfdsf@example.com",
        error: ["erorrrrr"],
        duplicates: []
    },
    "full_name": {
        value: "Alfredfdsfdsfsfsf TheButler",
        error: [],
        duplicates: []
    },
    "address": {
        value: "52 Walters Brook Drive, Bridgewater, NJ",
        error: [],
        duplicates: []
    },
    "phone_number": {
        value: "9085005966",
        error: [],
        duplicates: []
    },
}

const USER_3_DATA = {
    "email": {
        value: "Alfred@example.com",
        error: [],
        duplicates: []
    },
    "full_name": {
        value: "Alfred TheButler",
        error: [],
        duplicates: []
    },
    "address": {
        value: "60 Walters Brook Drive, Bridgewater, NJ",
        error: [],
        duplicates: []
    },
    "phone_number": {
        value: "9088720608",
        error: [],
        duplicates: []
    },
}

///////////////////// STUDENTS /////////////////////////////

const STUDENT_1_DATA = {
    "parent_email": {
        value: "sdfsdfs@example.com",
        error: [],
        duplicates: [
            {
                parent_email: "duplicate@gmail.com",
                full_name: "duplicate name",
                school_name: "duplicate school",
                student_id: "12"
            }
        ]
    },
    "full_name": {
        value: "dsfssdfdsfdsfdsfsfsdffdr",
        error: [],
        duplicates: []
    },
    "school_name": {
        value: "AAA School",
        error: [],
        duplicates: []
    },
    "student_id": {
        value: 10,
        error: [],
        duplicates: []
    },
}

const STUDENT_2_DATA = {
    "parent_email": {
        value: "sdfsdfs@example.com",
        error: [],
        duplicates: []
    },
    "full_name": {
        value: "dsfsfdr",
        error: [],
        duplicates: []
    },
    "school_name": {
        value: "AAA School",
        error: [],
        duplicates: []
    },
    "student_id": {
        value: 10,
        error: [],
        duplicates: []
    },
}

const STUDENT_3_DATA = {
    "parent_email": {
        value: "fdsfsfs@example.com",
        error: ["Student Error"],
        duplicates: []
    },
    "full_name": {
        value: "fsdkflsdlfjsdlkf",
        error: [],
        duplicates: []
    },
    "school_name": {
        value: "AAA School",
        error: [],
        duplicates: []
    },
    "student_id": {
        value: 11,
        error: [],
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

export const errOrDupExists = (transaction, value, key) => {
    return transaction && transaction[value] && transaction[value][key] && transaction[value][key] != undefined && transaction[value][key].length > 0
}

const issueExists = (transaction, issueType) => {
    return transaction && Object.keys(transaction).some(value => {return errOrDupExists(transaction, value, issueType)})
}

export const errorsExist = (transaction) => {
    return issueExists(transaction, 'error')
}

export const duplicatesExist = (transaction) => {
    return issueExists(transaction, 'duplicates')
}

export const errorsExistMany = (data) => {
    return data.some(transaction => errorsExist(transaction));
}

export const getEditableTextFieldClass = (transaction, fieldName, section) => {
    if(errOrDupExists(transaction, fieldName, 'error')){
        if(section == 'card'){
            return 'border-danger mb-3'
        }
        else if(section == 'body'){
            return 'text-danger'
        }
    }
    else if(errOrDupExists(transaction, fieldName, 'duplicates')){
        if(section == 'card'){
            return 'border-warning mb-3'
        }
        else if(section == 'body'){
            return 'text-warning'
        }
    }
    else {
        return ''
    }

}

export const getEditableTextField = (fieldName, title, info, onChange, transaction) => {
    return (
        <Card className={getEditableTextFieldClass(transaction, fieldName, 'card')}>
            <Card.Header as="h4">{title}</Card.Header>
            <Card.Body className={getEditableTextFieldClass(transaction, fieldName, 'body')}> 
                {fieldName == 'address' ? <AddressInputWithMap 
                                            value={info[fieldName].value} 
                                            title={title} 
                                            keyType={fieldName} 
                                            onSubmit={onChange}/> 
                                        : <EditableTextField 
                                            value={info[fieldName].value} 
                                            title={title} 
                                            keyType={fieldName} 
                                            onSubmit={onChange}/>
                }
            </Card.Body>
        </Card>
    )
}


const removeValue = (transactionIn, index, dataChanges) => {
    let ret = {}
    let transaction = transactionIn;

    if(index in dataChanges){
        transaction = dataChanges[index]
    }

    Object.keys(transaction).forEach(key => {
        ret[key] = transaction[key].value
    })
    return ret;
}

export const dataToValidationPayload = (data, userDataChanges, studentDataChanges) => {
    return {
        users: data.users.map((user, index) => {return removeValue(user, index, userDataChanges)}),
        students: data.students.map((student, index) => {return removeValue(student, index, studentDataChanges)})
    }
}

export const dataToSubmitPayload = (data, userDataChanges, studentDataChanges, checkedUsers, checkedStudents) => {
    let usersToUpload = [];
    let studentsToUpload = [];
    data.users.forEach((user, index) => {if(checkedUsers.includes(index)) {usersToUpload.push(removeValue(user, index, userDataChanges))}})
    data.students.forEach((student, index) => {if(checkedStudents.includes(index)) {studentsToUpload.push(removeValue(student, index, studentDataChanges))}})

    return {
        users: usersToUpload,
        students: studentsToUpload
    }
}