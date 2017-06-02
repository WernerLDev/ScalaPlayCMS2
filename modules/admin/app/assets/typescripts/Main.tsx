import * as React from 'react'
import * as SplitPane from 'react-split-pane'
import LargeView from './LargeView'
import {SideMenu, SideMenuItem} from './components/SideMenu/SideMenu'
import TreeView from './components/TreeView/TreeView'
import PagesPanel from './components/PagesPanel/PagesPanel'
import AssetsPanel from './components/AssetsPanel/AssetsPanel'
import * as Tabs from './components/TabPanel/TabPanel'
import * as TabActions from './components/TabPanel/TabActions'
import * as Immutable from 'immutable'

export interface MainProps {
}

type MainState = {
    section : string,
    selected : string
    tabbar: {
        tabs: Immutable.List<Tabs.Tab>
        active: Tabs.Tab
     }
}

class Main extends React.Component<MainProps, MainState> {
 
    constructor(props:MainProps, context:any) {
        super(props, context);
        let initialTabbar = {
            tabs: TabActions.getInitialState(),
            active: {
                key: "", title: "", content: () => (<p></p>)
            }
        }
        this.state = { section : "pages", selected: "", tabbar: initialTabbar }
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

    openTab(t:Tabs.Tab) {
        let newTabs = this.state.tabbar.tabs;
        
        if(newTabs.find(x => x.key == t.key) == null) {
            newTabs = newTabs.push(t);
        }
        this.setState({
            ...this.state,
            tabbar: {
                active: t,
                tabs: newTabs
            }
        })
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
                                    <PagesPanel
                                        onOpenTab={this.openTab.bind(this)}
                                     />
                                </div>
                                <div className={this.state.section == "assets" ? "show" : "hide"}>
                                    <AssetsPanel
                                        onOpenTab={this.openTab.bind(this)}
                                     />
                                </div>
                            </div>
                            <div>
                                <Tabs.default 
                                    active={this.state.tabbar.active}
                                    tabs={this.state.tabbar.tabs}
                                    onClose={(tab:Tabs.Tab) => {
                                        var newtabs = this.state.tabbar.tabs.filter(x => x != tab);
                                        var newactive = this.state.tabbar.active;
                                        if(tab == this.state.tabbar.active) {
                                            newactive = TabActions.findNewActive(tab, this.state.tabbar.tabs);
                                        }
                                        this.setState({ ...this.state, tabbar: { tabs: newtabs.toList(), active: newactive} })
                                    }}
                                    onSwitch={(t:Tabs.Tab) => {
                                        this.setState({ 
                                             ...this.state, 
                                             tabbar: {
                                                 ...this.state.tabbar, 
                                                 active: t
                                             }  
                                        })
                                    }}
                                />
                            </div>
                        </SplitPane>
                    </div>
                </div>
        );
    } 
} 

export default Main;