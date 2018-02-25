import * as React from 'react';
import { Menu, Table, Segment, Icon } from 'semantic-ui-react'
import Loading from '../common/Loading'
import * as TabsAction from './TabActions'
import * as Immutable from 'immutable'

export interface Tab {
  key: string,
  title: string,
  content: () => JSX.Element,
  unsavedContent?: boolean
}

export interface TabPanelProps {
  tabs: Immutable.List<Tab>
  active: Tab
  onClose: (tab: Tab) => void
  onSwitch: (tab: Tab) => void
}

export interface TabbarState {
  tabs: Immutable.List<Tab>
  active: Tab
}

class TabPanel extends React.Component<TabPanelProps, any> {

  constructor(props: TabPanelProps, context: any) {
    super(props, context);
  }

  render() {
    const tabContent = (t: Tab) => {
      let isActive = t.key == this.props.active.key;
      return (
        <div key={t.key} style={{ display: isActive ? "block" : "none" }}>
          {t.content()}
        </div>
      )
    }

    const tabLabel = (t: Tab) => {
      return (
        <p>
          {t.title + (t.unsavedContent ? "*" : "")} <i className="fa fa-window-close" aria-hidden="true"></i>
        </p>
      )
    }

    return (
      <div>
        <Menu className="tabbar" tabular>
          {this.props.tabs.map(tab =>
            <Menu.Item
              key={tab.key}
              content={tabLabel(tab)}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                let target = e.target as HTMLElement;
                if (target.classList.contains("fa-window-close")) {
                  this.props.onClose(tab);
                } else {
                  this.props.onSwitch(tab);
                }
              }}
              name={tab.title}
              active={tab.key == this.props.active.key} />)}
        </Menu>

        {this.props.tabs.map(tab => tabContent(tab))}
      </div>
    );
  }
}

export default TabPanel;
