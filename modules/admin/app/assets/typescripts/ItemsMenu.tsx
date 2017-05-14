import * as React from 'react';
import { Nav } from 'office-ui-fabric-react/lib/Nav';

type ItemsMenuState = {
    selected : string
}

export default class ItemsMenu extends React.Component<any, ItemsMenuState> {
  
  constructor(props:void, context:void) {
      super(props, context);
      this.state = { selected: "test" }
  }

  selectItem(item:string) {
      //this.setState({ selected: item })
      //return false;
  }
  
  onClick(e:React.MouseEvent<HTMLElement>) {
  }

  public render() {
    return (
      <Nav
        onLinkClick={ (e:React.MouseEvent<HTMLElement>) => e.preventDefault() }
        groups={ [{
          links: [
            {
              name: 'Home', url: "", key: "test", icon: "Edit", links: [
                { name: 'Some child', key: "key1",  icon: "Page",  url: '' },
                {
                  name: 'Child link', key: 'key2', icon: "Page", url: '', links: [
                    { name: 'Child of child link', key: 'key3',  url: '' },
                    { name: 'Child of child link', key: 'key4', url: '' }
                  ]
                },
                { name: 'Child link', key: 'key5', url: '' }
              ]
            },
            {
              name: 'Parent link', key: 'key6', url: '', links: [
                { name: 'Child link', key: 'key7', url: '' },
              ]
            }
          ]
        }] }
      />
    );
  }
}