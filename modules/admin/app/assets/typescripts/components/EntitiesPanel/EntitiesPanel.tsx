
import * as React from 'react';
import TreeView from '../TreeView/TreeView'
import * as TreeTypes from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import EntitiesTreeLabel from './EntitiesTreeLabel'
import { Icon, Menu, Dropdown, Loader } from 'semantic-ui-react'
import EntityTabPanel from './EntityTabPanel'
import * as Tabs from '../TabPanel/TabPanel'
import ViewerFactory from '../AssetViewers/ViewerFactory'
import * as fbemitter from 'fbemitter'
export interface EntitiesPanelProps {
    onOpenTab: (tab:Tabs.Tab) => void
    emitter : fbemitter.EventEmitter
}

export interface EntitiesPanelState {
    entities: Api.EntityTree[],
    entityTypes: Api.EntityType[],
    treeItems : TreeTypes.TreeViewItem<Api.Entity>[],
    working : boolean
    selected : TreeTypes.TreeViewItem<Api.Entity>
}

class EntitiesPanel extends React.Component<EntitiesPanelProps, EntitiesPanelState> {
    
    constructor(props:EntitiesPanelProps, context:any) {
        super(props, context);
        this.state = {
            entities: [], entityTypes: [], treeItems: [], working: false, selected: null
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
            Api.getEntityTypes().then(types => {
                var items = this.toTreeItems(entities);
                this.setState({ entities: entities, entityTypes: types, treeItems: items });
            })
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
                entityTypes={this.state.entityTypes}
                emitter={this.props.emitter}
                onDeleted={(entity) => {
                    Api.deleteEntity(entity).then(x => {
                        this.refresh();
                    })
                }}
                onRenamed={(e:Api.Entity) => {
                    Api.renameEntity(e).then(x => {
                        this.refresh();
                    });
                }}
                onNewEntity={(parent_id:number, name:string, discriminator:Api.EntityType) => {
                    this.setState({...this.state, working: true}, () => {
                        Api.addEntity(parent_id, name, discriminator).then(entity => {
                            Api.getEntities().then(entities => {
                                let items = this.toTreeItems(entities);
                                let newSelection:TreeTypes.TreeViewItem<Api.Entity> = {
                                    key: entity.id.toString(),
                                    name: entity.name,
                                    children: [],
                                    collapsed: false,
                                    item: entity
                                }
                                this.setState({
                                    ...this.state,
                                    entities: entities,
                                    treeItems: items,
                                    selected: newSelection,
                                    working: false
                                })
                            })
                        });
                    })
                }}
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
                    onDoubleClick={(n:TreeTypes.TreeViewItem<Api.Entity>) => {
                        this.props.onOpenTab({
                            key: n.item.id + "entity",
                            title: n.item.name,
                            content: () => (
                                <EntityTabPanel 
                                    item={n.item}
                                    fields={[
                                        { name: "name", value: "", type: "text" },
                                        { name: "lastname", value: "", type: "text" },
                                        { name: "isActive", value: true, type: "bool" },
                                        { name: "age", value: 0, type: "number" },
                                        { name: "email", value: "", type: "text" },
                                        { name: "test", value: new Date(), type: "date" },
                                        { name: "Info", value: "", type: "textarea" },
                                        { name: "Language", value: "", type: "radio", options: [
                                            { value: "en", text: "English" },
                                            { value: "nl", text: "Dutch" }
                                        ]}
                                    ]}
                                />
                            )
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