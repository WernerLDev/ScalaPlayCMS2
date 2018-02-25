import * as React from 'react';
import * as Api from '../../api/Api'
import { Menu, Segment, Icon } from 'semantic-ui-react'
import * as fbemmiter from 'fbemitter'

export interface TextViewerProps {
  asset: Api.Asset
  emitter: fbemmiter.EventEmitter
}

export interface TextViewerState {
  textContent: string
  loading: boolean
}

class TextViewer extends React.Component<TextViewerProps, TextViewerState> {

  constructor(props: TextViewerProps, context: any) {
    super(props, context);
    this.state = { textContent: "", loading: true }
  }

  componentDidMount() {
    Api.getAssetContentAsText(this.props.asset).then(content => {
      this.setState({ 
        textContent: content, 
        loading: false 
      })
    })
  }

  handleItemClick() {

  }

  render() {
    return (
      <div className="imageviewerback">
        <Segment className="toolbar" inverted>
          <Menu inverted icon="labeled" size="massive">
            <Menu.Item name='properties' active={false} onClick={() => {
              this.props.emitter.emit("assetpropertiesopened", this.props.asset)
            }}>
              <Icon name='setting' />Properties
                        </Menu.Item>
            <Menu.Item position="right" name='deletething' active={false} onClick={this.handleItemClick}>
              <Icon name='trash' />Remove
                        </Menu.Item>
          </Menu>
        </Segment>
        <div className="textcontent">
          {this.state.textContent}
        </div>

      </div>
    );
  }
}

export default TextViewer;
