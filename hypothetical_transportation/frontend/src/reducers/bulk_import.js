import { VALIDATE_BULK_IMPORT } from '../actions/types.js';

const initialState = {
    uploadData: {
        users: [],
        students: []
    }
};


export default function(state = initialState, action) {
    switch(action.type) {
        case VALIDATE_BULK_IMPORT:
            return {
                ...state,
                uploadData: action.payload
            }
        default:
            return state;
    }
}