
export interface TreeViewItem<T> {
    key: string
    name: string
    collapsed : boolean
    children: TreeViewItem<T>[]
    item: T
}

export interface TreeViewProps<T> {
    items: TreeViewItem<T>[]
    onClick: (n:TreeViewItem<T>) => void
    selected?:TreeViewItem<T>,
    onRenderLabel?: (node:TreeViewItem<T>) => JSX.Element
    onCollapse? : (item:TreeViewItem<T>, newState:boolean) => void
}

export interface TreeViewState<T> {
    selected: TreeViewItem<T>
}

export interface SubTreeViewProps<T> {
    items: TreeViewItem<T>[]
    onClick: (n:TreeViewItem<T>) => void
    selected?: TreeViewItem<T>
    onRenderLabel?: (node:TreeViewItem<T>) => JSX.Element,
    onCollapse : (item:TreeViewItem<T>, newState:boolean) => void
    visible:boolean
}

export interface SubTreeViewNodeProps<T> {
    item:TreeViewItem<T>
    selected:TreeViewItem<T>
    onclick: (n:TreeViewItem<T>) => void
    onCollapse : (item:TreeViewItem<T>, newState:boolean) => void
    onRenderLabel: (n:TreeViewItem<T>) => JSX.Element
}