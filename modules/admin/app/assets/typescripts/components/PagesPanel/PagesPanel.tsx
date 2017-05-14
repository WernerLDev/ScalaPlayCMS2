import * as React from 'react';
import TreeView from '../treeview/TreeView'
import * as TreeTypes from '../treeview/TreeViewTypes'
import * as Api from '../../api/Api'
import PageTreeLabel from './PageTreeLabel'

export interface PagesPanelProps {

}

export interface PagesPanelState {
    documents: Api.Document[],
    treeItems : TreeTypes.TreeViewItem<Api.Document>[]
}

class PagesPanel extends React.Component<PagesPanelProps, PagesPanelState> {
    
    constructor(props:PagesPanelProps, context:any) {
        super(props, context);
        this.state = {
            documents: [], treeItems: []
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

    componentDidMount() {
        Api.getDocuments().then(documents => {
            var items = this.toTreeItems(documents);
            this.setState({ documents: documents, treeItems: items });
        });
    }

    onContextTriggered(n:TreeTypes.TreeViewItem<Api.Document>) {
        console.log("asdfasdf");
    }

    renderLabel(n:TreeTypes.TreeViewItem<Api.Document>) {
        return( <PageTreeLabel item={n} onContextTriggered={this.onContextTriggered.bind(this)} /> )
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

export default PagesPanel;
