import React from 'react'
import classes from './Container.module.css'

export default function Container({children,className,...rest}) {
	return (
		<div className={`${classes.container} ${className}`} {...rest}>
			{children}
		</div>
	)
}