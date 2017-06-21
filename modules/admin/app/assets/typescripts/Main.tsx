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
import * as SplitPaneActions from './actions/SplitpaneActions'
import PageProperties from './components/PagesPanel/PageProperties'
import * as Api from './api/Api'
import * as fbemitter from 'fbemitter'

export interface MainProps {
}

type MainState = {
    section : string,
    selected : string,
    emitter : fbemitter.EventEmitter
    pagepropertieDocument : Api.Document
    tabbar: {
        tabs: Immutable.List<Tabs.Tab>
        active: Tabs.Tab
     }
}

/**
 * Entry point for the application. This components renders all the components needed to build up the userinterface
 * 
 * @class Main
 * @extends {React.Component<MainProps, MainState>}
 */
class Main extends React.Component<MainProps, MainState> {
 
    constructor(props:MainProps, context:any) {
        super(props, context);
        let initialTabbar = {
            tabs: Immutable.List<Tabs.Tab>(),
            active: {
                key: "", title: "", content: () => (<p></p>)
            }
        }
        this.state = { section : "pages", selected: "", tabbar: initialTabbar, emitter: new fbemitter.EventEmitter(), pagepropertieDocument: null }
    }

    componentWillMount() {
        this.state.emitter.addListener("pagepropertiesopened", (doc:Api.Document) => {
            console.log("Triggered " + doc.name);
            this.setState({
                ...this.state,
                pagepropertieDocument: doc
            });
        });
    }

    switchSection(s:string) {
        let leftpane = this.refs.leftpane as HTMLElement;
        if(this.state.section == s) SplitPaneActions.hideLeftPanel(leftpane);
        if(this.state.section == "") SplitPaneActions.showLeftPanel(leftpane); 
        this.setState({section: s == this.state.section ? "" : s});
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
                        <SplitPane 
                            split="vertical" 
                            defaultSize={400} 
                            minSize={100}
                            onDragStarted={SplitPaneActions.resizingPanel.bind(this)} 
                            onDragFinished={SplitPaneActions.resizingPanelFinished.bind(this)}>
                            <div ref="leftpane" className="leftpanel">
                                <div className={this.state.section == "pages" ? "show" : "hide"}>
                                    <PagesPanel
                                        onOpenTab={this.openTab.bind(this)}
                                        emitter={this.state.emitter}
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
                                        if(tab.key == this.state.tabbar.active.key) {
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

                    {this.state.pagepropertieDocument != null ? <PageProperties 
                        open={this.state.pagepropertieDocument != null}
                        document={this.state.pagepropertieDocument} 
                        onClose={() => this.setState({...this.state, pagepropertieDocument: null})} />
                    : null }
                </div>
        );
    } 
} 

export default Main;