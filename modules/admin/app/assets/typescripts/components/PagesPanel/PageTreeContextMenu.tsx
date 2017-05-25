import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
//import { ContextualMenu, IContextualMenuItem, DirectionalHint } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as Api from '../../api/Api'
import { Dropdown, Icon, Menu, Segment } from 'semantic-ui-react'
import ContextMenu from '../common/ContextMenu'

export interface PageTreeContextMenuProps {
    onDismiss: () => void
    onToggleEdit: () => void
    onToggleAdd: () => void
    onToggleDelete: () => void
    target: MouseEvent
}

class PageTreeContextMenu extends React.Component<PageTreeContextMenuProps, any> {

    constructor(props:PageTreeContextMenuProps, context:any) {
        super(props, context);
    }

    //mouseDown = this.onDismiss.bind(this)

    private handleItemClick() {

    }

    // componentDidMount() {
    //     document.addEventListener('mousedown', this.mouseDown);
    // }

    // onDismiss(e:MouseEvent) {
    //     let menu = this.refs.contextmenu as HTMLElement;
    //     console.log(menu);
    //     if(!menu.contains(e.target as HTMLElement)) {
    //         document.removeEventListener('mousedown', this.mouseDown);
    //         this.props.onDismiss();
    //     }
    // }

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
                        label : "New",
                        onClick: this.handleItemClick.bind(this),
                        children: [
                            {
                                label : "test",
                                onClick: this.props.onToggleAdd,
                                children: []
                            },
                            {
                                label : "test2",
                                onClick: this.handleItemClick.bind(this),
                                children: []
                            }
                        ]
                    },
                    {
                        icon : "edit",
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
                        label: "Something else",
                        onClick: this.handleItemClick.bind(this),
                        children: [{
                            icon: "edit",
                            label: "subtest",
                            onClick: this.props.onToggleEdit,
                            children: []
                        }, {
                            icon: "globe",
                            label: "Nog een test",
                            onClick: this.handleItemClick.bind(this),
                            children: []
                        }]
                    }
                ]}
                onDismiss={this.props.onDismiss}
            />
        )
    }

    /*render() {
        let top = this.props.target.clientY + "px";
        let left = this.props.target.clientX + "px";
        return(
            <div className="contextmenu" ref="contextmenu" style={{ position: 'fixed', top: top, left: left, zIndex: 999 }}>
            <Menu pointing vertical>
                <Menu.Item name='home' active={false} onClick={this.handleItemClick} />
                <Menu.Item name='messages' active={false} onClick={this.handleItemClick} />
                <Menu.Item name='friends' active={false} onClick={this.handleItemClick} />
                <Dropdown item text='More'>
                    <Dropdown.Menu>
                        <Dropdown.Item icon='edit' text='Edit Profile' />
                        <Dropdown.Item icon='globe' text='Choose Language' />
                        <Dropdown.Item icon='settings' text='Account Settings' />
                    </Dropdown.Menu>
                </Dropdown>
            </Menu>
            </div>
        )
    }*/

    /*render() {
        return(
            <ContextualMenu
            target={this.props.target}
            shouldFocusOnMount={ true }
            onDismiss={ this.props.onDismiss }
            directionalHint={ DirectionalHint.bottomLeftEdge }
            items={
                [
                {
                    key: 'new',
                    name: 'New',
                    iconProps: { iconName: "Add" },
                    onClick: this.props.onToggleAdd
                },
                {
                    key: 'rename',
                    name: 'Rename',
                    iconProps: { iconName: "Edit" },
                    onClick: this.props.onToggleEdit
                },
                {
                    key: 'delete',
                    name: 'Delete',
                    iconProps: { iconName: "Delete" },
                    onClick: this.props.onToggleDelete
                },
                {
                    key: 'divider_1',
                    name: '-',
                },

                {
                    key: 'print',
                    name: 'Print',
                    onClick: this._onToggleSelect
                },
                {
                    key: 'music',
                    name: 'Music',
                    onClick: this._onToggleSelect
                },
                {
                    key: 'musicsub',
                    subMenuProps: {
                    items: [
                        {
                        key: 'emailmsg',
                        name: 'Email message',
                        onClick: this._onToggleSelect
                        },
                        {
                        key: 'event',
                        name: 'Calendar event',
                        onClick: this._onToggleSelect
                        }
                    ],
                    },
                    name: 'New'
                },
                ]
            }
            />
        )
    }*/
}

export default PageTreeContextMenu;
