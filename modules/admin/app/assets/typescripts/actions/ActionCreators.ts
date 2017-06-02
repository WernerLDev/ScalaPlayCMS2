
let nextTabId = 0

export const addTab = (title:string, content:() => JSX.Element) => ({
    type: "ADD_TAB",
    id: ++nextTabId,
    title: title,
    content: content
});

export const closeTab = (id:number) => ({
    type: "CLOSE_TAB",
    id: id
});

export const switchTab = (id:number) => ({
    type: "SWITCH_TAB",
    id: id
});
