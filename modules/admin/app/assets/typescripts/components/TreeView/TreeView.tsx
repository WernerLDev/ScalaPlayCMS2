import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TreeTypes from './TreeViewTypes'
import SubTreeView from './SubTreeView'

interface TreeViewState {
    selected: TreeTypes.TreeViewItem<any>
    lastClick: number
}

class TreeView extends React.Component<TreeTypes.TreeViewProps<any>, TreeViewState> {
    
    private _emptySelection:TreeTypes.TreeViewItem<any> = {
        key: "",
        name: "",
        collapsed: false,
        children: [],
        item: {}
    };

    constructor(props:TreeTypes.TreeViewProps<any>, context:any) {
        super(props, context);
        if(this.props.selected) {
            this.state = { selected: this.props.selected, lastClick: 0 }
        } else {
            this.state = { selected: this._emptySelection, lastClick: 0 }
        }
    }

    componentWillReceiveProps(nextprops:TreeTypes.TreeViewProps<any>) {
        let notNull = nextprops.selected != null && this.props.selected != null;
        if(nextprops.selected != null && this.props.selected == null) {
            this.setState({ selected: nextprops.selected });
        } else if(notNull && nextprops.selected.key != this.props.selected.key) {
            this.setState({ selected: nextprops.selected});
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', function(e:MouseEvent){
            let treeNode = ReactDOM.findDOMNode(this.refs.tree);
            let targetElement = e.target as Element;
            let targetParent = targetElement.parentElement as Element;
            
            let isTreeAction = targetElement.classList.contains("treeaction") || targetParent.classList.contains("treeaction");
            let containsElement = treeNode.contains(targetElement);
            let contextOpen = treeNode.getElementsByClassName("contextmenu").length > 0;
            if(!containsElement && !contextOpen && !isTreeAction) {
                this.setState({selected: this._emptySelection});
            }
        }.bind(this))
    }
  
    onClick(n:TreeTypes.TreeViewItem<any>) {
        let lastClick = (new Date()).getTime();
        let difference = lastClick - this.state.lastClick;
        this.setState({ selected: n, lastClick: lastClick }, () => {
            if(difference < 500) {
                this.props.onDoubleClick(n);
            } else {
                if(this.props.onClick) this.props.onClick(n);
            }
        });
    }

    render() {
        return (
        <div ref='tree' className="TreeContainer">
            <nav role="navigation">
                <SubTreeView 
                    visible={true}
                    items={this.props.items}
                    onClick={this.onClick.bind(this)} 
                    selected={this.state.selected} 
                    onCollapse={this.props.onCollapse}
                    onRenderLabel={this.props.onRenderLabel} />
            </nav>
        </div>
        );
    }
}

export default TreeView;