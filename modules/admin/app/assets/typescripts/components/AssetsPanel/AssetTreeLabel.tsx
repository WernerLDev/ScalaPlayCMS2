import * as React from 'react';
import * as Tree from '../TreeView/TreeViewTypes'
import * as Api from '../../api/Api'

export interface AssetTreeLabelProps {
    item: Tree.TreeViewItem<Api.Asset>,
    onContextTriggered: (n:Tree.TreeViewItem<Api.Asset>) => void
}

class AssetTreeLabel extends React.Component<AssetTreeLabelProps, any> {

    constructor(props:AssetTreeLabelProps, context:any) {
        super(props, context);
        this.state = {
            contextMenuVisible: false, menutarget:MouseEvent
        }
    }

    toggleContextMenu(e:React.MouseEvent<HTMLElement>) {
        this.props.onContextTriggered(this.props.item);
        e.persist();
        e.preventDefault();
        this.setState({
            contextMenuVisible: true, menutarget: e
        })
    }

    renderContextMenu():JSX.Element {
      return null;
    }

    render() {
        let icon = this.props.item.item.mimetype == "home" ? "home" : "file-image-o";
        if(this.props.item.item.mimetype == "folder") {
            icon = "folder";
        }
        return(
            <div onContextMenu={this.toggleContextMenu.bind(this)}>
                <i className={"fa fa-"+icon+" fileicon"} aria-hidden="true"></i> {this.props.item.item.label}
                {this.state.contextMenuVisible ? this.renderContextMenu() : null}    
            </div>
        )
    }

    _onDismiss() {
        this.setState({ contextMenuVisible: false })
    }

    _onToggleSelect() {
        return true;
    }

}

export default AssetTreeLabel;