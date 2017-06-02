import * as React from 'react';
import { Menu, Table, Segment, Icon } from 'semantic-ui-react'
import Loading from './components/common/Loading'
import TabPanel from './components/TabPanel/TabPanel'

type tabname = { name:string }

export default class LargeView extends React.Component<any, any> {
  
    constructor(props:void, context:void) {
        super(props, context);
        this.state = { activeItem: "bio" }
    }


    handleItemClick(e:MouseEvent, t:tabname) {
        this.setState({ activeItem: t.name });
    }

    public render() {
        let activeItem = this.state.activeItem;
        return (
            <div>
              
              <Segment className="toolbar" inverted>
                <Menu inverted icon="labeled" size="massive">
                  <Menu.Item name='home' active={false} onClick={this.handleItemClick.bind(this)}>
                      <Icon name='unhide' />Save & publish
                  </Menu.Item>
                  <Menu.Item name='Save' active={false} onClick={this.handleItemClick.bind(this)}>
                      <Icon name='save' />Save
                  </Menu.Item>
                  <Menu.Item name='properties' active={false} onClick={this.handleItemClick.bind(this)}>
                      <Icon name='setting' />Properties
                  </Menu.Item>
                  <Menu.Item name='delete' position="right" active={false} onClick={this.handleItemClick.bind(this)}>
                      <Icon name='trash' />Remove
                  </Menu.Item>
                </Menu>
              </Segment>

              

            
            </div>
        );
    }

}