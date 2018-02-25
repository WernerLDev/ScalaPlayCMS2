import * as React from 'react'
import * as TreeTypes from './TreeViewTypes'
import SubTreeView from './SubTreeView'

export default class SubTreeViewNode extends React.Component<TreeTypes.SubTreeViewNodeProps<any>, any> {

  constructor(props: TreeTypes.SubTreeViewNodeProps<any>, context: any) {
    super(props, context);
    this.state = {
      collapsed: props.item.collapsed
    }
  }

  switchCollapseState() {
    this.setState({ ...this.state, collapsed: !this.state.collapsed }, () => {
      this.props.onCollapse(this.props.item, this.state.collapsed);
    })
  }

  renderCollapseBtn() {
    let icon = this.state.collapsed ? "angle-down" : "angle-down rotateIcon";
    return (
      <span onClick={this.switchCollapseState.bind(this)} className="beforeLabel collapseButton">
        <i className={"chevronIcon fa fa-" + icon} />
      </span>
    )
  }

  renderEmptyPlaceholder() {
    return (<span className="beforeLabel emptyPlaceHolder"></span>);
  }

  renderChilren(node: TreeTypes.TreeViewItem<any>): JSX.Element {
    if (node.children.length == 0) return null;
    else {
      return (
        <SubTreeView
          visible={this.state.collapsed}
          items={node.children}
          onRenderLabel={this.props.onRenderLabel}
          onClick={this.props.onclick}
          onCollapse={this.props.onCollapse}
          selected={this.props.selected}
        />
      )
    }
  }


  renderTreeItem(node: TreeTypes.TreeViewItem<any>): JSX.Element {
    let isSelected = this.props.selected.key == node.key;
    return (
      <li ref="treenode" className="navItem" key={node.key}>
        <div
          className={isSelected ? "compositeLink selected" : "compositeLink"}>
          {node.children.length > 0 ? this.renderCollapseBtn() : this.renderEmptyPlaceholder()}
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