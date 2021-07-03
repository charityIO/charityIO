import React, { useState, useRef, useEffect } from "react";
import { Container, Button } from "../";
import { Redirect, Link } from "react-router-dom";
import styles from "./Navbar.module.css";

import MenuIcon from "@material-ui/icons/Menu";
import { IconButton, Badge } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import StarIcon from "@material-ui/icons/Star";
import AddIcon from "@material-ui/icons/Add";
import NotificationsIcon from "@material-ui/icons/Notifications";
import EventIcon from "@material-ui/icons/Event";

import Popover from "@material-ui/core/Popover";

import { useSelector, useDispatch } from "react-redux";

import { classNames } from "utils";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import axios from "axios";

import Modal from "react-modal";

import { useToasts } from "react-toast-notifications";

import { serverBaseURL } from "Constants";

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		position: "fixed",
		padding: "40px",
		borderRadius: "20px",
		width: "400px",
	},
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

export default function Navbar() {
	let [redirect, setRedirect] = useState(false);

	let user = useSelector((state) => state.user);
	let [notifications, setNotifications] = useState([]);
	let [notificationsNumber, setNotificationsNumber] = useState(0);
	let [notificationSelected, setNotificationSelected] = useState(null);

	let dispatch = useDispatch();
	const { addToast } = useToasts();

	let [sidebarOpen, setSidebarOpen] = useState(false);

	let clickHandler = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const [modalIsOpen, setIsOpen] = React.useState(false);

	function openModal() {
		setIsOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
	}

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		updateSeenNotifications();
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	useEffect(() => {
		if (user) {
			axios({
				url: "/user/notifications",
				headers: {
					Authorization: localStorage.getItem("token"),
				},
			}).then((res) => {
				setNotifications(res.data.notifications);
				setNotificationsNumber(res.data.numberOfUnseenNotifications);
			});
		}
	}, [anchorEl]);

	let updateSeenNotifications = () => {
		axios({
			url: "/user/seeNotifications",
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		}).then((res) => {
			setNotificationsNumber(0);
		});
	};

	let handleVolunteeringRequest = (e) => {
		axios({
			method: "post",
			url: "/user/handleVolunteeringRequest",
			data: {
				notificationId: notificationSelected._id,
				action: e.target.name,
			},
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		}).then((res) => {
			closeModal();
			let { msg, appearance } = res.data;
			addToast(msg, { appearance });
		});
	};

	return (
		<div className={styles.navbar}>
			<Container className={styles.navWrapper}>
				<div className={styles.logo}>
					<h2>
						<Link to={user ? "/home" : "/"}>Charity.io</Link>
					</h2>
				</div>
				<div className={styles.nav}>
					{user ? (
						<>
							{user?.role == "charity" && (
								<div>
									<Link to="/addEvent">
										<EventIcon /> <p>Add An Event</p>
									</Link>
								</div>
							)}
							<div>
								<Link to="/profile">
									<img
										src={
											user?.profileImg
												? `${serverBaseURL}/profileImages/${user.profileImg}`
												: "default.jpg"
										}
										className={styles.profileImage}
									/>
									<p>Profile</p>
								</Link>
							</div>
							<div
								className={styles.menuItem}
								onClick={handleClick}
							>
								<Badge
									color="secondary"
									invisible={notificationsNumber == 0}
									badgeContent={notificationsNumber}
								>
									<NotificationsIcon />
								</Badge>
							</div>
							<div
								className={styles.logout}
								onClick={(e) => {
									localStorage.removeItem("token");
									dispatch({ type: "LOGOUT" });
									setRedirect(true);
								}}
							>
								<ExitToAppIcon />
							</div>
						</>
					) : (
						<>
							<div>
								<Link to="/about">
									<p>About Us</p>
								</Link>
							</div>
							<div>
								<Link to="/contact">
									<p>Contact Us</p>
								</Link>
							</div>
							<div>
								<Link to="/signin">
									<p>Signin</p>
								</Link>
							</div>
							<div>
								<Link to="/signup">
									<p>Signup</p>
								</Link>
							</div>
						</>
					)}
				</div>
				<IconButton className={styles.hamburger} onClick={clickHandler}>
					{sidebarOpen ? (
						<CloseIcon className={styles.menuIcon} />
					) : (
						<MenuIcon className={styles.menuIcon} />
					)}
				</IconButton>
			</Container>
			{redirect ? <Redirect to="/signin" /> : null}
			<div
				className={classNames({
					[styles.sidebar]: true,
					[styles.sidebarOpen]: sidebarOpen,
				})}
			>
				<div>
					{user ? (
						<>
							{user?.role == "charity" && (
								<div>
									<Link to="/addEvent">
										<EventIcon /> <p>Add An Event</p>
									</Link>
								</div>
							)}
							<div>
								<Link to="/profile">
									<img
										src={
											user?.profileImg
												? `${serverBaseURL}/profileImages/${user.profileImg}`
												: "default.jpg"
										}
										className={styles.profileImage}
									/>
									<p>Profile</p>
								</Link>
							</div>
							<div
								className={styles.menuItem}
								onClick={handleClick}
							>
								<Badge
									color="secondary"
									invisible={notificationsNumber == 0}
									badgeContent={notificationsNumber}
								>
									<NotificationsIcon />
								</Badge>
								<p>Notifications</p>
							</div>
							<div
								className={styles.logout}
								onClick={(e) => {
									localStorage.removeItem("token");
									dispatch({ type: "LOGOUT" });
									setRedirect(true);
								}}
							>
								<ExitToAppIcon />
								<p>Logout</p>
							</div>
						</>
					) : (
						<>
							<div>
								<Link to="/about">
									<p>About Us</p>
								</Link>
							</div>
							<div>
								<Link to="/contact">
									<p>Contact Us</p>
								</Link>
							</div>
							<div>
								<Link to="/signin">
									<p>Signin</p>
								</Link>
							</div>
							<div>
								<Link to="/signup">
									<p>Signup</p>
								</Link>
							</div>
						</>
					)}
				</div>
			</div>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
			>
				{notifications?.length == 0 ? (
					<div className={styles.noNotifRightNow}>
						Sorry, you have no notifications right now
					</div>
				) : (
					<div className={styles.notifList}>
						{notifications.map((notification) => (
							<div
								style={{
									textDecoration: notification.catered
										? "line-through"
										: "initial",
								}}
								onClick={(e) => {
									!notification.catered &&
										notification.type ==
											"VOLUNTEERING_REQUEST" &&
										handleClose();
									!notification.catered &&
										notification.type ==
											"VOLUNTEERING_REQUEST" &&
										setNotificationSelected(notification);
									!notification.catered &&
										notification.type ==
											"VOLUNTEERING_REQUEST" &&
										openModal();
								}}
							>
								{notification.message}
							</div>
						))}
					</div>
				)}
			</Popover>

			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={customStyles}
			>
				<div>
					Do you want to accept this volunteering request?
					<div className={styles.btnWrapper}>
						<Button
							type="success"
							onClick={handleVolunteeringRequest}
							name="yes"
						>
							Yes
						</Button>
						<Button
							type="danger"
							onClick={handleVolunteeringRequest}
							name="deny"
						>
							Deny
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
