import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import FavoriteIcon from "@material-ui/icons/Favorite";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import StarIcon from "@material-ui/icons/Star";
import AddIcon from "@material-ui/icons/Add";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import RemoveIcon from "@material-ui/icons/Remove";

import styles from "./Card.module.css";

import { Button } from "Components";

import { useDispatch, useSelector } from "react-redux";

import { serverBaseURL } from "Constants";

import Modal from "react-modal";

import { CardDesc } from "../";

const modalStyles = {
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
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

export default function Card({ event, removeEvent, doesOwn }) {
	const {
		_id,
		name,
		zipcode,
		start,
		end,
		image,
		volunteers,
		description,
		numberOfVolunteersRequired,
		organizer,
	} = event;
	const [modalIsOpen, setIsOpen] = React.useState(false);
	let user = useSelector((state) => state.user);
	let [modalInfo, setModalInfo] = useState({
		title: "",
		buttons: [],
	});

	let [customStyles, setCustomStyles] = useState({});

	let iconButtons = [
		user.role == "charity" && organizer == user.email && doesOwn && (
			<Link to={`/event/${_id}`}>
				<IconButton className={`${styles.icon} ${styles.edit}`}>
					<EditIcon />
				</IconButton>
			</Link>
		),
		user.role == "charity" && organizer == user.email && doesOwn && (
			<IconButton
				className={`${styles.icon} ${styles.delete}`}
				onClick={(e) => {
					setModalInfo({
						title: `Are you sure you want to delete this event?`,
						buttons: [
							{
								text: "Yes",
								type: "danger",
								onClick: deleteEvent,
							},
							{
								text: "Cancel",
								onClick: (e) => closeModal(),
							},
						],
					});
					openModal();
				}}
			>
				<DeleteIcon className={styles.deleteIcon} />
			</IconButton>
		),
		user.role == "volunteer" && volunteers.includes(user.email) && (
			<IconButton
				className={`${styles.icon} ${styles.add}`}
				onClick={(e) => {
					setModalInfo({
						title: `This would remove you as a volunteer for this organzation. Proceed?`,
						buttons: [
							{
								text: "Yes",
								type: "danger",
								onClick: removeVolunteerFromEvent,
							},
							{
								text: "Cancel",
								onClick: (e) => closeModal(),
							},
						],
					});
					openModal();
				}}
			>
				<RemoveIcon className={styles.addIcon} />
			</IconButton>
		),
		user.role == "volunteer" &&
			!volunteers.includes(user.email) &&
			numberOfVolunteersRequired != volunteers.length && (
				<IconButton
					className={`${styles.icon} ${styles.add}`}
					onClick={(e) => {
						setModalInfo({
							title: `This would send a notification to the charity organization ${organizer} after which they will decide if they want to approve you as a volunteer or not? Send a Volunteering Request?`,
							buttons: [
								{
									text: "Yes",
									type: "success",
									onClick: sendVolunteeringRequest,
								},
								{
									text: "Cancel",
									onClick: (e) => closeModal(),
								},
							],
						});
						openModal();
					}}
				>
					<AddIcon className={styles.addIcon} />
				</IconButton>
			),
	].filter((button) => button);

	function openModal() {
		setIsOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
	}

	let dispatch = useDispatch();

	let deleteEvent = () => {
		axios({
			method: "post",
			url: "/user/deleteEvent",
			data: { id: _id },
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		}).then((res) => {
			removeEvent && removeEvent(_id);
			closeModal();
			let { status, msg, appearance } = res.data;
			dispatch({ type: "SET_ALERT", payload: { msg, appearance } });
		});
	};

	let sendVolunteeringRequest = () => {
		axios({
			method: "post",
			url: "/user/sendVolunteeringRequest",
			data: { organizer, id: _id, name },
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		}).then((res) => {
			closeModal();
			let { status, msg, appearance } = res.data;
			dispatch({ type: "SET_ALERT", payload: { msg, appearance } });
		});
	};

	let removeVolunteerFromEvent = () => {
		axios({
			method: "post",
			url: "/user/removeVolunteerFromEvent",
			data: { eventID: _id },
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		}).then((res) => {
			removeEvent && removeEvent(_id);
			closeModal();
			let { status, msg, appearance } = res.data;
			dispatch({ type: "SET_ALERT", payload: { msg, appearance } });
		});
	};

	return (
		<div className={styles.card}>
			<div className={styles.cardImg}>
				<img src={`${serverBaseURL}/eventImages/${image}`} alt="" />
				{numberOfVolunteersRequired == volunteers?.length ? (
					<div className={styles.numberOfVolunteersFull}>Full</div>
				) : (
					<div className={styles.numberOfVolunteersRequired}>
						{numberOfVolunteersRequired - (volunteers?.length || 0)}
					</div>
				)}
			</div>
			<div className={styles.cardDesc}>
				<div className={styles.cardInfo}>
					<h3 className={styles.cardName}>{name}</h3>
					<p>#{zipcode}</p>
				</div>

				<div className={styles.cardFooter}>
					<div className={styles.date}>{start}</div>
					<div className={styles.date}>{end}</div>
				</div>

				<IconButton
					className={styles.arrowIcon}
					onClick={(e) => {
						setModalInfo({
							event,
							removeEvent,
							doesOwn
						});
						setCustomStyles({
							padding: 0,
							width: "90%",
							maxWidth: "1080px",
							maxHeight: "600px",
							height: "75%",
						});
						openModal();
					}}
				>
					<ArrowForwardIcon />
				</IconButton>
			</div>
			{iconButtons.map((btn) => btn)}
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={{ content: { ...modalStyles, ...customStyles } }}
			>
				{modalInfo.event ? (
					<CardDesc {...modalInfo}  />
				) : (
					<div>
						{modalInfo.title}
						<div className={styles.btnWrapper}>
							{modalInfo.buttons.map(
								({ text, type, onClick }) => (
									<Button onClick={onClick} type={type}>
										{text}
									</Button>
								)
							)}
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
