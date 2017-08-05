import * as Tabs from './TabPanel'
import * as Immutable from 'immutable'


/**
 * Determines the new active tab after the currently active tab is closed.
 * Could be the tab to the right if it exists, or the tab to the left.
 * 
 * @export
 * @param {Tabs.Tab} tab The tab the user closed
 * @param {Immutable.List<Tabs.Tab>} alltabs  All open tabs
 * @returns {Tabs.Tab}
 */
export function findNewActive(tab:Tabs.Tab, alltabs:Immutable.List<Tabs.Tab>):Tabs.Tab {
    let i = alltabs.findIndex(x => x.key == tab.key);
    if(alltabs.get(i+1) != undefined) return alltabs.get(i + 1)
    else if(alltabs.get(i - 1) != undefined) return alltabs.get(i - 1)
    else tab;
}

export function tabRenamed(id:string, newlabel:string, alltabs:Immutable.List<Tabs.Tab>) {
    return alltabs.map(tab => {
        if(tab.key == id) {
            return {
                key: tab.key,
                title: newlabel,
                content: tab.content
            }
        }
        return tab;
    }).toList()
}

export function tabRemoved(id:string, tabbar:Tabs.TabbarState) {

    if(tabbar.active.key == id) {
        let newActive = findNewActive(tabbar.active, tabbar.tabs);
        return {
            active: newActive,
            tabs: tabbar.tabs.filter(x => x.key != id).toList()
        }
    } else {
        return {
            active: tabbar.active,
            tabs: tabbar.tabs.filter(x => x.key != id).toList()
        }
    }

}