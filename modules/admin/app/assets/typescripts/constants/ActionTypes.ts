
export interface AddTab {
    type : "ADD_TAB",
    id : number,
    title : string,
    content : () => JSX.Element
}

export interface CloseTab {
    type : "CLOSE_TAB",
    id : number
}

export interface SwitchTab {
    type : "SWITCH_TAB",
    id : number
}

export type TabAction = AddTab | CloseTab | SwitchTab;