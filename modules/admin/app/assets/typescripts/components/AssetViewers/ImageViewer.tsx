import * as React from 'react';
import * as Api from '../../api/Api'
import { Menu, Segment, Icon } from 'semantic-ui-react'
import * as fbemmiter from 'fbemitter'

export interface ImageViewerProps {
    asset : Api.Asset
    emitter : fbemmiter.EventEmitter
}

export const ImageViewer = (props:ImageViewerProps) => {
    
    let handleItemClick = () => {
        alert("asdfasdf");
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
                    <Menu.Item position="right" name='deletething' active={false} onClick={handleItemClick}>
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


