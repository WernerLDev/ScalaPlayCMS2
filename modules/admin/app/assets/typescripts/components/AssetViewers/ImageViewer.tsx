import * as React from 'react';
import * as Api from '../../api/Api'
import { Menu, Segment, Icon } from 'semantic-ui-react'

export interface ImageViewerProps {
    asset : Api.Asset
}

export const ImageViewer = (props:ImageViewerProps) => {
    
    let handleItemClick = () => {

    }

    return (
        <div className="imageviewerback">
            <Segment className="toolbar" inverted>
                <Menu inverted icon="labeled" size="massive">
                    <Menu.Item name='properties' active={false} onClick={handleItemClick}>
                        <Icon name='setting' />Properties
                    </Menu.Item>
                    <Menu.Item name='delete' position="right" active={false} onClick={this.handleItemClick}>
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

/*class ImageViewer extends React.Component<ImageViewerProps, any> {

    constructor(props:ImageViewerProps, context:any) {
        super(props, context);
    }

    render() {
        return (
        <div>
            
        </div>
        );
    }
}

export default ImageViewer;*/
