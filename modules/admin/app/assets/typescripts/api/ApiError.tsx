import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Header, Image, Modal, Menu, Table } from 'semantic-ui-react'


export interface ApiErrorViewProps {
    info : ApiErrorInfo
    onClose : () => void
}

class ApiErrorView extends React.Component<ApiErrorViewProps, any> {

    constructor(props:ApiErrorViewProps, context:any) {
        super(props, context);
        this.state = { activeItem: "response" }
    }

    render() {
        let activeItem = this.state.activeItem;
        return (
             <Modal style={{minHeight: "500px"}} onClose={this.props.onClose} defaultOpen={true}>
                <Modal.Header>Error {this.props.info.errorCode + ": " + this.props.info.statusText}</Modal.Header>
                <Modal.Content>
                <Modal.Description>
                    <Menu pointing secondary>
                        <Menu.Item name='response' active={activeItem === 'response'} onClick={() => this.setState({activeItem: "response"})} />
                        <Menu.Item name='info' active={activeItem === 'info'} onClick={() => this.setState({activeItem: "info"})} />
                    </Menu>

                    <div style={{display: activeItem == "info" ? "block" : "none"}}>
                    
                        <Table basic='very'>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>Request method</Table.Cell>
                                    <Table.Cell>{this.props.info.method}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>URL</Table.Cell>
                                    <Table.Cell>{this.props.info.url}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Params</Table.Cell>
                                    <Table.Cell>{this.props.info.params}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                            </Table>
                     </div>

                     <iframe style={{display: activeItem == "response" ? "block" : "none"}} width="100%" height="342" src={"data:text/html;charset=utf-8," + encodeURI(this.props.info.responseBody)} />
                </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}


export interface ApiErrorInfo {
    errorCode : number,
    url : string,
    method : string,
    statusText : string,
    responseBody : string,
    params : string
}

export default function ApiError(info:ApiErrorInfo) {
    let onClose = function() {
        document.getElementById("errordiv").innerHTML = "";
    }
    ReactDOM.render(
        <ApiErrorView info={info} onClose={onClose} />,
        document.getElementById('errordiv')
    );
}