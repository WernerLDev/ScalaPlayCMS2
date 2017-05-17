import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
import { ContextualMenu, IContextualMenuItem, DirectionalHint } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as Api from '../../api/Api'

export interface PageTreeContextMenuProps {
    onDismiss: () => void
    onToggleEdit: () => void
    target: MouseEvent
}

class PageTreeContextMenu extends React.Component<PageTreeContextMenuProps, any> {

    constructor(props:PageTreeContextMenuProps, context:any) {
        super(props, context);
    }

    private _onToggleSelect() {

    }

    render() {
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
                    onClick: this._onToggleSelect
                },
                {
                    key: 'rename',
                    name: 'Rename',
                    onClick: this.props.onToggleEdit
                },
                {
                    key: 'mobile',
                    name: 'Mobile',
                    onClick: this._onToggleSelect
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
    }
}

export default PageTreeContextMenu;
