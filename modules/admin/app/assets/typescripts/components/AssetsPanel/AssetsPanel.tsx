
import * as React from 'react';
import TreeView from '../TreeView/TreeView'
import * as TreeTypes from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import AssetsTreeLabel from './AssetTreeLabel'
import { Icon, Menu, Dropdown, Loader } from 'semantic-ui-react'

export interface AssetPanelProps {

}

export interface AssetPanelState {
    assets: Api.Asset[],
    treeItems : TreeTypes.TreeViewItem<Api.Asset>[],
    working : boolean
}

class AssetsPanel extends React.Component<AssetPanelProps, AssetPanelState> {
    
    constructor(props:AssetPanelProps, context:any) {
        super(props, context);
        this.state = {
            assets: [], treeItems: [], working: false
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

    onContextTriggered(n:TreeTypes.TreeViewItem<Api.Asset>) {
    }

    onDeleted(item:Api.Asset) {

    }

    onRenamed(asset:Api.Asset) {
        this.setState({ working: true }, () => {
            Api.renameAsset(asset).then(x => {
                Api.getAssets().then(assets => {
                    var items = this.toTreeItems(assets);
                    this.setState({ assets: assets, treeItems: items, working: false });
                })
            })
        });
    }

    renderLabel(n:TreeTypes.TreeViewItem<Api.Asset>) {
        return( 
            <AssetsTreeLabel 
                item={n} 
                onRenamed={this.onRenamed.bind(this)}
                onDeleted={this.onDeleted.bind(this)}
                onContextTriggered={this.onContextTriggered.bind(this)} /> )
    }

    handleItemClick() {
        
    }

    render() {
        if(this.state.treeItems.length == 0) {
            return(<div>Loading...</div>);
        }
        return (
            <div>
                <Menu className="smalltoolbar" icon>
                    <Menu.Item position='right' name='refresh' active={false} onClick={this.handleItemClick.bind(this)}>
                        {this.state.working ? <Loader active size="tiny" inline /> : <Icon name='refresh' />}
                    </Menu.Item>
                </Menu>
                <TreeView 
                    items={this.state.treeItems} 
                    onClick={() => console.log("clicked")}
                    onRenderLabel={this.renderLabel.bind(this)}
                />

            </div>
        );
    }
}

export default AssetsPanel;