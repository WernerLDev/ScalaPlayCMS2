import * as React from 'react';
import { Dropdown, Icon, Menu, Segment } from 'semantic-ui-react'

export interface ContextMenuItem {
    icon?:string
    label:string
    children: ContextMenuItem[]
    onClick:() => void
}

export interface IPoint {
    x:number
    y:number
}

export interface ContextMenuProps {
    onDismiss: () => void,
    target: IPoint,
    items: ContextMenuItem[]
}

class ContextMenu extends React.Component<ContextMenuProps, any> {

    constructor(props:ContextMenuProps, context:any) {
        super(props, context);
    }
    
    mouseDown = this.onDismiss.bind(this)

    componentDidMount() {
        document.addEventListener('mousedown', this.mouseDown);
    }

    onDismiss(e:MouseEvent) {
        let menu = this.refs.contextmenu as HTMLElement;
        if(!menu.contains(e.target as HTMLElement)) {
            document.removeEventListener('mousedown', this.mouseDown);
            this.props.onDismiss();
        }
    }

    renderMenuItem(item:ContextMenuItem) {
        const itemClicked = () => {
            this.props.onDismiss();
            item.onClick();
        }
        return(
             <Menu.Item name={item.label} icon={item.icon} active={false} onClick={itemClicked} />
        )
    }

    renderSubMenuItem(item:ContextMenuItem) {
        return(
            <Dropdown item text={item.label}>
                <Dropdown.Menu>
                    {item.children.map(x => <Dropdown.Item icon={x.icon} text={x.label} />)}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    renderItems(item:ContextMenuItem) {
        if(item.children.length > 0) return this.renderSubMenuItem(item);
        else return this.renderMenuItem(item); 
    }

    render() {
        let top = this.props.target.y + "px";
        let left = this.props.target.x + "px";

        return (
            <div className="contextmenu" ref="contextmenu" style={{ position: 'fixed', top: top, left: left, zIndex: 999 }}>
                <Menu compact pointing vertical>
                    {this.props.items.map(x => this.renderItems(x))}
                </Menu>
            </div>
        );
    }
}

export default ContextMenu;
