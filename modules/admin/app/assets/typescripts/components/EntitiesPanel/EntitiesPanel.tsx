
import * as React from 'react';
import TreeView from '../TreeView/TreeView'
import * as TreeTypes from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import EntitiesTreeLabel from './EntitiesTreeLabel'
import { Icon, Menu, Dropdown, Loader } from 'semantic-ui-react'

import * as Tabs from '../TabPanel/TabPanel'
import ViewerFactory from '../AssetViewers/ViewerFactory'
import * as fbemitter from 'fbemitter'
export interface EntitiesPanelProps {
    onOpenTab: (tab:Tabs.Tab) => void
    emitter : fbemitter.EventEmitter
}

export interface EntitiesPanelState {
    entities: Api.EntityTree[],
    treeItems : TreeTypes.TreeViewItem<Api.Entity>[],
    working : boolean
    selected : TreeTypes.TreeViewItem<Api.Entity>
}

class EntitiesPanel extends React.Component<EntitiesPanelProps, EntitiesPanelState> {
    
    constructor(props:EntitiesPanelProps, context:any) {
        super(props, context);
        this.state = {
            entities: [], treeItems: [], working: false, selected: null
        }
    }
 
    toTreeItems(entities:Api.EntityTree[]):TreeTypes.TreeViewItem<Api.Entity>[] {
        return entities.map(entityTree => {
            return {
                key : entityTree.entity.id.toString(),
                name : entityTree.entity.name,
                collapsed: true,
                children: this.toTreeItems(entityTree.children),
                item: entityTree.entity
            }
        })
    }

    componentDidMount() {
        Api.getEntities().then(entities => {
            var items = this.toTreeItems(entities);
            this.setState({ entities: entities, treeItems: items });
        });
        this.props.emitter.addListener("entityChanged", this.refresh.bind(this));
    }

    refresh() {
        Api.getEntities().then(entities => {
            var items = this.toTreeItems(entities);
            this.setState({ entities: entities, treeItems: items, working: false });
        });
    }

    onContextTriggered(n:TreeTypes.TreeViewItem<Api.Entity>) {
    }

    

    renderLabel(n:TreeTypes.TreeViewItem<Api.Entity>) {
        return( 
            <EntitiesTreeLabel 
                item={n} 
                emitter={this.props.emitter}
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
                    onDoubleClick={(n:TreeTypes.TreeViewItem<Api.Asset>) => {
                        this.props.onOpenTab({
                            key: n.item.id + "asset",
                            title: n.item.name,
                            content: () => ViewerFactory(n.item, this.props.emitter)
                        })
                    }}
                    onRenderLabel={this.renderLabel.bind(this)}
                    onCollapse={(i:TreeTypes.TreeViewItem<Api.Asset>, state:boolean) => {
                        Api.collapseAsset(i.item.id, state);
                    }}
                />

             

            </div>
        );
    }
}

export default EntitiesPanel;