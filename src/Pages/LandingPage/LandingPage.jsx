import React,{useState,useEffect} from 'react'
import styles from './LandingPage.module.css'
import {Layout} from '../../Layout'
import {Card,CardContainer,Container} from '../../Components'

export default function LandingPage() {
	return (
		<Layout noPadding>
			<div className={styles.heroWrapper}>
				<Container className={styles.contentWrapper}>
					<h1>The All in one stop where Charity Events and Volunteers meet</h1>
				</Container>
			</div>
			<div className={styles.featuresSection}>
				<Container>
					<h1 className={styles.servicesHeading}>Our Services</h1>
					<div className={styles.lineWrapper}>
						<div className={styles.line}></div>
					</div>
					<div className={styles.cardGrid}>
					<div>
						<h2>Collaboration</h2>
						<p>Charity.io provides a platform through which volunteers and charity organizations could collaborate</p>
					</div>
					<div>
						<h2>Volunteering</h2>
						<p>Charity.io indirectly promotes volunteering efforts which is a key to any charity</p>
					</div>
					<div>
						<h2>Awareness</h2>
						<p>People can get aware of the charity events nearby</p>
					</div>
					</div>
				</Container>
			</div>
		</Layout>
	)
}