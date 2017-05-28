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
    canDelete : boolean
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
        
        let createItems:ContextMenuItem[] = [
            {
                icon : "plus",
                label : "Create New folder  ",
                onClick: this.props.onToggleAdd,
                children: []
            },
            {
                label : "Upload...",
                onClick: this.props.onToggleUpload,
                children: []
            }
        ]

        let removeItem:ContextMenuItem = {
            icon : "trash",
            label : "Remove",
            onClick: this.props.onToggleDelete,
            children: []
        }

        let otherItems:ContextMenuItem[] = [
            {
                icon : "write",
                label : "Rename",
                onClick: this.props.onToggleEdit,
                children: []
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
        ];

        var items = otherItems;
        if(this.props.canCreate) {
            items = createItems.concat(items);
        }
        if(this.props.canDelete) {
            items = items.concat(removeItem);
        }

        return(
            <ContextMenu
                target={target}
                items={items}
                onDismiss={this.props.onDismiss}
            />
        )
    }
}

export default AssetContextMenu;
