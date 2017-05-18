import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
import { ContextualMenu, IContextualMenuItem, DirectionalHint } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as Api from '../../api/Api'
import PageTreeContextMenu from './PageTreeContextMenu'
import RenameMode from '../TreeView/partials/RenameMode'
import AddMode from '../TreeView/partials/AddMode'


export interface PageTreeLabelProps {
    item: Tree.TreeViewItem<Api.Document>,
    onContextTriggered: (n:Tree.TreeViewItem<Api.Document>) => void
    onRenamed : (doc:Api.Document) => void
    onAdded : (parent_id:number, name:string, pagetype:string) => void
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

    renderContextMenu() {
        return(
            <PageTreeContextMenu 
              target={this.state.menutarget.nativeEvent}
              onDismiss={this._onDismiss.bind(this)}
              onToggleAdd={() => this.setState({ addingmode: true })}
              onToggleEdit={this._onToggleEdit.bind(this)} />
        )
    }

    renderAddForm() {
        return(
            <AddMode
                icon="file-code-o"
                onBlur={() => this.setState({ addingmode: false })}
                onSubmit={(val:string) => {
                    this.setState({ addingmode: false }, () => {
                        this.props.onAdded(this.props.item.item.id, val, "default");
                    })
                }}
            />
        )
    }

    renderEditForm() {
         let icon = this.props.item.item.doctype == "home" ? "home" : "file-code-o";
         return(
            <RenameMode
                defaultValue={this.props.item.item.label}
                icon={icon}
                onBlur={this._onToggleEdit.bind(this)}
                onSubmit={(newname:string) => {
                    this.setState({ label: newname, editmode: false }, () => {
                        this.props.onRenamed({...this.props.item.item, label: newname});
                    })
                }}
            />
        )
    }

    render() {
        let icon = this.props.item.item.doctype == "home" ? "home" : "file-code-o";
        if(this.state.editmode) return this.renderEditForm();
        return(
            <div onContextMenu={this.toggleContextMenu.bind(this)}>
                <i className={"fa fa-"+icon+" fileicon"} aria-hidden="true"></i> {this.state.label}
                {this.state.addingmode ? this.renderAddForm() : null}
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

}

export default PageTreeLabel;
