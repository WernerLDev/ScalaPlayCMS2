import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
//import { ContextualMenu, IContextualMenuItem, DirectionalHint } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as Api from '../../api/Api'
import { Dropdown, Icon, Menu, Segment } from 'semantic-ui-react'
import ContextMenu from '../common/ContextMenu'

export interface PageTreeContextMenuProps {
    onDismiss: () => void
    onToggleEdit: () => void
    onToggleAdd: (type:string) => void
    onToggleDelete: () => void
    target: MouseEvent
    pagetypes : Api.PageType[] 
}

class PageTreeContextMenu extends React.Component<PageTreeContextMenuProps, any> {

    constructor(props:PageTreeContextMenuProps, context:any) {
        super(props, context);
    }

    private handleItemClick() {

    }

    render() {
        let target = {
            x : this.props.target.clientX,
            y : this.props.target.clientY
        }
        
        let newtypes = this.props.pagetypes.map ( x => {
            return {
                key : x.typekey,
                label : x.typename,
                onClick: () => this.props.onToggleAdd(x.typekey),
                children: []
            }
        });
        return(
            <ContextMenu
                target={target}
                items={[
                    {
                        icon : "plus",
                        label : "Create New...",
                        onClick: this.handleItemClick.bind(this),
                        children: newtypes
                    },
                    {
                        icon : "write",
                        label : "Rename",
                        onClick: this.props.onToggleEdit,
                        children: []
                    },
                    {
                        icon : "trash",
                        label : "Remove",
                        onClick: this.props.onToggleDelete,
                        children: []
                    },
                    {
                        label : "Dublicate",
                        onClick: this.handleItemClick.bind(this),
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
                ]}
                onDismiss={this.props.onDismiss}
            />
        )
    }
}

export default PageTreeContextMenu;
