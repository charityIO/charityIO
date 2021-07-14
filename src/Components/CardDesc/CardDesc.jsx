import React from "react";
import styles from "./CardDesc.module.css";

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

import { Button } from "Components";

import { useDispatch, useSelector } from "react-redux";

import { serverBaseURL } from "Constants";

export default function CardDesc({
	event: {
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
	},
	removeEvent,
	doesOwn,
}) {
	return (
		<div className={styles.cardDescWrapper}>
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
					<h1 className={styles.cardName}>{name}</h1>
					<p><b>Zipcode:</b> #{zipcode}</p>
					<p>{description}</p>
					{volunteers.length != 0 && (
						<div className={styles.volunteerWrapper}>
							{volunteers?.map((volunteer) => (
								<div className={styles.volunteer}>
									{volunteer}
								</div>
							))}
						</div>
					)}
				</div>
				<div className={styles.cardFooter}>
					<div><b>From:</b> {start}</div>
					<div><b>To:</b> {end}</div>
				</div>
			</div>
		</div>	
	);
}
