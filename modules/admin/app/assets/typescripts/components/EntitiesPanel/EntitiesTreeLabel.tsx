import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import RenameMode from '../TreeView/partials/RenameMode'
import AddMode from '../TreeView/partials/AddMode'
import Draggable from '../TreeView/partials/draggable'
import { Button } from 'semantic-ui-react'
import * as fbemitter from 'fbemitter'
import EntitiesContextMenu from './EntitiesContextMenu'

let entityColours = ["#ff00ff", "#ff0000", "#00ff00", "#0000ff"];

export interface EntitiesTreeLabelProps {
    item: Tree.TreeViewItem<Api.Entity>,
    onContextTriggered: (n:Tree.TreeViewItem<Api.Entity>) => void,
    onNewEntity: (parent_id:number, name:string, discriminator:Api.EntityType) => void 
    onDeleted: (entity:Api.Entity) => void
    onRenamed:(entity:Api.Entity) => void
    onParentChanged:(source_id:number, target_id:number) => void
    emitter: fbemitter.EventEmitter
    entityTypes: Api.EntityType[]
}

export interface EntitiesTreeLabelState {
    contextMenuVisible : boolean
    menutarget : React.MouseEvent<HTMLElement>
    label : string
    createMode: boolean
    createType:Api.EntityType
    editMode:boolean
}

class EntitiesTreeLabel extends React.Component<EntitiesTreeLabelProps, EntitiesTreeLabelState> {

    constructor(props:EntitiesTreeLabelProps, context:any) {
        super(props, context);
        this.state = {
            contextMenuVisible: false, menutarget:null, label: props.item.item.name, createMode: false, createType: null, editMode: false
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
                icon={this.getEntityIcon(this.state.createType.name)}
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

    renderEditForm() {
         return(
            <RenameMode
                defaultValue={this.props.item.item.name}
                icon={this.getEntityIcon(this.props.item.item.discriminator)}
                onBlur={this._onToggleEdit.bind(this)}
                onSubmit={(newname:string) => {
                    this.setState({ ...this.state, label: newname, editMode: false }, () => {
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
                entityTypes={this.props.entityTypes}
                canCreate={this.props.item.item.discriminator == "home" || this.props.item.item.discriminator == "folder"}
                canDelete={this.props.item.item.discriminator != "home"}
                canRename={this.props.item.item.discriminator != "home"}
                onAddEntity={(discriminator) => {
                    this.setState({ ...this.state, contextMenuVisible: false, createMode: true, createType: discriminator })
                }}
                onCreateFolder={() => {
                    this.setState({ ...this.state, contextMenuVisible: false, createMode: true, createType: {name: "folder", plural: "folders" } })
                }}
                onDelete={() => {
                    if(confirm("Are you sure?")) {
                        this.props.onDeleted(this.props.item.item);
                    }
                }}
                onRename={() => {
                    this._onToggleEdit();
                }}
                onAction={() => {

                }}
                onDismiss={this._onDismiss.bind(this)}
                target={this.state.menutarget.nativeEvent}
            />
        )
    }


    getEntityIcon(discriminator:string) {
        switch(discriminator) {
            case 'home':
                return 'cubes'
            case 'folder':
                return 'folder';
            default:
                return 'cube';
        }
    }

    getIcon(entity:Api.Entity) {
        switch(entity.discriminator) {
            case 'home':
                return <i className="fa fa-cubes fileicon" aria-hidden="true"></i>
            case 'folder':
                return <i className="fa fa-folder fileicon" aria-hidden="true"></i>
            default:
                let typeIndex = this.props.entityTypes.findIndex(x => x.name.toLowerCase() == entity.discriminator);
                let color = entityColours[typeIndex];

                return <i style={{color: color }} className="fa fa-cube fileicon" aria-hidden="true"></i>
        }
    }

    render() {
        let discriminator = this.props.item.item.discriminator;
        let icon = this.getIcon(this.props.item.item);
        if(this.state.editMode) return this.renderEditForm();
        return(
            <Draggable 
                isDropTarget={discriminator == "folder" || discriminator == "home"}
                onDrop={(source, target) => this.props.onParentChanged(source, target)}
                item={this.props.item}
                className={"dragitem"} 
                onContextMenu={this.toggleContextMenu.bind(this)}
            >
                {icon} {this.state.label}
                {this.state.createMode ? this.renderAddForm() : this.renderMenuButton()}
                    
                {this.state.contextMenuVisible ? this.renderContextMenu() : null} 
            </Draggable>
        )
    }

     _onToggleEdit() {
        this.setState({ editMode: !this.state.editMode });
    }

    _onDismiss(callback?:() => void) {
        this.setState({ contextMenuVisible: false }, callback)
    }

    _onToggleSelect() {
        return true;
    }

}

export default EntitiesTreeLabel;