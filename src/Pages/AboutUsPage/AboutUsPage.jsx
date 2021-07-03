import React from "react";
import styles from "./AboutUsPage.module.css";

import { Layout } from "Layout";

import { Container } from "Components";

export default function AboutUsPage() {
	return (
		<Layout className={styles.about} noPadding>
			<div
				className={styles.heroWrapper}
				style={{ backgroundImage: `url('about-wallpaper2.jpg')`}}
			>
				<Container className={styles.contentWrapper}>
					<div></div>
					<div>
						<h1>About Us</h1>
						<h2>
							Charity.io is a Non Trust Organization which aims to
							bring in volunteers and charity organzation on a
							single platform
						</h2>
					</div>
				</Container>
			</div>
		</Layout>
	);
}
