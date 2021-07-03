import React, { useState, useEffect } from "react";

import styles from "./Home.module.css";

import { Layout } from "Layout";
import { Card, CardContainer, Container } from "Components";

import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

import { TextField, Button } from "@material-ui/core";

export default function Home() {
	const [events, setEvents] = useState(null);

	let [fields, setFields] = useState({
		name: "",
		zipcode: "",
		start: "",
		end: "",
	});

	const user = useSelector((state) => state.user);

	let dispatch = useDispatch()

	let clickHandler = () => {
		axios({
			method: "post",
			url: "/user/searchEvents",
			data: fields,
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		}).then((res) => {
			console.log("res", res.data);
			if (res.data.status) {
				setEvents(res.data.events);
			} else {
				let { msg, appearance } = res.data;
				dispatch({type:"SET_ALERT",payload:{msg,appearance}})
			}
		});
	};

	useEffect(() => {
		axios({
			url: "/user/events",
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		}).then((res) => {
			if (res.data.status) {
				setEvents(res.data.events);
			} else {
				let { msg, appearance } = res.data;
				dispatch({type:"SET_ALERT",payload:{msg,appearance}})
			}
		});
	}, []);

	return (
		<Layout noPadding>
			<div
				className={styles.heroWrapper}
				style={{
					backgroundImage:
						user?.role == "volunteer"
							? `url('./home-wallpaper-volunteers.jpg')`
							: `url('./home-wallpaper-charity.jpg')`,
				}}
			>
				<Container className={styles.verticalAlignCenter}>
					<h1 className={styles.mainHeading}>
						Welcome back <br />
						{user.fname}
					</h1>
				</Container>
			</div>
			<Container>
				{user?.role == "volunteer" && (
					<div className={styles.searchSection}>
						<TextField
							onChange={(e) =>
								setFields({
									...fields,
									name: e.target.value,
								})
							}
							value={fields.name}
							label="Name"
							className={styles.formInput}
							fullWidth
							required
						/>
						<TextField
							onChange={(e) =>
								setFields({
									...fields,
									zipcode: e.target.value
										? parseInt(e.target.value)
										: "",
								})
							}
							value={fields.zipcode}
							label="Zip Code"
							className={styles.formInput}
							type="number"
							fullWidth
							required
						/>
						<TextField
							id="date"
							label="Start"
							type="date"
							onChange={(e) =>
								setFields({
									...fields,
									start: e.target.value
										? new Date(e.target.value)
										: "",
								})
							}
							className={styles.formInput}
							InputLabelProps={{
								shrink: true,
							}}
							required
							fullWidth
						/>
						<TextField
							id="date"
							label="End"
							type="date"
							onChange={(e) =>
								setFields({
									...fields,
									end: e.target.value
										? new Date(e.target.value)
										: "",
								})
							}
							className={styles.formInput}
							InputLabelProps={{
								shrink: true,
							}}
							required
							fullWidth
						/>
						<Button
							onClick={clickHandler}
							className={styles.formButton}
							variant="contained"
							fullWidth
						>
							Search Events
						</Button>
					</div>
				)}
				<div className={styles.eventsSection}>
				<h1 className={styles.eventsHeading}>Events Near by</h1>
					{events &&
						(events.length ? (
							<CardContainer>
							{events.map((event) => <Card event={event} />)}
							</CardContainer>
						) : (
							<p>
								Sorry, there are no events nearby. Try visiting
								it after some time.
							</p>
						))}
				</div>		
			</Container>
		</Layout>
	);
}
