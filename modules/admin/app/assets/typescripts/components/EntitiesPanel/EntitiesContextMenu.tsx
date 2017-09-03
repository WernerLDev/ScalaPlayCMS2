import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import { Dropdown, Icon, Menu, Segment } from 'semantic-ui-react'
import ContextMenu from '../common/ContextMenu'
import { ContextMenuItem } from '../common/ContextMenu'

export interface EntitiesContextMenuProps {
    onDismiss: (callback?:() => void) => void
    onAddEntity: (discriminator:Api.EntityType) => void
    onCreateFolder: () => void
    onDelete: () => void
    onRename: () => void
    onAction: () => void,
    target: MouseEvent,
    canCreate : boolean,
    canDelete : boolean,
    canRename : boolean,
    entityTypes: Api.EntityType[]
}

class EntitiesContextMenu extends React.Component<EntitiesContextMenuProps, any> {

    constructor(props:EntitiesContextMenuProps, context:any) {
        super(props, context);
    }

    private handleItemClick() {

    }

    entityTypes() {
        return this.props.entityTypes.map(x => {
            return {
                icon : "cube",
                label: x.name,
                onClick: () => this.props.onAddEntity(x),
                children: []
            }
        })
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
                        children: this.entityTypes(),
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
                        onClick: this.props.onRename,
                        children: [],
                        disabled: !this.props.canRename
                    },
                    {
                        icon : "trash",
                        label : "Remove",
                        onClick: this.props.onDelete,
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
