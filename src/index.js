import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import axios from "axios";

import { Provider } from "react-redux";
import store from "./store";

import {serverBaseURL} from 'Constants'

/*
Setting up the baseURL of the server where the requests will be sent to
*/

axios.defaults.baseURL = serverBaseURL;

/*
Starting point of the app. Everything we code in React attaches to the #root element which is just 
a div with an id of root. You can see it in public/index.html
*/

/*
I cannot explain everything in comments here because React has a lot of stuff going on. Its easy but still
comments won't be suffice

I am mentioning the technologies/libraries etc I have used so that it is easier to learn this web app

################################
#########Internal Stuff#########
################################

1) State/Props
This would be the foundation of React. If you get this, then React is nothing. The concept itself is pretty
simple

2) React hooks(useState,useEffect mainly. useRef as well)
This is key to learning React. There is a lot of learning material and videos online on this so should
not be a problem

3) CSS modules
You will see me using a lot of files ending with .module.css instead of .css. Look it up as well. 

4) Layouts
The concept of using a layout where we can put Navbars and Footers and reuse the structure

5) Private Routes
In the Routes folder, you would see two files PrivateRoute and PublicRoute. The idea is to allow users
to private pages if they are loggedin while disallowing them to view pages like signin, signup, landing page
etc and vice versa for not logged in users. You can search Private Routes in React and you would find
a similar implementation everywhere.

################################
#######External Libraries#######
################################

1) Redux for state management(redux, react-redux)
It is used to share data across multiple pages. This concept is a must learn.

2) react-router-dom
This is used to create routes for pages

3) react-toast-notifications and react-modal
Used for showing toasts and modal.
This Architecture of how I am using Alerts is pretty cool and you should learn it. Keeping 
the logic for alerts in just one file and just using Redux for triggering that alert instead of 
importing this package in many places and using it

4) Material-UI(@material-ui/core, @material-ui/icons)
Material is a design system made by Google. It has a lot of components like buttons, dropdowns, 
tooltips etc which can be used to prototype applications faster. Material-UI is its implementation in
React. It is available for Angular, Vue and other frameworks as well.

In some places I have used Material-UI and in some places I have written my own code with custom HTML
and CSS. You can replace them all with material or just make your own or change my own and replace them
everywhere in the app. Your choice

*/
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root")
);
