import UserReducer from './UserReducer'
import AlertReducer from './AlertReducer'

import {combineReducers} from 'redux'

export default combineReducers({
	user:UserReducer,
	alert:AlertReducer
})
