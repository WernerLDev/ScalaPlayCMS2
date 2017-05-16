
import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
import { ContextualMenu, IContextualMenuItem, DirectionalHint } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as Api from '../../api/Api'

export interface PageTreeLabelProps {
    item: Tree.TreeViewItem<Api.Document>,
    onContextTriggered: (n:Tree.TreeViewItem<Api.Document>) => void
}

export interface PageTreeLabelState {
  contextMenuVisible : boolean,
  menutarget : React.MouseEvent<HTMLElement>,
  editmode : boolean
}

class PageTreeLabel extends React.Component<PageTreeLabelProps, PageTreeLabelState> {

    constructor(props:PageTreeLabelProps, context:any) {
        super(props, context);
        this.state = {
            editmode: false, contextMenuVisible: false, menutarget:null
        }
    }

    toggleContextMenu(e:React.MouseEvent<HTMLElement>) {
        this.props.onContextTriggered(this.props.item);
        e.persist();
        e.preventDefault();
        this.setState({...this.state,
            contextMenuVisible: true, menutarget: e
        })
    }

    render() {
        if(this.state.editmode) return this.renderEditMode();
        let icon = this.props.item.item.doctype == "home" ? "home" : "file-code-o";
        return(
            <div onContextMenu={this.toggleContextMenu.bind(this)}>
                <i className={"fa fa-"+icon+" fileicon"} aria-hidden="true"></i> {this.props.item.item.label}
                {this.state.contextMenuVisible ? this.renderContextMenu() : null}    
            </div>
        )
    }

    renderEditMode() {
        let icon = this.props.item.item.doctype == "home" ? "home" : "file-code-o";
        return(
              <div onContextMenu={this.toggleContextMenu.bind(this)}>
                <div className="treeicon">
                  <i className={"fa fa-"+icon+" fileicon"} aria-hidden="true"></i>
                </div>
                <div className="treerename"> 
                 <input autoFocus  type="text" onBlur={this._onToggleEdit.bind(this)} defaultValue={this.props.item.item.label} />
                </div>
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

    _onToggleEdit() {
      this.setState({ editmode: !this.state.editmode });
    }

    renderContextMenu() {
        return(
            <ContextualMenu
            target={this.state.menutarget.nativeEvent}
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
                  key: 'rename',
                  name: 'Rename',
                  onClick: this._onToggleEdit.bind(this)
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

export default PageTreeLabel;
