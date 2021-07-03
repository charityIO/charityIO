import React from "react";
import { Navbar, Footer, Container } from "../Components";
import classes from "./Layout.module.css";

import { classNames } from "utils";

export default function Layout({ container, children, noPadding, className }) {
	return (
		<div className={classes.layout}>
			<Navbar />
			<div
				className={classNames({
					[classes.layoutContainer]: true,
					[className]: className,
				})}
				style={noPadding ? { padding: 0 } : {}}
			>
				{container ? (
					<Container>{children}</Container>
				) : (
					<>{children}</>
				)}
			</div>
			<Footer />
		</div>
	);
}
