import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import { Dropdown, Icon, Menu, Segment } from 'semantic-ui-react'
import ContextMenu from '../common/ContextMenu'
import { ContextMenuItem } from '../common/ContextMenu'

export interface EntitiesContextMenuProps {
    onDismiss: () => void
    onAddEntity: () => void
    onCreateFolder: () => void
    onAction: () => void,
    target: MouseEvent,
    canCreate : boolean,
    canDelete : boolean,
    canRename : boolean
}

class EntitiesContextMenu extends React.Component<EntitiesContextMenuProps, any> {

    constructor(props:EntitiesContextMenuProps, context:any) {
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
                        label : "Create entity",
                        onClick: this.props.onAction,
                        children: [
                            {
                                icon: "cube",
                                label: "Some entity",
                                onClick: this.props.onAddEntity,
                                children: []
                            },
                            {
                                icon: "cube",
                                label: "Another entity",
                                onClick: this.props.onAddEntity,
                                children: []
                            }
                        ],
                        disabled: !this.props.canCreate
                    },
                    {
                        icon : "plus",
                        label : "Create folder  ",
                        onClick: this.props.onCreateFolder,
                        children: [],
                        disabled: !this.props.canCreate
                    },
                    {
                        icon : "write",
                        label : "Rename",
                        onClick: this.props.onAction,
                        children: [],
                        disabled: !this.props.canRename
                    },
                    {
                        icon : "trash",
                        label : "Remove",
                        onClick: this.props.onAction,
                        children: [],
                        disabled: !this.props.canDelete
                    },
                    {
                        label : "Properties",
                        onClick: this.props.onAction,
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

export default EntitiesContextMenu;
