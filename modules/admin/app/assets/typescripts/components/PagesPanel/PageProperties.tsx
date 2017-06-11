import * as React from 'react';
import { Button, Header, Image, Modal, Menu, Table, Form } from 'semantic-ui-react'
import * as Api from '../../api/Api'
import * as moment from 'moment'

export interface PagePropertiesProps {
    onClose: () => void
    document: Api.Document
}

export interface PagePropertiesState {
    activeItem: string
}

class PageProperties extends React.Component<PagePropertiesProps, any> {

    constructor(props:PagePropertiesProps, context:any) {
        super(props, context);
        this.state = { activeItem: "properties" }
    }

    render() {
        return (
            <Modal style={{minHeight: "500px"}} onClose={this.props.onClose} defaultOpen={true}>
                    <Modal.Header>Properties</Modal.Header>
                    <Modal.Content>
                    <Modal.Description>
                        <Menu pointing secondary>
                            <Menu.Item 
                                name='properties' 
                                active={this.state.activeItem === 'properties'} 
                                onClick={() => this.setState({activeItem: "properties"})} />
                            <Menu.Item 
                                name='metadata' 
                                active={this.state.activeItem === 'metadata'} 
                                onClick={() => this.setState({activeItem: "metadata"})} />
                        </Menu>

                        <div style={{display: this.state.activeItem == "properties" ? "block" : "none"}}>
                        
                            <Table basic='very' striped>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell width="3">#</Table.Cell>
                                        <Table.Cell>{this.props.document.id}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Path</Table.Cell>
                                        <Table.Cell>{this.props.document.path}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Name</Table.Cell>
                                        <Table.Cell>
                                            <Form.Input type='text' width="12" defaultValue={this.props.document.name}  />
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Page type</Table.Cell>
                                        <Table.Cell>{this.props.document.view}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Created at</Table.Cell>
                                        <Table.Cell>{moment(this.props.document.created_at).format("MMMM Do YYYY, HH:MM")}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Last updated at</Table.Cell>
                                        <Table.Cell>{moment(this.props.document.updated_at).format("MMMM Do YYYY, HH:MM")}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Pubilsh date</Table.Cell>
                                        <Table.Cell>{moment(this.props.document.published_at).format("MMMM Do YYYY, HH:MM")}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                                </Table>
                        </div>

                        <div style={{display: this.state.activeItem == "metadata" ? "block" : "none"}}>
                        
                            <Table basic='very' striped>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell width="3">Title</Table.Cell>
                                        <Table.Cell>{this.props.document.title}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Description</Table.Cell>
                                        <Table.Cell>{this.props.document.description}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Language</Table.Cell>
                                        <Table.Cell>{this.props.document.locale}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                                </Table>
                        </div>
                        

                    </Modal.Description>
                    </Modal.Content>
                </Modal>
        );
    }
}

export default PageProperties;
