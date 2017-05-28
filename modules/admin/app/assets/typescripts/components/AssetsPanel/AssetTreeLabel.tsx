import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import AssetContextMenu from './AssetContextMenu'
import RenameMode from '../TreeView/partials/RenameMode'
import AddMode from '../TreeView/partials/AddMode'
import Draggable from '../TreeView/partials/draggable'
import { getAssetIcon } from './AssetIcons'

export interface AssetTreeLabelProps {
    item: Tree.TreeViewItem<Api.AssetTree>,
    onContextTriggered: (n:Tree.TreeViewItem<Api.AssetTree>) => void,
    onDeleted: (item:Api.AssetTree) => void,
    onToggleUpload: (parent_id:number) => void,
    onRenamed : (item:Api.AssetTree) => void
    onFolderAdded : (parent_id:number, name:string) => void
    onParentChanged : (sourceid:number, targetid:number) => void
    
}

export interface AssetTreeLabelState {
    contextMenuVisible : boolean
    menutarget : React.MouseEvent<HTMLElement>
    editmode : boolean
    createmode : boolean
    deleted : boolean
    label : string
}

class AssetTreeLabel extends React.Component<AssetTreeLabelProps, AssetTreeLabelState> {

    constructor(props:AssetTreeLabelProps, context:any) {
        super(props, context);
        this.state = {
            contextMenuVisible: false, menutarget:null, editmode: false, createmode: false, deleted: false, label: props.item.item.label
        }
    }

    componentWillReceiveProps(nextProps:AssetTreeLabelProps) {
        if(nextProps.item.name != this.props.item.name) {
          this.setState({ label: nextProps.item.name });
        }
    }

    toggleContextMenu(e:React.MouseEvent<HTMLElement>) {
        this.props.onContextTriggered(this.props.item);
        e.persist();
        e.preventDefault();
        this.setState({ ...this.state,
            contextMenuVisible: true, menutarget: e
        })
    }

    renderAddForm() {
        return(
            <AddMode
                icon={getAssetIcon("folder")}
                onBlur={() => this.setState({ createmode: false })}
                onSubmit={(val:string) => {
                    this.setState({ createmode: false }, () => {
                        this.props.onFolderAdded(this.props.item.item.id, val);
                    })
                }}
            />
        )
    }
    renderEditForm() {
         return(
            <RenameMode
                defaultValue={this.props.item.item.label}
                icon={getAssetIcon(this.props.item.item.mimetype)}
                onBlur={this._onToggleEdit.bind(this)}
                onSubmit={(newname:string) => {
                    this.setState({ ...this.state, label: newname, editmode: false }, () => {
                        this.props.onRenamed({...this.props.item.item, label: newname});
                    })
                }}
            />
        )
    }

    renderContextMenu() {
        let mimetype = this.props.item.item.mimetype;
        return(
            <AssetContextMenu 
              target={this.state.menutarget.nativeEvent}
              canCreate={mimetype == "home" || mimetype == "folder"}
              canDelete={mimetype != "home"}
              onToggleUpload={() => this.props.onToggleUpload(this.props.item.item.id)}
              onDismiss={this._onDismiss.bind(this)}
              onToggleAdd={() => this.setState({createmode: true})}
              onToggleDelete={() => {
                    if(confirm("Are you sure?")) {
                        this.setState({ ...this.state, deleted: true  }, () => {
                            this.props.onDeleted(this.props.item.item);
                        })
                    }
                  }}
              onToggleEdit={this._onToggleEdit.bind(this)} />
        )
    }

    render() {
        let mimetype = this.props.item.item.mimetype;
        let icon = getAssetIcon(this.props.item.item.mimetype);
        if(this.state.editmode) return this.renderEditForm();
        return(
            <Draggable 
                isDropTarget={mimetype == "folder" || mimetype == "home"}
                onDrop={this.props.onParentChanged.bind(this)}
                item={this.props.item}
                className={this.state.deleted ? "deleted dragitem" : "dragitem"} 
                onContextMenu={this.toggleContextMenu.bind(this)}>
                <i className={"fa fa-"+icon+" fileicon"} aria-hidden="true"></i> {this.state.label}
                {this.state.createmode ? this.renderAddForm() : null}
                {this.state.contextMenuVisible ? this.renderContextMenu() : null}    
            </Draggable>
        )
    }

     _onToggleEdit() {
        this.setState({ editmode: !this.state.editmode });
    }

    _onDismiss() {
        this.setState({ contextMenuVisible: false })
    }

    _onToggleSelect() {
        return true;
    }

}

export default AssetTreeLabel;