import * as React from 'react';
import TreeView from '../TreeView/TreeView'
import * as TreeTypes from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import PageTreeLabel from './PageTreeLabel'
import Loading from '../common/Loading'
import { Icon, Menu, Dropdown, Loader } from 'semantic-ui-react'
import * as Tabs from '../TabPanel/TabPanel'
import DocumentEditMode from '../DocumentEditMode/DocumentEditMode'

export interface PagesPanelProps {
    onOpenTab: (tab:Tabs.Tab) => void
}

export interface PagesPanelState {
    documents: Api.DocumentTree[],
    treeItems : TreeTypes.TreeViewItem<Api.Document>[]
    working : boolean
    pagetypes : Api.PageType[]
    selected: TreeTypes.TreeViewItem<Api.Document>
}

class PagesPanel extends React.Component<PagesPanelProps, PagesPanelState> {
    
    constructor(props:PagesPanelProps, context:any) {
        super(props, context);
        this.state = {
            documents: [], treeItems: [], working: true, pagetypes: [], selected: null
        }
    }
 
    toTreeItems(docs:Api.DocumentTree[]):TreeTypes.TreeViewItem<Api.Document>[] {
        return docs.map(doc => {
            return {
                key : doc.document.id.toString(),
                name : doc.document.name,
                collapsed : doc.document.collapsed,
                children: this.toTreeItems(doc.children),
                item: doc.document
            }
        
        })
    }

    refresh() {
        Api.getDocuments().then(documents => {
            var items = this.toTreeItems(documents);
            this.setState({ documents: documents, treeItems: items, working: false });
        });
    }

    componentDidMount() {
        Api.getPageTypes().then(types => {
            Api.getDocuments().then(documents => {
                var items = this.toTreeItems(documents);
                this.setState({ documents: documents, pagetypes: types, treeItems: items, working: false });
            });
        });
    }

    onContextTriggered(n:TreeTypes.TreeViewItem<Api.DocumentTree>) {
    }

    onRenamed(doc:Api.Document) {
        this.setState({ working: true }, () => {
            Api.renameDocument(doc).then(x => {
                this.refresh();
            });
        });
    }

    onAdded(parent_id:number, name:string, pagetype:string) {
        this.setState({ working: true }, () => {
            Api.addDocument(parent_id, name, pagetype).then(x => {
                Api.getDocuments().then(documents => {
                    var items = this.toTreeItems(documents);
                    var newSelection:TreeTypes.TreeViewItem<Api.Document> = {
                        key : x.id.toString(),
                        name : x.name,
                        collapsed : x.collapsed,
                        children: [],
                        item: null
                    }
                    this.setState({ documents: documents, treeItems: items, selected: newSelection, working: false });
                });
            });
        });
    }

    onDeleted(doc:Api.Document) {
         this.setState({ working: true }, () => {
            Api.deleteDocument(doc).then(x => {
                this.refresh();
            });
        });
    }

    onParentChanged(sourceid:number, targetid:number) {
        this.setState({ working: true }, () => {
            Api.updateParentDocument(sourceid, targetid).then(x => {
                this.refresh();
            });
        });
    }

    renderLabel(n:TreeTypes.TreeViewItem<Api.Document>) {
        return( 
            <PageTreeLabel 
                onRenamed={this.onRenamed.bind(this)}  
                onAdded={this.onAdded.bind(this)}
                onDeleted={this.onDeleted.bind(this)}
                onParentChanged={this.onParentChanged.bind(this)}
                pagetypes={this.state.pagetypes}
                item={n} 
                onContextTriggered={this.onContextTriggered.bind(this)} /> )
    }
    
    handleItemClick() {
        this.setState({...this.state, working: true}, () => {
            setTimeout(x => {
                this.refresh();
            }, 500);
        });
    }

    render() {
        if(this.state.treeItems.length == 0) {
            return(<Menu className="smalltoolbar" icon>
                
                <Menu.Item name='refresh' active={false} onClick={this.handleItemClick.bind(this)}>
                    <Icon name='refresh' />
                </Menu.Item>
                <Menu.Item position='right'>
                    <Loader active size="tiny" inline />
                </Menu.Item>
            </Menu>);
        }
        return (
            <div>
                <Menu className="smalltoolbar" icon>
                    
                    <Menu.Item name='refresh' position="right" active={false} onClick={this.handleItemClick.bind(this)}>
                        {this.state.working ? <Loader active size="tiny" inline /> : <Icon name='refresh' /> }
                    </Menu.Item>
                </Menu>
                <TreeView 
                    items={this.state.treeItems} 
                    selected={this.state.selected}
                    onDoubleClick={(n:TreeTypes.TreeViewItem<Api.Document>) => {
                        this.props.onOpenTab({
                            key: n.item.id + "doc",
                            title: n.item.name,
                            content: () => (<DocumentEditMode document={n.item} />)
                        })
                    }}
                    onClick={(n:TreeTypes.TreeViewItem<Api.Document>) => {
                            this.setState({selected: n})
                        }}
                    onRenderLabel={this.renderLabel.bind(this)}
                     onCollapse={(i:TreeTypes.TreeViewItem<Api.Document>, state:boolean) => {
                        Api.collapseDocument(i.item.id, state);
                    }}
                />
            </div>
        );
    }
}

export default PagesPanel;
