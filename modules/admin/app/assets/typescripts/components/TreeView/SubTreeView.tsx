import * as React from 'react'
import * as TreeTypes from './TreeViewTypes'
import SubTreeViewNode from './SubTreeViewNode'

export default class SubTreeView extends React.Component<TreeTypes.SubTreeViewProps<any>, any> {

  constructor(props: TreeTypes.SubTreeViewProps<any>, context: any) {
    super(props, context);
  }

  public static defaultProps: Partial<TreeTypes.SubTreeViewProps<any>> = {
    selected: null,
    onRenderLabel: (n) => {
      return (
        <span><i className="fa fa-file-text" aria-hidden="true"></i> {n.name}</span>
      )
    }
  };

  renderTreeNode(n: TreeTypes.TreeViewItem<any>) {
    return (
      <SubTreeViewNode
        key={n.key}
        onRenderLabel={this.props.onRenderLabel}
        selected={this.props.selected}
        onclick={this.props.onClick}
        onCollapse={this.props.onCollapse}
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
