import * as React from 'react';
import * as Api from '../../api/Api'
import { Menu, Segment, Icon } from 'semantic-ui-react'
import * as fbemmiter from 'fbemitter'

export interface ImageViewerProps {
  asset: Api.Asset
  emitter: fbemmiter.EventEmitter
}

export const ImageViewer = (props: ImageViewerProps) => {

  let handleItemClick = () => {
    alert("asdfasdf");
  }

  let onDelete = () => {
    if (confirm("Are you sure?")) {
      Api.deleteAsset(props.asset).then(x => {
        props.emitter.emit("assetRemoved", props.asset);
      })
    }
  }

  return (
    <div className="imageviewerback">
      <Segment className="toolbar" inverted>
        <Menu inverted icon="labeled" size="massive">
          <Menu.Item name='properties' active={false} onClick={() => {
            props.emitter.emit("assetpropertiesopened", props.asset)
          }}>
            <Icon name='setting' />Properties
                    </Menu.Item>
          <Menu.Item name='Download' active={false} onClick={() => { }}>
            <Icon name='download' />Download
                    </Menu.Item>
          <Menu.Item position="right" name='deletething' active={false} onClick={() => onDelete()}>
            <Icon name='trash' />Remove
                    </Menu.Item>
        </Menu>
      </Segment>
      <div className="imageviewer">
        <img src={"/admin/uploads" + props.asset.path} />
      </div>
    </div>
  )
}


