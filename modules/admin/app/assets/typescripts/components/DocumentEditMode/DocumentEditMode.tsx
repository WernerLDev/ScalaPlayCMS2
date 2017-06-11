import * as React from 'react';
import * as Api from '../../api/Api'
import { Menu, Dropdown, Segment, Icon, Dimmer, Loader } from 'semantic-ui-react'
import * as Immutable from 'immutable'

export interface DocumentEditModeProps {
    document:Api.Document
}

export interface DocumentEditModeState {
    iframeloaded : boolean,
    loadtext: "Loading" | "saving"
}

class DocumentEditMode extends React.Component<DocumentEditModeProps, any> {
    
    constructor(props:DocumentEditModeProps, context:any) {
        super(props, context);
        this.state = { iframeloaded: false, loadtext: "loading"  }
    }

    handleItemClick() {

    }

    saveEditables() {
        this.setState({ iframeloaded: false, loadtext: "saving" }, () => {
            let editableValues = (this.refs.docpage as HTMLIFrameElement).contentDocument.getElementsByClassName("editable");
            var editables = Immutable.List<Api.Editable>();
            [].forEach.call(editableValues, function(elem:HTMLElement){
                if(elem.nodeName == "INPUT") {
                    let inputElem = elem as HTMLInputElement;
                    editables = editables.push({ id: 0, document_id: this.props.document.id, name: inputElem.name, value: inputElem.value });
                } else {
                    editables = editables.push({ id: 0, document_id: this.props.document.id, name: elem.id, value: elem.innerHTML });
                }
            }.bind(this));
            Api.saveEditables(this.props.document.id, editables).then(x => {
                setTimeout(() => {
                    this.setState({ iframeloaded: true })
                }, 300);
            })
        });
    }

    render() {
        return (
        <div id="wrapper">
            <Segment className="toolbar" inverted>
                <Menu inverted icon="labeled" size="massive">
                    <Menu.Item name='properties' active={false} onClick={this.handleItemClick}>
                        <Icon name='eye' />Save & Publish
                    </Menu.Item>
                     <Dropdown item icon="eye" text='Display Options'>
                    <Dropdown.Menu>
                        <Dropdown.Header>Text Size</Dropdown.Header>
                        <Dropdown.Item>Small</Dropdown.Item>
                        <Dropdown.Item>Medium</Dropdown.Item>
                        <Dropdown.Item>Large</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item name='properties' active={false} onClick={this.saveEditables.bind(this)}>
                        <Icon name='save' />Save
                    </Menu.Item>

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
                {this.state.iframeloaded == false ? 
                    <Dimmer active inverted>
                        <Loader inverted content={this.state.loadtext} />
                    </Dimmer> 
                    : null 
                }
            </div>
            
        </div>
        );
    }
}

export default DocumentEditMode;
