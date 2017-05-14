import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { Label } from 'office-ui-fabric-react/lib/Label';
import {
  Pivot,
  PivotItem,
  PivotLinkSize
} from 'office-ui-fabric-react/lib/Pivot';

export default class LargeView extends React.Component<any, any> {
  
  constructor(props:void, context:void) {
      super(props, context);
  }

  itemsNonFocusable = [
      { key: "new", name: "New", iconProps: { iconName: "add" }  }
  ]

  farItemsNonFocusable = [
      { key: "test", name: "Test", iconProps: { iconName: "add" } }
  ]

  public render() {
    return (
      <div>
        <Pivot linkSize={ PivotLinkSize.large }>
          <PivotItem linkText='My Files'>
            <Label>Pivot #1</Label>
          </PivotItem>
          <PivotItem linkText='Recent'>
            <Label>Pivot #2</Label>
          </PivotItem>
          <PivotItem linkText='Shared with me'>
            <Label>Pivot #3</Label>
          </PivotItem>
        </Pivot>
        <CommandBar
          isSearchBoxVisible={ false }
          items={ this.itemsNonFocusable }
          farItems={ this.farItemsNonFocusable }
        />
      </div>
    );
  }

}