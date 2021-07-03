import React from "react";
import styles from "./ContactUsPage.module.css";

import { Layout } from "Layout";

import { Container } from "Components";

export default function ContactUsPage() {
	return (
		<Layout className={styles.contact} noPadding>
			<div
				className={styles.heroWrapper}
				style={{ backgroundImage: `url('contact-wallpaper1.jpg')` }}
			>
				<Container className={styles.contentWrapper}>
					<div>
						<h1>Contact Us</h1>
						<h2>
							You can contact us on the following email
							charity.io@gmail.com
						</h2>
					</div>
					<div></div>
				</Container>
			</div>
		</Layout>
	);
}
