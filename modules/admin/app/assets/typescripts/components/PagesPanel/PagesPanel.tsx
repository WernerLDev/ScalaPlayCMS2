import * as React from 'react';
import TreeView from '../TreeView/TreeView'
import * as TreeTypes from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import PageTreeLabel from './PageTreeLabel'
import Loading from '../common/Loading'

export interface PagesPanelProps {

}

export interface PagesPanelState {
    documents: Api.Document[],
    treeItems : TreeTypes.TreeViewItem<Api.Document>[]
    working : boolean
}

class PagesPanel extends React.Component<PagesPanelProps, PagesPanelState> {
    
    constructor(props:PagesPanelProps, context:any) {
        super(props, context);
        this.state = {
            documents: [], treeItems: [], working: true
        }
    }
 
    toTreeItems(docs:Api.Document[]):TreeTypes.TreeViewItem<Api.Document>[] {
        return docs.map(doc => {
            return {
                key : doc.id.toString(),
                name : doc.label,
                collapsed : doc.collapsed,
                children: this.toTreeItems(doc.children),
                item: doc
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
        this.refresh();
    }

    onContextTriggered(n:TreeTypes.TreeViewItem<Api.Document>) {
    }

    onRenamed(doc:Api.Document) {
        console.log("Got new name" + doc.label);
        this.setState({ working: true }, () => {
            Api.renameDocument(doc).then(x => {
                this.refresh();
            });
        });
    }

    onAdded(parent_id:number, name:string, pagetype:string) {
        this.setState({ working: true }, () => {
            Api.addDocument(parent_id, name, pagetype).then(x => {
                this.refresh();
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
                item={n} 
                onContextTriggered={this.onContextTriggered.bind(this)} /> )
    }
    
    

    render() {
        if(this.state.treeItems.length == 0) {
            return(<Loading />);
        }
        return (
            <div>
                {this.state.working ? (<Loading />) : null}
                <TreeView 
                    items={this.state.treeItems} 
                    onClick={() => console.log("clicked")}
                    onRenderLabel={this.renderLabel.bind(this)}
                />
            </div>
        );
    }
}

export default PagesPanel;
