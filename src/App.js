import React from "react";
import {
	ProfilePage,
	Home,
	Signin,
	Signup,
	LandingPage,
	AddEventPage,
	AboutUsPage,
	ContactUsPage,
} from "Pages";

import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";

import { PrivateRoute, PublicRoute } from "Routes";

import { ToastProvider } from "react-toast-notifications";

import { Provider } from "react-redux";
import store from "./store";

import { useSelector } from "react-redux";

import { Alert } from "Components";

export default function App() {
	const isAuth = useSelector((state) => state.user) ? true : false;

	return (
		<ToastProvider autoDismiss autoDismissTimeout={3500}>
			<Alert/>
			<Router>
				<PublicRoute
					path="/signup"
					component={Signup}
					isAuth={isAuth}
				/>
				<PublicRoute
					path="/signin"
					component={Signin}
					isAuth={isAuth}
				/>

				<PublicRoute
					path="/"
					exact
					component={LandingPage}
					isAuth={isAuth}
				/>
				<PrivateRoute path="/home" component={Home} isAuth={isAuth} />

				<PrivateRoute
					path="/addEvent"
					component={AddEventPage}
					isAuth={isAuth}
				/>
				<PrivateRoute
					path="/event/:id"
					component={AddEventPage}
					isAuth={isAuth}
				/>

				<PrivateRoute
					path="/profile"
					component={ProfilePage}
					isAuth={isAuth}
				/>

				<PublicRoute
					path="/contact"
					component={ContactUsPage}
					isAuth={isAuth}
				/>
				<PublicRoute
					path="/about"
					component={AboutUsPage}
					isAuth={isAuth}
				/>
			</Router>
		</ToastProvider>
	);
}
