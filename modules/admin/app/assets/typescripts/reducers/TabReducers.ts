import * as Actions from '../actions/ActionCreators'
import * as ActionTypes from '../constants/ActionTypes'
import { fromJS, List } from 'immutable';


export interface SingleTab {
    id?: number,
    title : string,
    content : () => JSX.Element
}

export interface TabsState {
    activeTab: number,
    tabs : List<SingleTab>
}

export const initialState:TabsState = {
    activeTab : 0,
    tabs : List<SingleTab>()
}

function TabReducer(state = initialState.tabs, action: ActionTypes.TabAction) {
    switch(action.type) {
        case "ADD_TAB":
            return state.push({
                id: action.id,
                title: action.title,
                content: action.content
            });
        case "CLOSE_TAB":
            return state.filterNot(x => x.id == action.id);
        default:
            return state;
    }
}

function ActiveTabReducer(state = initialState.activeTab, action : ActionTypes.TabAction) {
    switch(action.type) {
        case "SWITCH_TAB":
            return action.id
        default:
            return state;
    }
}


export default function tabbar(state = initialState, action: ActionTypes.TabAction) {
  return {
        activeTab: ActiveTabReducer(state.activeTab, action),
        tabs: TabReducer(state.tabs, action)
  }
}