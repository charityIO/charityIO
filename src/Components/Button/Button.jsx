import React, { useState } from "react";
import styles from "./Button.module.css";

import { classNames, typeToColorMapping } from "utils";

export default function Button({ children, type, variant, onClick,className, ...rest }) {
	const [clicked, setClicked] = useState(false);

	return (
		<button
			onClick={(e) => {
				setClicked(true);
				onClick && onClick(e);
			}}
			className={classNames({
				[styles.button]: true,
				[styles.buttonAnimation]: clicked,
				[className]:className
			})}
			style={typeToColorMapping(type, variant)}
			onAnimationEnd={() => {
				setClicked(false);
			}}
			{...rest}
		>
			{children}
		</button>
	);
}
