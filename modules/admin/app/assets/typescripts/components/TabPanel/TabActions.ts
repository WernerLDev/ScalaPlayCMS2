import * as Tabs from './TabPanel'
import * as Immutable from 'immutable'

export function getInitialState():Immutable.List<Tabs.Tab> {
    return Immutable.List<Tabs.Tab>([
        {
            key: "test",
            title: "asdfasdfasdf",
            content: () => ("test")
        },
        {
            key: "test2",
            title: "test",
            content: () => ("testsdfsdf")
        },
        {
            key: "test3",
            title: "badfadsfasdf",
            content: () => ("testsdfsdfsdfsdfsdf")
        }
    ])
}

export function findNewActive(tab:Tabs.Tab, alltabs:Immutable.List<Tabs.Tab>) {
    let i = alltabs.findIndex(x => x.key == tab.key);
    if(alltabs.get(i+1) != undefined) return alltabs.get(i + 1)
    else if(alltabs.get(i - 1) != undefined) return alltabs.get(i - 1)
    else tab;
}