import tabbar from './TabReducers'
import * as Actions from '../actions/ActionCreators'
import * as ActionTypes from '../constants/ActionTypes'
import { fromJS, List } from 'immutable';
import { combineReducers } from 'redux'

type Action = ActionTypes.TabAction;


export default combineReducers({ 
    tabbar
})

