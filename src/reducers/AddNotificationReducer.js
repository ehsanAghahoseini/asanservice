function AddNotificationReducer(state = {breakdownListData : []}, action) {
    switch (action.type) {
        case 'BreakdownListData_Loader' :
            return {
                ...state,
                breakdownListData: action.payload,   
            };   
        default:
            return state
    }
}
export default AddNotificationReducer;
