import React, { useEffect } from "react";

import { useToasts } from "react-toast-notifications";
import { useSelector } from "react-redux";

export default function Alert() {
	const { addToast } = useToasts();
	const alert = useSelector((state) => state.alert);

	useEffect(() => {
		if (alert) {
			let { msg, appearance } = alert;
			addToast(msg, { appearance });
		}
	}, [alert]);

	return <div></div>;
}
