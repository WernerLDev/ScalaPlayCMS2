import * as React from 'react'
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as SplitPane from 'react-split-pane'
import LargeView from './LargeView'
import {SideMenu, SideMenuItem} from './components/SideMenu/SideMenu'
import TreeView from './components/TreeView/TreeView'
import ItemsMenu from './ItemsMenu'
import TestTreeViewNode from './TestTreeViewNode'
import { css } from 'office-ui-fabric-react/lib/Utilities';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import PagesPanel from './components/PagesPanel/PagesPanel'
import AssetsPanel from './components/AssetsPanel/AssetsPanel'

export interface MainProps {
}

type MainState = {
    section : string,
    selected : string
}

class Main extends React.Component<MainProps, MainState> {
 
    constructor(props:MainProps, context:any) {
        super(props, context);
        this.state = { section : "pages", selected: "" }
    }

    itemsNonFocusable = [
        { key: "new", name: "New", iconProps: { iconName: "add" }  }
    ]

    farItemsNonFocusable = [
        { key: "test", name: "Test", iconProps: { iconName: "add" } }
    ]

    switchSection(s:string) {
        this.setState({ section: s });
    }

    render() {
        return (
                <div>
                    <SideMenu>
                        <SideMenuItem 
                            active={this.state.section == "home"} icon="home" 
                            onClick={() => this.switchSection("home")} >DashBoard</SideMenuItem>
                        <SideMenuItem 
                            active={this.state.section == "pages"} icon="files-o" 
                            onClick={() => this.switchSection("pages")} >Pages</SideMenuItem>
                        <SideMenuItem 
                            active={this.state.section == "entities"} icon="cubes"
                            onClick={() => this.switchSection("entities")} >Entities</SideMenuItem>
                        <SideMenuItem 
                            active={this.state.section == "assets"} icon="picture-o"
                            onClick={() => this.switchSection("assets")} >Assets</SideMenuItem>
                        <SideMenuItem
                            active={this.state.section == "settings"} icon="gears" 
                            onClick={() => this.switchSection("settings")} >Settings</SideMenuItem>
                    </SideMenu>
                    <div className="splitpane-container">
                        <SplitPane split="vertical" defaultSize={400} minSize={100}>
                            <div className="leftpanel">
                                <div className={this.state.section == "pages" ? "show" : "hide"}>
                                    <CommandBar
                                    isSearchBoxVisible={ false }
                                    items={ this.itemsNonFocusable }
                                    farItems={ this.farItemsNonFocusable }
                                    />
                                    <PagesPanel />
                                </div>
                                <div className={this.state.section == "assets" ? "show" : "hide"}>
                                    <AssetsPanel />
                                </div>
                            </div>
                            <div>
                                <LargeView />
                            </div>
                        </SplitPane>
                    </div>
                </div>
        );
    } 
} 

export default Main;

/*
<TreeView items={[
                                    { key: "home", name: "Home", children: [
                                        { key: "testchild", name: "Testchild", children: [
                                            { key: "blaat", name: "Blaat", children: [] }
                                        ] },
                                        { key: "testchild2", name: "Testchild 2", children: [] }
                                    ]},
                                    { key: "assets", name: "Assets", children: [
                                        { key: "asset1", name: "Some asset", children: [] }
                                    ]}
                                ]} onClick={(n) => this.setState({selected: n.key})}
                                onRenderLabel={(n) => <TestTreeViewNode onContextTriggered={(n) => this.setState({ selected: n.key  })} item={n} /> }
                                 />*/