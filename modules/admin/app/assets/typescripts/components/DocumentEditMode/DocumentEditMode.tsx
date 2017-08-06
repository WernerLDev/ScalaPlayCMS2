import * as React from 'react';
import * as Api from '../../api/Api'
import { Menu, Dropdown, Segment, Icon, Dimmer, Loader, Button } from 'semantic-ui-react'
import * as Immutable from 'immutable'
import * as fbemmiter from 'fbemitter'

export interface DocumentEditModeProps {
    document:Api.Document
    emitter:fbemmiter.EventEmitter
}

export interface DocumentEditModeState {
    iframeloaded : boolean,
    loadtext: "Loading" | "saving"
}

class DocumentEditMode extends React.Component<DocumentEditModeProps, DocumentEditModeState> {
    
    constructor(props:DocumentEditModeProps, context:any) {
        super(props, context);
        this.state = { iframeloaded: false, loadtext: "Loading"  }
    }

    handleItemClick() {

    }

    onDelete() {
        if(confirm(`Are you sure you want to remove document '${this.props.document.name}'?`)) {
            this.setState({ iframeloaded: false, loadtext: "saving" }, () => {
                Api.deleteDocument(this.props.document).then(x => {
                    this.props.emitter.emit("documentRemoved", this.props.document);
                });
            })
        }
    }

    onProperties() {
        this.props.emitter.emit("pagepropertiesopened", this.props.document);
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
        const options = [
            { key: 'edit', icon: 'edit', text: 'Edit Post', value: 'edit' },
            { key: 'delete', icon: 'delete', text: 'Remove Post', value: 'delete' },
            { key: 'hide', icon: 'hide', text: 'Hide Post', value: 'hide' },
        ]

        return (
        <div id="wrapper">
            <Segment inverted className="toolbar">
                <Menu inverted icon="labeled" size="massive">
                    <Menu.Item name='properties' active={false} onClick={this.handleItemClick}>
                        <Icon name='eye' />Save & Publish
                    </Menu.Item>
                    {/* <Button.Group>
                        <Button>Save</Button>
                        <Dropdown options={options} floating button className='icon' />
                    </Button.Group> */}
                    <Menu.Item name='properties' active={false} onClick={this.saveEditables.bind(this)}>
                        <Icon name='save' />Save
                    </Menu.Item>

                    <Menu.Item name='properties' active={false} onClick={this.onProperties.bind(this)}>
                        <Icon name='setting' />Properties
                    </Menu.Item>
                    <Menu.Item name='properties' active={false} onClick={this.onProperties.bind(this)}>
                        <Icon name='refresh' />Refresh
                    </Menu.Item>
                    <Menu.Item position="right" name='deletething' active={false} onClick={this.onDelete.bind(this)}>
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
