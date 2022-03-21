import { BULK_IMPORT_SUBMIT, BULK_IMPORT_SUBMIT_LOADING, VALIDATE_BULK_IMPORT, VALIDATE_FOR_SUBMIT, VALIDATION_LOADING } from '../actions/types.js';

const initialState = {
    uploadData: {
        users: [],
        students: []
    },
    isLoading: false,
    successfulSubmit: {
        num_users: 0,
        num_students: 0
    }
};


export default function(state = initialState, action) {
    switch(action.type) {
        case VALIDATION_LOADING: 
        case BULK_IMPORT_SUBMIT_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        case BULK_IMPORT_SUBMIT: {
            return {
                ...state,
                successfulSubmit: action.payload,
                isLoading: false
            }
        }
        case VALIDATE_FOR_SUBMIT: {
            return {
                ...state,
                validateForSubmit: action.payload,
                isLoading: false
            }
        }
        case VALIDATE_BULK_IMPORT:
            return {
                ...state,
                uploadData: action.payload,
                isLoading: false
            }
        default:
            return state;
    }
}