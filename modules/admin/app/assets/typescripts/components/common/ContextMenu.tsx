import * as React from 'react';
import { Dropdown, Icon, Menu, Segment } from 'semantic-ui-react'

export interface ContextMenuItem {
    icon?:string
    label:string
    children: ContextMenuItem[]
    onClick:() => void
    disabled? : boolean
}

export interface IPoint {
    x:number
    y:number
}

export interface ContextMenuProps {
    onDismiss: (callback?:() => void) => void,
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

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.mouseDown);
    }

    onDismiss(e:MouseEvent) {
        let menu = this.refs.contextmenu as HTMLElement;
        if(menu != undefined && !menu.contains(e.target as HTMLElement)) {
            this.props.onDismiss();
        }
    }

    renderMenuItem(item:ContextMenuItem) {
        const itemClicked = () => {
            this.props.onDismiss(() => {
                item.onClick();
            })
        }
        return(
             <Menu.Item key={item.label} disabled={item.disabled ? item.disabled : false} name={item.label} icon={item.icon} active={false} onClick={itemClicked} />
        )
    }

    renderSubMenuItem(item:ContextMenuItem) {
        return(
            <Dropdown key={item.label} item text={item.label}>
                <Dropdown.Menu>
                    {item.children.map(x => {
                       const itemClicked = () => {
                            this.props.onDismiss();
                            x.onClick();
                        }
                        return(<Dropdown.Item key={x.label} disabled={item.disabled ? item.disabled : false} icon={x.icon} text={x.label} onClick={itemClicked}  />)
                    })}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    renderItem(item:ContextMenuItem) {
        if(item.children.length > 0) return this.renderSubMenuItem(item);
        else return this.renderMenuItem(item); 
    }

    render() {
        let top = this.props.target.y + "px";
        let left = this.props.target.x + "px";

        return (
            <div className="contextmenu" ref="contextmenu" style={{ position: 'fixed', top: top, left: left, zIndex: 999 }}>
                <Menu compact pointing vertical>
                    {this.props.items.map(x => this.renderItem(x))}
                </Menu>
            </div>
        );
    }
}

export default ContextMenu;
