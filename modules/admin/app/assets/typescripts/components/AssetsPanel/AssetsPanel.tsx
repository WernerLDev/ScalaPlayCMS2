
import * as React from 'react';
import TreeView from '../TreeView/TreeView'
import * as TreeTypes from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import AssetsTreeLabel from './AssetTreeLabel'
import { Icon, Menu, Dropdown, Loader } from 'semantic-ui-react'
import UploadModal from './UploadModal'

export interface AssetPanelProps {

}

export interface AssetPanelState {
    assets: Api.Asset[],
    treeItems : TreeTypes.TreeViewItem<Api.Asset>[],
    working : boolean
    showUploadDialog : boolean
    upload_parent : number
}

class AssetsPanel extends React.Component<AssetPanelProps, AssetPanelState> {
    
    constructor(props:AssetPanelProps, context:any) {
        super(props, context);
        this.state = {
            assets: [], treeItems: [], working: false, showUploadDialog: false, upload_parent: 0
        }
    }
 
    toTreeItems(assets:Api.Asset[]):TreeTypes.TreeViewItem<Api.Asset>[] {
        return assets.map(asset => {
            return {
                key : asset.id.toString(),
                name : asset.label,
                collapsed: asset.collapsed,
                children: this.toTreeItems(asset.children),
                item: asset
            }
        })
    }

    componentDidMount() {
        Api.getAssets().then(assets => {
            var items = this.toTreeItems(assets);
            this.setState({ assets: assets, treeItems: items });
        });
    }

    refresh() {
        Api.getAssets().then(assets => {
            var items = this.toTreeItems(assets);
            this.setState({ assets: assets, treeItems: items, working: false });
        });
    }

    onContextTriggered(n:TreeTypes.TreeViewItem<Api.Asset>) {
    }

    onDeleted(item:Api.Asset) {
        this.setState({ working: true }, () => {
            Api.deleteAsset(item).then(x => {
                this.refresh();
            })
        })
    }

    onRenamed(asset:Api.Asset) {
        this.setState({ working: true }, () => {
            Api.renameAsset(asset).then(x => {
                this.refresh();
            })
        });
    }

    onFolderAdded(parent_id:number, name:string) {
        this.setState({ working: true }, () => {
            Api.addAsset(parent_id, name, "", "folder").then(x => {
                this.refresh();
            })
        });
    }

    onParentChanged(source_id:number, parent_id:number) {
        this.setState({ working: true }, () => {
            Api.updateParentAsset(source_id, parent_id).then(x => {
                this.refresh();
            })
        })
    }

    toggleUploadModal(parent_id:number) {
        this.setState({ showUploadDialog: !this.state.showUploadDialog, upload_parent: parent_id })
    }

    renderLabel(n:TreeTypes.TreeViewItem<Api.Asset>) {
        return( 
            <AssetsTreeLabel 
                item={n} 
                onToggleUpload={this.toggleUploadModal.bind(this)}
                onRenamed={this.onRenamed.bind(this)}
                onDeleted={this.onDeleted.bind(this)}
                onFolderAdded={this.onFolderAdded.bind(this)}
                onParentChanged={this.onParentChanged.bind(this)}
                onContextTriggered={this.onContextTriggered.bind(this)} /> )
    }

    refreshClicked() {
        this.setState({ working: true }, () => {
            setTimeout(x => {
                this.refresh();
            }, 500);
        })
    }

    render() {
        if(this.state.treeItems.length == 0) {
            return(<div>Loading...</div>);
        }
        return (
            <div>
                <Menu className="smalltoolbar" icon>
                    <Menu.Item position='right' name='refresh' active={false} onClick={this.refreshClicked.bind(this)}>
                        {this.state.working ? <Loader active size="tiny" inline /> : <Icon name='refresh' />}
                    </Menu.Item>
                </Menu>
                <TreeView 
                    items={this.state.treeItems} 
                    onClick={() => console.log("clicked")}
                    onRenderLabel={this.renderLabel.bind(this)}
                />

                {this.state.showUploadDialog ? 
                    <UploadModal 
                        onUploadFinished={(progress:number) => {
                            if(progress == 100) {
                                this.setState({ working: true, showUploadDialog: false }, () => {
                                    this.refresh();
                                })
                            }
                        }}
                        parent_id={this.state.upload_parent} 
                        onClose={this.toggleUploadModal.bind(this)} /> : null }

            </div>
        );
    }
}

export default AssetsPanel;