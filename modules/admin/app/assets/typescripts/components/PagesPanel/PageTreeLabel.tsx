import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import PageTreeContextMenu from './PageTreeContextMenu'
import RenameMode from '../TreeView/partials/RenameMode'
import AddMode from '../TreeView/partials/AddMode'
import Draggable from '../TreeView/partials/draggable'
import { Button, Modal } from 'semantic-ui-react'
import * as fbemitter from 'fbemitter'

export interface PageTreeLabelProps {
    item: Tree.TreeViewItem<Api.Document>
    onContextTriggered: (n:Tree.TreeViewItem<Api.Document>) => void
    onRenamed : (doc:Api.Document) => void
    onAdded : (parent_id:number, name:string, pagetype:string) => void
    onDeleted : (item:Api.Document) => void
    onParentChanged : (sourceid:number, targetid:number) => void
    pagetypes : Api.PageType[]
    emitter : fbemitter.EventEmitter
}

export interface PageTreeLabelState {
    contextMenuVisible : boolean,
    menutarget : React.MouseEvent<HTMLElement>,
    editmode : boolean,
    label : string,
    addingmode: boolean,
    addtype : string,
    deleted: boolean
}

class PageTreeLabel extends React.Component<PageTreeLabelProps, PageTreeLabelState> {

    constructor(props:PageTreeLabelProps, context:any) {
        super(props, context);
        this.state = {
            editmode: false, deleted: false, contextMenuVisible: false, menutarget:null, addtype: "", label: props.item.name, addingmode: false
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
              pagetypes={this.props.pagetypes}
              isRootNode={this.props.item.item.doctype == "home"}
              onDismiss={this._onDismiss.bind(this)}
              onToggleAdd={(t:string) => this.setState({ addingmode: true, addtype: t })}
              onProperties={() => {
                  this.props.emitter.emit("pagepropertiesopened", this.props.item.item);
              }}
              onToggleDelete={() => {
                    if(confirm("Are you sure?")) {
                        this.setState({ deleted: true  }, () => {
                            this.props.onDeleted(this.props.item.item);
                        })
                    }
                  }}
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
                        this.props.onAdded(this.props.item.item.id, val, this.state.addtype);
                    })
                }}
            />
        )
    }

    renderEditForm() {
         let icon = this.props.item.item.doctype == "home" ? "home" : "file-code-o";
         return(
            <RenameMode
                defaultValue={this.props.item.item.name}
                icon={icon}
                onBlur={this._onToggleEdit.bind(this)}
                onSubmit={(newname:string) => {
                    this.setState({ label: newname, editmode: false }, () => {
                        this.props.onRenamed({...this.props.item.item, name: newname});
                    })
                }}
            />
        )
    }

    renderMenuButton() {
        return(
            <Button 
                onClick={this.toggleContextMenu.bind(this)}
                basic compact size="tiny" floated="right" 
                className="menubtn"
                icon='ellipsis horizontal' />
        )
    }

    render() {
        let icon = this.props.item.item.doctype == "home" ? "home" : "file-code-o";
        if(this.state.editmode) return this.renderEditForm();
        return(
            <Draggable 
                isDropTarget={true}
                onDrop={this.props.onParentChanged.bind(this)}
                item={this.props.item}
                className={this.state.deleted ? "deleted dragitem" : "dragitem"} 
                onContextMenu={this.toggleContextMenu.bind(this)}>
                    <i className={"fa fa-"+icon+" fileicon"} aria-hidden="true"></i> {this.state.label} 
                    {this.state.addingmode ? this.renderAddForm() : this.renderMenuButton()}
                    {this.state.contextMenuVisible ? this.renderContextMenu() : null}    
            </Draggable>
        )
    }

    _onDismiss(callback?:() => void) {
        this.setState({ contextMenuVisible: false }, callback)
    }

    _onToggleSelect() {
        return true;
    }

    _onToggleEdit() {
      this.setState({ editmode: !this.state.editmode });
    }

}

export default PageTreeLabel;
