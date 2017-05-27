import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import AssetContextMenu from './AssetContextMenu'
import RenameMode from '../TreeView/partials/RenameMode'
import Draggable from '../TreeView/partials/draggable'
import { getAssetIcon } from './AssetIcons'

export interface AssetTreeLabelProps {
    item: Tree.TreeViewItem<Api.Asset>,
    onContextTriggered: (n:Tree.TreeViewItem<Api.Asset>) => void,
    onDeleted: (item:Api.Asset) => void,
    onRenamed : (item:Api.Asset) => void
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

    _onToggleEdit() {
        this.setState({ editmode: !this.state.editmode });
    }

    renderEditForm() {
         return(
            <RenameMode
                defaultValue={this.props.item.item.label}
                icon={getAssetIcon(this.props.item.item.mimetype)}
                onBlur={this._onToggleEdit.bind(this)}
                onSubmit={(newname:string) => {
                    this.setState({ label: newname, editmode: false }, () => {
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
              onDismiss={this._onDismiss.bind(this)}
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


    render() {
        // let icon = this.props.item.item.mimetype == "home" ? "home" : "file-image-o";
        // if(this.props.item.item.mimetype == "folder") {
        //     icon = "folder";
        // }
        let icon = getAssetIcon(this.props.item.item.mimetype);
        if(this.state.editmode) return this.renderEditForm();
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

}

export default AssetTreeLabel;