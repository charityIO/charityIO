let AlertReducer = (state = null, action) => {
	switch (action.type) {
		case "SET_ALERT":
			return action.payload;
			break;
		default:
			return state;
			break;
	}
};

export default AlertReducer;
