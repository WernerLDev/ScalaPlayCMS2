import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
import { ContextualMenu, IContextualMenuItem, DirectionalHint } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as Api from '../../api/Api'

export interface AssetTreeLabelProps {
    item: Tree.TreeViewItem<Api.Asset>,
    onContextTriggered: (n:Tree.TreeViewItem<Api.Asset>) => void
}

class AssetTreeLabel extends React.Component<AssetTreeLabelProps, any> {

    constructor(props:AssetTreeLabelProps, context:any) {
        super(props, context);
        this.state = {
            contextMenuVisible: false, menutarget:MouseEvent
        }
    }

    toggleContextMenu(e:React.MouseEvent<HTMLElement>) {
        this.props.onContextTriggered(this.props.item);
        e.persist();
        e.preventDefault();
        this.setState({
            contextMenuVisible: true, menutarget: e
        })
    }

    render() {
        let icon = this.props.item.item.mimetype == "home" ? "home" : "file-image-o";
        if(this.props.item.item.mimetype == "folder") {
            icon = "folder";
        }
        return(
            <div onContextMenu={this.toggleContextMenu.bind(this)}>
                <i className={"fa fa-"+icon+" fileicon"} aria-hidden="true"></i> {this.props.item.item.label}
                {this.state.contextMenuVisible ? this.renderContextMenu() : null}    
            </div>
        )
    }

    _onDismiss() {
        this.setState({ contextMenuVisible: false })
    }

    _onToggleSelect() {
        return true;
    }

    renderContextMenu() {
        return(
            <ContextualMenu
            target={this.state.menutarget}
            shouldFocusOnMount={ true }
            onDismiss={ this._onDismiss.bind(this) }
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
                  key: 'share',
                  name: 'Share',
                  onClick: this._onToggleSelect
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

export default AssetTreeLabel;