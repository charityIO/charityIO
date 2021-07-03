import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, isAuth, ...rest }) => {
	console.log('isAuth',isAuth)
	return (
		<Route
			{...rest}
			render={(props) =>
				isAuth == true ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/signin",
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
};

export default PrivateRoute;
