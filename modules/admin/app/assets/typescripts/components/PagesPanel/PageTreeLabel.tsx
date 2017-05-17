
import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
import { ContextualMenu, IContextualMenuItem, DirectionalHint } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as Api from '../../api/Api'
import PageTreeContextMenu from './PageTreeContextMenu'

export interface PageTreeLabelProps {
    item: Tree.TreeViewItem<Api.Document>,
    onContextTriggered: (n:Tree.TreeViewItem<Api.Document>) => void
    onRenamed : (doc:Api.Document) => void
}

export interface PageTreeLabelState {
  contextMenuVisible : boolean,
  menutarget : React.MouseEvent<HTMLElement>,
  editmode : boolean,
  label : string,
  addingmode: boolean
}

class PageTreeLabel extends React.Component<PageTreeLabelProps, PageTreeLabelState> {

    constructor(props:PageTreeLabelProps, context:any) {
        super(props, context);
        this.state = {
            editmode: false, contextMenuVisible: false, menutarget:null, label: props.item.name, addingmode: false
        }
    }

    componentWillReceiveProps(nextProps:PageTreeLabelProps) {
        if(nextProps.item.name != this.props.item.name) {
          this.setState({ label: nextProps.item.name });
        }
    }

    toggleContextMenu(e:React.MouseEvent<HTMLElement>) {
        this.props.onContextTriggered(this.props.item);
        e.persist();
        e.preventDefault();
        this.setState({...this.state,
            contextMenuVisible: true, menutarget: e
        });
    }

    onKeyPress(e:KeyboardEvent) {
      if(e.keyCode == 13) {
        var newname = (this.refs.editfield as HTMLInputElement).value;
        this.setState({ label: newname }, () => {
          this._onToggleEdit();
          this.props.onRenamed({...this.props.item.item, label: newname});
        })
      }
    }

    renderAddForm() {
        return(
            <div>
            <input type="text" name="" />
            </div>
        )
    }

    render() {
        if(this.state.editmode) return this.renderEditMode();
        let icon = this.props.item.item.doctype == "home" ? "home" : "file-code-o";
        return(
            <div onContextMenu={this.toggleContextMenu.bind(this)}>
                <i className={"fa fa-"+icon+" fileicon"} aria-hidden="true"></i> {this.state.label}
                {this.state.addingmode ? this.renderAddForm() : null}
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
                 <input 
                    autoFocus 
                    ref="editfield" 
                    type="text" 
                    onKeyDown={this.onKeyPress.bind(this)} 
                    onBlur={this._onToggleEdit.bind(this)} 
                    defaultValue={this.props.item.item.label} />
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
            <PageTreeContextMenu 
              target={this.state.menutarget.nativeEvent}
              onDismiss={this._onDismiss.bind(this)}
              onToggleAdd={() => this.setState({ addingmode: true })}
              onToggleEdit={this._onToggleEdit.bind(this)} />
        )
    }
}

export default PageTreeLabel;
