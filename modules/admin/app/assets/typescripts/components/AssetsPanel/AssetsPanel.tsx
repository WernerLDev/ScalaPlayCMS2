
import * as React from 'react';
import TreeView from '../TreeView/TreeView'
import * as TreeTypes from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import AssetsTreeLabel from './AssetTreeLabel'
import { Icon, Menu, Dropdown, Loader } from 'semantic-ui-react'
import UploadModal from './UploadModal'
import * as Tabs from '../TabPanel/TabPanel'

export interface AssetPanelProps {
    onOpenTab: (tab:Tabs.Tab) => void
}

export interface AssetPanelState {
    assets: Api.AssetTree[],
    treeItems : TreeTypes.TreeViewItem<Api.AssetTree>[],
    working : boolean
    showUploadDialog : boolean
    upload_parent : number
    selected : TreeTypes.TreeViewItem<Api.AssetTree>
}

class AssetsPanel extends React.Component<AssetPanelProps, AssetPanelState> {
    
    constructor(props:AssetPanelProps, context:any) {
        super(props, context);
        this.state = {
            assets: [], treeItems: [], working: false, showUploadDialog: false, upload_parent: 0, selected: null
        }
    }
 
    toTreeItems(assets:Api.AssetTree[]):TreeTypes.TreeViewItem<Api.AssetTree>[] {
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

    onContextTriggered(n:TreeTypes.TreeViewItem<Api.AssetTree>) {
    }

    onDeleted(item:Api.AssetTree) {
        this.setState({ working: true }, () => {
            Api.deleteAsset(item).then(x => {
                this.refresh();
            })
        })
    }

    onRenamed(asset:Api.AssetTree) {
        this.setState({ working: true }, () => {
            Api.renameAsset(asset).then(x => {
                this.refresh();
            })
        });
    }

    onFolderAdded(parent_id:number, name:string) {
        this.setState({ working: true }, () => {
            Api.addAsset(parent_id, name, "", "folder").then(x => {
               Api.getAssets().then(assets => {
                    let items = this.toTreeItems(assets);
                    let newSelection:TreeTypes.TreeViewItem<Api.AssetTree> = {
                        key: x.id.toString(),
                        name: x.name,
                        children: [],
                        collapsed: false,
                        item: null
                    }
                    this.setState({ assets: assets, treeItems: items, selected: newSelection, working: false });
                });
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

    renderLabel(n:TreeTypes.TreeViewItem<Api.AssetTree>) {
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
                    selected={this.state.selected}
                    onClick={() => console.log("clicked")}
                    onDoubleClick={(n:TreeTypes.TreeViewItem<Api.AssetTree>) => {
                        this.props.onOpenTab({
                            key: n.item.id + "asset",
                            title: n.item.label,
                            content: () => (<div>Asset: not implemented yet</div>)
                        })
                    }}
                    onRenderLabel={this.renderLabel.bind(this)}
                    onCollapse={(i:TreeTypes.TreeViewItem<Api.AssetTree>, state:boolean) => {
                        Api.collapseAsset(i.item.id, state);
                    }}
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