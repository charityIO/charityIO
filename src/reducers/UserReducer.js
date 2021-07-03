let UserReducer = (
	state = JSON.parse(localStorage.getItem("user")) ?? null,
	action
) => {
	switch (action.type) {
		case "SET_USER":
			localStorage.setItem("user", JSON.stringify(action.payload));
			return action.payload;
			break;
		case "LOGOUT":
			localStorage.removeItem("user");
			return null;
			break;
		default:
			return state;
			break;
	}
};

export default UserReducer;

// localStorage.setItem('user',JSON.stringify(action.payload))
