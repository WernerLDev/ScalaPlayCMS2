import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import { Dropdown, Icon, Menu, Segment } from 'semantic-ui-react'
import ContextMenu from '../common/ContextMenu'
import { ContextMenuItem } from '../common/ContextMenu'

export interface AssetContextMenuProps {
    onDismiss: () => void
    onToggleEdit: () => void
    onToggleDelete: () => void
    onToggleAdd: () => void
    onToggleUpload: () => void
    target: MouseEvent,
    canCreate : boolean,
    canDelete : boolean,
    canRename : boolean
}

class AssetContextMenu extends React.Component<AssetContextMenuProps, any> {

    constructor(props:AssetContextMenuProps, context:any) {
        super(props, context);
    }

    private handleItemClick() {

    }

    render() {
        let target = {
            x : this.props.target.clientX,
            y : this.props.target.clientY
        }

        return(
            <ContextMenu
                target={target}
                items={[
                    {
                        icon : "plus",
                        label : "Create New folder  ",
                        onClick: this.props.onToggleAdd,
                        children: [],
                        disabled: !this.props.canCreate
                    },
                    {
                        label : "Upload...",
                        onClick: this.props.onToggleUpload,
                        children: [],
                        disabled: !this.props.canCreate

                    },
                    {
                        icon : "write",
                        label : "Rename",
                        onClick: this.props.onToggleEdit,
                        children: [],
                        disabled: !this.props.canRename
                    },
                    {
                        icon : "trash",
                        label : "Remove",
                        onClick: this.props.onToggleDelete,
                        children: [],
                        disabled: !this.props.canDelete
                    },
                    {
                        label : "Properties",
                        onClick: this.handleItemClick.bind(this),
                        children: []
                    },
                    {
                        label : "Open",
                        onClick: this.handleItemClick.bind(this),
                        children: []
                    }
                ]}
                onDismiss={this.props.onDismiss}
            />
        )
    }
}

export default AssetContextMenu;
