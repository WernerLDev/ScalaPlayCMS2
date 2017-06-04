import * as React from 'react';
import * as Api from '../../api/Api'
import { Menu, Segment, Icon } from 'semantic-ui-react'

export interface DocumentEditModeProps {
    document:Api.Document
}

class DocumentEditMode extends React.Component<DocumentEditModeProps, any> {
    
    constructor(props:DocumentEditModeProps, context:any) {
        super(props, context);
    }

    handleItemClick() {

    }

    render() {
        return (
        <div id="wrapper">
            <Segment className="toolbar" inverted>
                <Menu inverted icon="labeled" size="massive">
                    <Menu.Item name='properties' active={false} onClick={this.handleItemClick}>
                        <Icon name='setting' />Properties
                    </Menu.Item>
                    <Menu.Item position="right" name='deletething' active={false} onClick={this.handleItemClick}>
                        <Icon name='trash' />Remove
                    </Menu.Item>
                </Menu>
            </Segment>
            <div className="iframe-wrapper">
                <iframe className="documentIframe" onLoad={() => this.setState({iframeloaded: true})} ref="docpage" src={this.props.document.path + "?editmode=editing"} />
            </div>
        </div>
        );
    }
}

export default DocumentEditMode;
