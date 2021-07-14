import React, { useState, useRef, useEffect } from "react";
import { Container, Button } from "../";
import { Redirect, Link } from "react-router-dom";
import styles from "./Navbar.module.css";

import { IconButton, Badge } from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import StarIcon from "@material-ui/icons/Star";
import AddIcon from "@material-ui/icons/Add";
import NotificationsIcon from "@material-ui/icons/Notifications";
import EventIcon from "@material-ui/icons/Event";
import InfoIcon from "@material-ui/icons/Info";
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar";
import PersonIcon from "@material-ui/icons/Person";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

import Popover from "@material-ui/core/Popover";

import { useSelector, useDispatch } from "react-redux";

import { classNames } from "utils";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import axios from "axios";

import { serverBaseURL } from "Constants";

import { useHistory } from "react-router-dom";

export default function Navbar() {
	let [redirect, setRedirect] = useState(false);

	let user = useSelector((state) => state.user);
	let [notifications, setNotifications] = useState([]);
	let [notificationsNumber, setNotificationsNumber] = useState(0);
	let [notificationSelected, setNotificationSelected] = useState(null);

	let dispatch = useDispatch();
	let history = useHistory();

	let [sidebarOpen, setSidebarOpen] = useState(false);

	let clickHandler = () => {
		setSidebarOpen(!sidebarOpen);
	};

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

	let menuItems = user ? (
		<>
			{user?.role == "charity" && (
				<div>
					<Link to="/addEvent">
						<EventIcon /> <p>Add An Event</p>
					</Link>
				</div>
			)}
			<div>
				<Link to={`/profile/${user._id}`}>
					<img
						src={
							user?.profileImg
								? `${serverBaseURL}/profileImages/${user.profileImg}`
								: "/defaultProfile.png"
						}
						className={styles.profileImage}
					/>
					<p>Profile</p>
				</Link>
			</div>
			<div className={styles.menuItem} onClick={handleClick}>
				<Badge
					color="secondary"
					invisible={notificationsNumber == 0}
					badgeContent={notificationsNumber}
				>
					<NotificationsIcon />
				</Badge>
				<p>Notifications</p>
			</div>
			<div>
				<Link to="/about">
					<InfoIcon />
					<p>About Us</p>
				</Link>
			</div>
			<div>
				<Link to="/contact">
					<PermContactCalendarIcon />
					<p>Contact Us</p>
				</Link>
			</div>
			<div
				className={styles.menuItem}
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
					<InfoIcon />
					<p>About Us</p>
				</Link>
			</div>
			<div>
				<Link to="/contact">
					<PermContactCalendarIcon />
					<p>Contact Us</p>
				</Link>
			</div>
			<div>
				<Link to="/signin">
					<PersonIcon />
					<p>Signin</p>
				</Link>
			</div>
			<div>
				<Link to="/signup">
					<PersonAddIcon />
					<p>Signup</p>
				</Link>
			</div>
		</>
	);

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

	return (
	<>	
		<div className={styles.navbar}>
			<Container className={styles.navWrapper}>
				<div className={styles.logo}>
					<h2>
						<Link to={user ? "/home" : "/"}>Charity.io</Link>
					</h2>
				</div>
				<div className={styles.nav}>{menuItems}</div>
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
				<div>{menuItems}</div>
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
									let shouldHandle =
										!notification.catered &&
										notification.type ==
											"VOLUNTEERING_REQUEST";
									if (shouldHandle) {
										handleClose();
										history.push({
											pathname: `/profile/${notification.volunteerId}`,
											state: { notification },
										});
									}
								}}
							>
								{notification.message}
							</div>
						))}
					</div>
				)}
			</Popover>
		</div>
		<div className={styles.navbarFiller}>
			
		</div>
	</>	
	);
}
