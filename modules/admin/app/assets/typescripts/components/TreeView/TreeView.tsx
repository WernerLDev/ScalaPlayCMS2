import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TreeTypes from './TreeViewTypes'

class TreeView extends React.Component<TreeTypes.TreeViewProps<any>, any> {
    
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
            this.state = { selected: this.props.selected }
        } else {
            this.state = { selected: this._emptySelection }
        }
    }

    componentWillReceiveProps(nextprops:TreeTypes.TreeViewProps<any>) {
        let notNull = nextprops.selected != null && this.props.selected != null;
        if(notNull && nextprops.selected.key != this.props.selected.key) {
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
        this.setState({ selected: n });
        this.props.onClick(n);
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
                    onRenderLabel={this.props.onRenderLabel} />
            </nav>
        </div>
        );
    }
}

export default TreeView;






class  SubTreeView extends React.Component<TreeTypes.SubTreeViewProps<any>, any> {
  
    constructor(props:TreeTypes.SubTreeViewProps<any>, context:any) {
        super(props, context);
    }

    public static defaultProps: Partial<TreeTypes.SubTreeViewProps<any>> = {
        selected: null,
        onRenderLabel: (n) => {
            return(
                <span><i className="fa fa-file-text" aria-hidden="true"></i> {n.name}</span>
            )
        }
    };
    
    renderTreeNode(n:TreeTypes.TreeViewItem<any>) {
        return(
            <SubTreeViewNode
                key={n.key}
                onRenderLabel={this.props.onRenderLabel}
                selected={this.props.selected}
                onclick={this.props.onClick}
                item={n}
            />
        )
    }
 
    render() {
        let visibleClass = this.props.visible ? "" : " hidden";
        return (
            <ul className={"navItems" + visibleClass}>
                {this.props.items.map(node => this.renderTreeNode(node))}
            </ul>
        );
    }
}





class SubTreeViewNode extends React.Component<TreeTypes.SubTreeViewNodeProps<any>, any> {
  
    constructor(props:TreeTypes.SubTreeViewNodeProps<any>, context:any) {
        super(props, context);
        this.state = {
            collapsed : props.item.collapsed
        }
    }

    switchCollapseState() {
         this.setState({ ...this.state, collapsed: !this.state.collapsed })
    }

    renderCollapseBtn() {
        let icon = this.state.collapsed ? "angle-down" : "angle-down rotateIcon";
        return(
            <span onClick={this.switchCollapseState.bind(this)} className="beforeLabel collapseButton">
                <i className={"chevronIcon fa fa-"+icon} />
            </span>
        )
    }

    renderEmptyPlaceholder() {
        return(<span className="beforeLabel emptyPlaceHolder"></span>);
    }

    renderChilren(node:TreeTypes.TreeViewItem<any>):JSX.Element {
        if(node.children.length == 0) return null;
        else {
            return(
                <SubTreeView 
                    visible={this.state.collapsed}
                    items={node.children} 
                    onRenderLabel={this.props.onRenderLabel} 
                    onClick={this.props.onclick} 
                    selected={this.props.selected} 
                />
            )
        }
    }
    

    renderTreeItem(node:TreeTypes.TreeViewItem<any>):JSX.Element {
        let isSelected = this.props.selected.key == node.key;
        return(
            <li ref="treenode" className="navItem" key={node.key}>
                <div 
                    className={isSelected ? "compositeLink selected" : "compositeLink"}>
                    {node.children.length > 0 ? this.renderCollapseBtn()  : this.renderEmptyPlaceholder() }
                    <span 
                        onClick={() => this.props.onclick(node)} 
                        onContextMenu={() => this.props.onclick(node)}
                        className="link">
                            {this.props.onRenderLabel(node)}
                    </span>
                </div>
                {this.renderChilren(node)}
            </li>
        )
    }

  
  render() {
    return this.renderTreeItem(this.props.item);
  }
}