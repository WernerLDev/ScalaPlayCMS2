import * as React from 'react';
import * as Tree from './components/treeview/TreeViewTypes'
import { ContextualMenu, IContextualMenuItem, DirectionalHint } from 'office-ui-fabric-react/lib/ContextualMenu';

export interface TestTreeViewNodeProps {
    item: Tree.TreeViewItem<any>,
    onContextTriggered: (n:Tree.TreeViewItem<any>) => void
}

class TestTreeViewNode extends React.Component<TestTreeViewNodeProps, any> {

    constructor(props:TestTreeViewNodeProps, context:any) {
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
        return (
            <div onContextMenu={this.toggleContextMenu.bind(this)}>
                <i className="fa fa-file-text" aria-hidden="true"></i> {this.props.item.name}
                {this.state.contextMenuVisible ? this.renderContextMenu() : null}    
            </div>
        );
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

export default TestTreeViewNode;
