import * as React from 'react';





type SideMenuItemProps = {
    active : boolean,
    icon : string,
    onClick : () => void
    children?:any
}

export function SideMenuItem(props:SideMenuItemProps) {
    return(
        <li className={props.active ? "active" : ""} onClick={props.onClick}>
            <i className={"fa fa-" + props.icon} aria-hidden="true"></i>
            <p>{props.children}</p>
        </li>

    )
}


type SideMenuProps = {
    children?:any
}

export class SideMenu extends React.Component<any, any> {

    constructor(props:SideMenuProps, context:any) {
        super(props, context);
    }

    render() {
        return(
            <div className="menuleft">
                <ul>
                    {this.props.children}
                    <li className="signoutbtn">
                        <a href="/admin/logout">
                        <i className="fa fa-sign-out" aria-hidden="true"></i>
                        <p>Logout</p>
                        </a>
                    </li>
                </ul>
            </div>
        )
    }

}