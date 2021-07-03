import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, isAuth, ...rest }) => {
	console.log('isAuth',isAuth)
	return (
		<Route
			{...rest}
			render={(props) =>
				isAuth == false ? (
					<Component {...props} />
				) : (
					<Redirect to="/home" />
				)
			}
		/>
	);
};

export default PublicRoute;
