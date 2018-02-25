import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'
import { Dropdown, Icon, Menu, Segment } from 'semantic-ui-react'
import ContextMenu from '../common/ContextMenu'

export interface PageTreeContextMenuProps {
  onDismiss: () => void
  onToggleEdit: () => void
  onToggleAdd: (type: string) => void
  onToggleDelete: () => void
  onProperties: () => void
  target: MouseEvent
  pagetypes: Api.PageType[]
  isRootNode: boolean
}

class PageTreeContextMenu extends React.Component<PageTreeContextMenuProps, any> {

  constructor(props: PageTreeContextMenuProps, context: any) {
    super(props, context);
  }

  private handleItemClick() {

  }

  render() {
    let target = {
      x: this.props.target.clientX,
      y: this.props.target.clientY
    }

    let newtypes = this.props.pagetypes.map(x => {
      return {
        key: x.typekey,
        label: x.typename,
        onClick: () => this.props.onToggleAdd(x.typekey),
        children: []
      }
    });
    return (
      <ContextMenu
        target={target}
        items={[
          {
            icon: "plus",
            label: "Create New...",
            onClick: this.handleItemClick.bind(this),
            children: newtypes
          },
          {
            icon: "write",
            label: "Rename",
            onClick: this.props.onToggleEdit,
            children: [],
            disabled: this.props.isRootNode
          },
          {
            icon: "trash",
            label: "Remove",
            onClick: this.props.onToggleDelete,
            children: [],
            disabled: this.props.isRootNode
          },
          {
            label: "Properties",
            onClick: this.props.onProperties,
            children: []
          }
        ]}
        onDismiss={this.props.onDismiss}
      />
    )
  }
}

export default PageTreeContextMenu;
