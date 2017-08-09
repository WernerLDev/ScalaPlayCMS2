import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import RenameMode from '../TreeView/partials/RenameMode'
import AddMode from '../TreeView/partials/AddMode'
import Draggable from '../TreeView/partials/draggable'
import { Button } from 'semantic-ui-react'
import * as fbemitter from 'fbemitter'
import EntitiesContextMenu from './EntitiesContextMenu'

export interface EntitiesTreeLabelProps {
    item: Tree.TreeViewItem<Api.Entity>,
    onContextTriggered: (n:Tree.TreeViewItem<Api.Entity>) => void,
    onNewEntity: (parent_id:number, name:string, discriminator:string) => void 
    emitter: fbemitter.EventEmitter
}

export interface EntitiesTreeLabelState {
    contextMenuVisible : boolean
    menutarget : React.MouseEvent<HTMLElement>
    label : string
    createMode: boolean
    createType:string
}

class EntitiesTreeLabel extends React.Component<EntitiesTreeLabelProps, EntitiesTreeLabelState> {

    constructor(props:EntitiesTreeLabelProps, context:any) {
        super(props, context);
        this.state = {
            contextMenuVisible: false, menutarget:null, label: props.item.item.name, createMode: false, createType: ""
        }
    }

    componentWillReceiveProps(nextProps:EntitiesTreeLabelProps) {
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
                icon="home"
                onBlur={() => this.setState({ createMode: false })}
                onSubmit={(val:string) => {
                    this.setState({ createMode: false }, () => {
                        this.props.onNewEntity(this.props.item.item.id, val, this.state.createType);
                        //this.props.onFolderAdded(this.props.item.item.id, val);
                    })
                }}
            />
        )
    }
    // renderEditForm() {
    //      return(
    //         <RenameMode
    //             defaultValue={this.props.item.item.name}
    //             icon={getAssetIcon(this.props.item.item.mimetype)}
    //             onBlur={this._onToggleEdit.bind(this)}
    //             onSubmit={(newname:string) => {
    //                 this.setState({ ...this.state, label: newname, editmode: false }, () => {
    //                     this.props.onRenamed({...this.props.item.item, name: newname});
    //                 })
    //             }}
    //         />
    //     )
    // }

    renderMenuButton() {
        return(
            <Button 
                onClick={this.toggleContextMenu.bind(this)}
                basic compact size="tiny" floated="right" 
                className="menubtn"
                icon='ellipsis horizontal' />
        )
    }

    // renderContextMenu() {
    //     let mimetype = this.props.item.item.mimetype;
    //     return(
    //         <AssetContextMenu 
    //           target={this.state.menutarget.nativeEvent}
    //           canCreate={mimetype == "home" || mimetype == "folder"}
    //           canDelete={mimetype != "home"}
    //           canRename={mimetype != "home"}
    //           onProperties={() => {
    //               this.props.emitter.emit("assetpropertiesopened", this.props.item.item)
    //           }}
    //           onToggleUpload={() => this.props.onToggleUpload(this.props.item.item.id)}
    //           onDismiss={this._onDismiss.bind(this)}
    //           onToggleAdd={() => this.setState({createmode: true})}
    //           onToggleDelete={() => {
    //                 if(confirm("Are you sure?")) {
    //                     this.setState({ ...this.state, deleted: true  }, () => {
    //                         this.props.onDeleted(this.props.item.item);
    //                     })
    //                 }
    //               }}
    //           onToggleEdit={this._onToggleEdit.bind(this)} />
    //     )
    // }

    renderContextMenu() {
        return (
            <EntitiesContextMenu 
                canCreate={true}
                canDelete={true}
                canRename={true}
                onAddEntity={() => {
                    this.setState({ createMode: true })
                }}
                onCreateFolder={() => {
                    this.setState({ createMode: true, createType: "folder" })
                }}
                onAction={() => {

                }}
                onDismiss={this._onDismiss.bind(this)}
                target={this.state.menutarget.nativeEvent}
            />
        )
    }

    onParentChanged() {

    }

    getIcon(entity:Api.Entity) {
        switch(entity.discriminator) {
            case 'home':
                return "cubes";
            case 'folder':
                return "folder";
            default:
                return "cube"
        }
    }

    render() {
        let discriminator = this.props.item.item.discriminator;
        let icon = this.getIcon(this.props.item.item);
        //if(this.state.editmode) return this.renderEditForm();
        return(
            <Draggable 
                isDropTarget={discriminator == "folder" || discriminator == "home"}
                onDrop={this.onParentChanged.bind(this)}
                item={this.props.item}
                className={"dragitem"} 
                onContextMenu={this.toggleContextMenu.bind(this)}
            >
                <i className={"fa fa-"+icon+" fileicon"} aria-hidden="true"></i> {this.state.label}
                {this.state.createMode ? this.renderAddForm() : this.renderMenuButton()}
                    
                {this.state.contextMenuVisible ? this.renderContextMenu() : null} 
            </Draggable>
        )
    }

    //  _onToggleEdit() {
    //     this.setState({ editmode: !this.state.editmode });
    // }

    _onDismiss() {
        this.setState({ contextMenuVisible: false })
    }

    _onToggleSelect() {
        return true;
    }

}

export default EntitiesTreeLabel;