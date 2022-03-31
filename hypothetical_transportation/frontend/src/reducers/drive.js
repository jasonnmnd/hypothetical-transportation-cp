
const initialState = {
    currentRun: {},
    errors: ""
};


export default function(state = initialState, action) {
    switch(action.type) {
        // case VALIDATION_LOADING: 
        // case BULK_IMPORT_SUBMIT_LOADING:
        //     return {
        //         ...state,
        //         isLoading: action.payload
        //     }
        default:
            return state;
    }
}