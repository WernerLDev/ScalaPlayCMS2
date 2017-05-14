
import * as React from 'react';
import TreeView from '../treeview/TreeView'
import * as TreeTypes from '../treeview/TreeViewTypes'
import * as Api from '../../api/Api'
import AssetsTreeLabel from './AssetTreeLabel'

export interface AssetPanelProps {

}

export interface AssetPanelState {
    assets: Api.Asset[],
    treeItems : TreeTypes.TreeViewItem<Api.Asset>[]
}

class AssetsPanel extends React.Component<AssetPanelProps, AssetPanelState> {
    
    constructor(props:AssetPanelProps, context:any) {
        super(props, context);
        this.state = {
            assets: [], treeItems: []
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
        console.log("asdfasdf");
    }

    renderLabel(n:TreeTypes.TreeViewItem<Api.Asset>) {
        return( <AssetsTreeLabel item={n} onContextTriggered={this.onContextTriggered.bind(this)} /> )
    }
    
    render() {
        if(this.state.treeItems.length == 0) {
            return(<div>Loading...</div>);
        }
        return (
            <TreeView 
                items={this.state.treeItems} 
                onClick={() => console.log("clicked")}
                onRenderLabel={this.renderLabel.bind(this)}
            />
        );
    }
}

export default AssetsPanel;