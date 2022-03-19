import { VALIDATE_BULK_IMPORT, VALIDATION_LOADING } from '../actions/types.js';

const initialState = {
    uploadData: {
        users: [],
        students: []
    },
    isLoading: false
};


export default function(state = initialState, action) {
    switch(action.type) {
        case VALIDATION_LOADING: 
            return {
                ...state,
                isLoading: action.payload
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