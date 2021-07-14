import React, { useState, useEffect } from "react";
import { Layout } from "../../Layout";
import { InputSelect } from "../../Components";
import { TextField, Button, Switch, MenuItem } from "@material-ui/core";

import styles from "./AddEventPage.module.css";

import axios from "axios";

import { useDispatch } from "react-redux";

import Select from "react-select";

import {serverBaseURL} from 'Constants'

import {useSelector} from 'react-redux'

export default function AddEventPage(props) {
	const id = props.match.params?.id;

	const [volunteerOptions, setVolunteerOptions] = useState([]);

	let dispatch = useDispatch();
	let user = useSelector(state=>state.user)

	let [fields, setFields] = useState({
		name: "",
		zipcode: 0,
		description: "",
		start: "",
		end: "",
		numberOfVolunteersRequired: 0,
		volunteers: [],
		image: null,
		imgUrl: null,
	});

	let imageOnChange = (e) => {
		if (e.target.files[0]) {
			let imgUrl = URL.createObjectURL(e.target.files[0]);
			setFields({ ...fields, image: e.target.files[0], imgUrl });
		}
	};

	const customStyles = {
		option: (provided, state) => ({
			...provided,
			fontSize: "14px",
			fontWeight: 300,
			color: "black",
		}),
		container: (provided, state) => ({
			...provided,
			borderColor: "black",
		}),
		control: (base) => ({
			...base,
			// This line disable the blue border
			boxShadow: "none",
			borderColor: "black",
			fontWeight: 300,
			color: "black",
			"&:hover": {
				borderColor: "black",
			},
			margin: "5px 0",
		}),
		singleValue: (base) => ({
			...base,
			color: "black",
		}),
	};

	let fetchVolunteerEmails = (string) => {
		axios({
			method: "post",
			url: "/user/fetchVolunteerEmails",
			data: { substring: string },
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		}).then((res) => {
			if (res.data.status) {
				setVolunteerOptions(res.data.emails);
			}
		});
	};

	let clickHandler = () => {
		let formdata = new FormData();
		console.log(fields);
		for (const [key, value] of Object.entries(fields)) {
			formdata.append(
				key,
				typeof fields.volunteers != "number"
					? Array.isArray(value)
						? JSON.stringify(value)
						: value
					: parseInt(value)
			);
		}
		id && formdata.append("id", id);

		axios({
			method: "post",
			url: id ? "/user/updateEvent" : "/user/createEvent",
			data: formdata,
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		}).then((res) => {
			let { status, msg, appearance } = res.data;
			dispatch({ type: "SET_ALERT", payload: { msg, appearance } });
			if (status && id) {
				props.history.push(`/profile/${user._id}`);
			} else if (status) {
				setFields({
					name: "",
					zipcode: "",
					description: "",
					start: "",
					end: "",
					numberOfVolunteersRequired: "",
					volunteers: [],
					image: null,
					imgUrl: null,
				});
			}
		});
	};

	useEffect(() => {
		if (id) {
			axios({
				method: "post",
				url: "/user/event",
				data: { id },
				headers: {
					Authorization: localStorage.getItem("token"),
				},
			}).then((res) => {
				let { status, event, msg, appearance } = res.data;
				if (status) {
					setFields({
						...event,
						imgUrl: `${serverBaseURL}/eventImages/${event.image}`,
					});
				} else {
					dispatch({
						type: "SET_ALERT",
						payload: { msg, appearance },
					});
				}
			});
		}
	}, []);

	return (
		<Layout container>
			<div className={styles.addEvent}>
				<div className={styles.formImage}>
					{fields.imgUrl == null ? (
						<div className={styles.fileWrapper}>
							<input
								type="file"
								id={styles.image}
								onChange={imageOnChange}
							/>
							<label for={styles.image}>
								<img src="/default.jpg" />
							</label>
						</div>
					) : (
						<div className={styles.imageWrapper}>
							<img
								className={styles.imageDisplay}
								src={fields.imgUrl}
							/>
							<div
								className={`${styles.absolute} ${styles.fileWrapper}`}
							>
								<input
									type="file"
									id={styles.image}
									onChange={imageOnChange}
								/>
								<label for={styles.image}>
									<img src="/default.jpg" />
								</label>
							</div>
						</div>
					)}
				</div>
				<div className={styles.formFields}>
					<div>
						<h1>{id ? "Update" : "Create"} Event</h1>
						<div>
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
										description: e.target.value,
									})
								}
								value={fields.description}
								label="Description"
								multiline
								rows={4}
								className={styles.formInput}
								fullWidth
								required
							/>
							<TextField
								onChange={(e) =>
									setFields({
										...fields,
										zipcode: parseInt(e.target.value),
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
								onChange={(e) =>
									setFields({
										...fields,
										numberOfVolunteersRequired: parseInt(
											e.target.value
										),
									})
								}
								value={fields.numberOfVolunteersRequired}
								label="Number of Volunteers"
								className={styles.formInput}
								type="number"
								fullWidth
								required
							/>
							<Select
								className={`${styles.formInput} ${styles.select}`}
								classNamePrefix="select"
								isClearable={true}
								name="Volunteers"
								options={volunteerOptions}
								value={fields.volunteers}
								isMulti={true}
								styles={customStyles}
								placeholder="Volunteers"
								onInputChange={(string) =>
									fetchVolunteerEmails(string)
								}
								onChange={(selectedOptions) => {
									setFields({
										...fields,
										volunteers: selectedOptions,
									});
								}}
							/>
							<TextField
								id="date"
								label="Start"
								type="date"
								value={fields.start}
								onChange={(e) =>
									setFields({
										...fields,
										start: e.target.value,
									})
								}
								className={styles.formInput}
								InputLabelProps={{
									shrink: true,
								}}
								required
							/>
							<TextField
								id="date"
								label="End"
								type="date"
								value={fields.end}
								onChange={(e) => {
									console.log(e.target.value);
									setFields({
										...fields,
										end: e.target.value,
									});
								}}
								className={styles.formInput}
								InputLabelProps={{
									shrink: true,
								}}
								required
							/>
							<Button
								onClick={clickHandler}
								className={styles.formButton}
								variant="contained"
							>
								{id ? "Update" : "Create"} Event
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}
