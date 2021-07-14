import React, { useState, useEffect } from "react";
import { Layout } from "Layout";
import { Card, CardContainer, Button } from "Components";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import styles from "./ProfilePage.module.css";

import PhoneIcon from "@material-ui/icons/Phone";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import EventIcon from "@material-ui/icons/Event";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";

import { Link } from "react-router-dom";

import { IconButton } from "@material-ui/core";

import { serverBaseURL } from "Constants";

export default function ProfilePage(props) {
	const [events, setEvents] = useState([]);

	const userLoggedIn = useSelector((state) => state.user);
	let [user, setUser] = useState({});
	const [isEdit, setIsEdit] = useState(false);

	let notification = props?.location?.state?.notification;
	const id = props?.match?.params?.id;

	let [fields, setFields] = useState({
		fname: user.fname,
		lname: user.lname,
		email: user.email,
		phoneNo: user.phoneNo,
		image: user.profileImg,
		imgUrl: user.profileImg
			? `${serverBaseURL}/profileImages/${user.profileImg}`
			: undefined,
	});

	let imageOnChange = (e) => {
		if (e.target.files[0]) {
			let imgUrl = URL.createObjectURL(e.target.files[0]);
			setFields({ ...fields, image: e.target.files[0], imgUrl });
		}
	};

	let dispatch = useDispatch();

	let removeEvent = (id) => {
		setEvents([...events.filter((event) => event._id != id)]);
	};

	useEffect(() => {
		axios({
			url: "/user/profile",
			method: "post",
			headers: {
				Authorization: localStorage.getItem("token"),
			},
			data: { id },
		}).then((res) => {
			if (res.data.status) {
				setUser(res.data.user);
				axios({
					url: "/user/myEvents",
					method: "post",
					data: { id },
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				}).then((res) => {
					if (res.data.status) {
						setEvents(res.data.events);
					} else {
						let { msg, appearance } = res.data;
						dispatch({
							type: "SET_ALERT",
							payload: { msg, appearance },
						});
					}
				});
			} else {
				let { msg, appearance } = res.data;
				dispatch({ type: "SET_ALERT", payload: { msg, appearance } });
			}
		});
	}, [id]);

	let editProfile = (e) => {
		e.preventDefault();
		let formdata = new FormData();

		for (const [key, value] of Object.entries(fields)) {
			formdata.append(key, value);
		}

		axios({
			url: "/user/updateProfile",
			method: "post",
			headers: {
				Authorization: localStorage.getItem("token"),
			},
			data: formdata,
		}).then((res) => {
			let { status, msg, appearance, user } = res.data;
			dispatch({ type: "SET_ALERT", payload: { msg, appearance } });
			console.log(res.data);
			if (status) {
				dispatch({ type: "SET_USER", payload: user });
				setIsEdit(false);
			}
		});
	};

	let handleVolunteeringRequest = (e) => {
		axios({
			method: "post",
			url: "/user/handleVolunteeringRequest",
			data: {
				notificationId: notification._id,
				action: e.target.name,
			},
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		}).then((res) => {
			let { msg, appearance } = res.data;
			dispatch({ type: "SET_ALERT", payload: { msg, appearance } });
			props.history.push("/home");
		});
	};

	return (
		<Layout container>
			<div className={styles.profileSectionWrapper}>
				{!isEdit ? (
					<div className={styles.profileSection}>
						<div className={styles.profileImg}>
							<img
								src={
									user?.profileImg
										? `${serverBaseURL}/profileImages/${user.profileImg}`
										: "/defaultProfile.png"
								}
								className={styles.profileImage}
							/>
						</div>
						<div className={styles.profileDesc}>
							<h1 className={styles.name}>
								{user.fname} {user.lname}
							</h1>
							<p className={styles.profileInfoSentence}>
								<AlternateEmailIcon /> <span>{user.email}</span>
							</p>
							<p className={styles.profileInfoSentence}>
								<PhoneIcon /> <span>{user.phoneNo}</span>
							</p>
							<p className={styles.profileInfoSentence}>
								<EventIcon />{" "}
								<span>
									{events.length} events{" "}
									{user?.role == "volunteer"
										? "active"
										: "added"}
								</span>
							</p>
						</div>
					</div>
				) : (
					<form
						className={styles.profileSection}
						onSubmit={editProfile}
					>
						<div className={styles.profileImg}>
							<div className={styles.profileImageWrapper}>
								<div className={styles.fileWrapper}>
									<input
										type="file"
										id={styles.image}
										onChange={imageOnChange}
									/>
									<label for={styles.image}>
										<img
											src={
												fields.imgUrl
													? fields.imgUrl
													: "/defaultProfile.png"
											}
										/>
									</label>
								</div>
							</div>
						</div>
						<div className={styles.profileDesc}>
							<input
								placeholder="First Name"
								value={fields.fname}
								className={styles.formInput}
								onChange={(e) =>
									setFields({
										...fields,
										fname: e.target.value,
									})
								}
								required="required"
							/>
							<input
								placeholder="Last Name"
								value={fields.lname}
								className={styles.formInput}
								onChange={(e) =>
									setFields({
										...fields,
										lname: e.target.value,
									})
								}
							/>
							<input
								placeholder="Email"
								value={fields.email}
								className={styles.formInput}
								onChange={(e) =>
									setFields({
										...fields,
										email: e.target.value,
									})
								}
							/>
							<input
								placeholder="Phone Number"
								value={fields.phoneNo}
								className={styles.formInput}
								onChange={(e) =>
									setFields({
										...fields,
										phoneNo: e.target.value,
									})
								}
							/>
							<Button
								type="submit"
								className={styles.formButton}
								type="primary"
							>
								Update Profile
							</Button>
						</div>
					</form>
				)}
				{props?.location?.state?.notification ? (
					<div className={styles.btnWrapper}>
						<Button
							type="success"
							onClick={handleVolunteeringRequest}
							name="yes"
						>
							Accept
						</Button>
						<Button
							type="danger"
							onClick={handleVolunteeringRequest}
							name="deny"
						>
							Deny
						</Button>
					</div>
				) : (
					<IconButton
						className={styles.floatingIcon}
						onClick={(e) => setIsEdit(!isEdit)}
					>
						{isEdit ? <CloseIcon /> : <EditIcon />}
					</IconButton>
				)}
			</div>
			<div className={styles.yourItems}>
				{events.length == 0 && userLoggedIn._id == id ? (
					user.volunteer == "charity" ? (
						<p className={styles.noEventsPara}>
							Looks like you havent added any events. Want to{" "}
							<Link to="/addEvent">Add an Event?</Link>
						</p>
					) : (
						<p className={styles.noEventsPara}>
							Looks like you havent started volunteering for an
							event? You can do so by going on home and clicking
							on + icon on any Event Card
						</p>
					)
				) : (
					<CardContainer>
						{events.map((event) => (
							<Card
								event={event}
								key={event._id}
								removeEvent={removeEvent}
								doesOwn={
									userLoggedIn._id == props.match.params.id
								}
							/>
						))}
					</CardContainer>
				)}
			</div>
		</Layout>
	);
}
