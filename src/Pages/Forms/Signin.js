import React, { useState, useEffect } from "react";
import styles from "./Forms.module.css";
import { TextField, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "axios";

import { useDispatch } from "react-redux";

export default function Signin(props) {
	let [fields, setFields] = useState({
		email: "",
		pwd: "",
	});

	let dispatch = useDispatch();

	let [redirect, setRedirect] = useState(false);

	useEffect(() => {
		if (props?.location?.state?.msg) {
			let { msg, appearance } = props.location.state;
			dispatch({ type: "SET_ALERT", payload: { msg, appearance } });
		}
	}, []);

	console.log("Signin Page");

	let clickHandler = () => {
		axios({
			method: "post",
			url: "/signin",
			withCredentials: true,
			data: fields,
		}).then((res) => {
			let { token, auth, user } = res.data;
			if (auth) {
				localStorage.setItem("token", token);
				dispatch({ type: "SET_USER", payload: user });
				props.history.push(props.location?.state?.from || "/home");
			} else {
				let { msg, appearance } = res.data;
				dispatch({ type: "SET_ALERT", payload: { msg, appearance } });
			}
		});
	};

	return (
		<div className={`${styles.formWrapper} ${styles.signInWrapper}`}>
			<div className={`${styles.form} ${styles.leftForm}`}>
				<div className={styles.formFields}>
					<div>
						<h1>Sign In</h1>
						<TextField
							onChange={(e) =>
								setFields({ ...fields, email: e.target.value })
							}
							label="Email"
							type="email"
							className={styles.formInput}
							fullWidth
							required
						/>
						<TextField
							onChange={(e) =>
								setFields({ ...fields, pwd: e.target.value })
							}
							type="password"
							label="Password"
							className={styles.formInput}
							fullWidth
							required
						/>
						<Button
							onClick={clickHandler}
							className={styles.formButton}
							variant="contained"
						>
							Sign In
						</Button>
						<p className={styles.formRedirectionLine}>
							Not a user? <Link to="/signup">Signup</Link>
						</p>
					</div>
				</div>
				<div className={styles.formImage}>
					<img src="signin.jpg" />
				</div>
			</div>
		</div>
	);
}
