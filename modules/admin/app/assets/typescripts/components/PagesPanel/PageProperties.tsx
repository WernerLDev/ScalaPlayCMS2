import * as React from 'react';
import { Button, Header, Image, Modal, Menu, Table, Form, Dropdown, Dimmer, Loader, Segment } from 'semantic-ui-react'
import * as Api from '../../api/Api'
import * as moment from 'moment'
import {DatePickerInput} from 'rc-datepicker';

export interface PagePropertiesProps {
    onClose: () => void
    onSaved: (doc:Api.Document) => void
    open: boolean
    document: Api.Document
}

export interface PagePropertiesState {
    activeItem: string
    document: Api.Document,
    pagetypes : Api.PageType[]
    working : boolean
    saving : boolean
}

class PageProperties extends React.Component<PagePropertiesProps, PagePropertiesState> {

    constructor(props:PagePropertiesProps, context:any) {
        super(props, context);
        this.state = { activeItem: "properties", document: props.document, pagetypes: [], working: true, saving: false }
    }

    componentWillMount() {
        Api.getPageTypes().then(pagetypes => {
            Api.getDocument(this.props.document.id).then(document => {
                this.setState({
                    pagetypes: pagetypes,
                    document: document,
                    working: false
                })
            })
        })
    }

    refresh() {
        Api.getDocument(this.props.document.id).then(document => {
            this.setState({
                document: document,
                saving: false
            })
        })
    }

    render() {
        return (
            <Modal  onClose={this.props.onClose} open={this.props.open}>
                    <Modal.Header>Properties</Modal.Header>
                    <Modal.Content style={{minHeight: "500px"}}>
                    <Modal.Description>
                        <Menu tabular>
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
                                        <Table.Cell>{this.state.document.id}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Path</Table.Cell>
                                        <Table.Cell>{this.state.document.path}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Name</Table.Cell>
                                        <Table.Cell>
                                            <Form.Input 
                                                onChange={(e) => {
                                                    this.setState({
                                                        ...this.state, 
                                                        document: {...this.state.document, name: e.currentTarget.value}
                                                    })
                                                }}
                                                fluid type='text' width="12" 
                                                value={this.state.document.name}  />
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Page type</Table.Cell>
                                        <Table.Cell>
                                            <Dropdown 
                                                placeholder='Select pagetype' 
                                                value={this.state.document.view} 
                                                fluid selection 
                                                onChange={(e, {value}) => {
                                                    this.setState({
                                                        ...this.state, 
                                                        document: {...this.state.document, view: value as string}
                                                    })
                                                }}
                                                options={this.state.pagetypes.map(x => {
                                                    return {
                                                        text: x.typename,
                                                        value: x.typekey
                                                    }
                                                })} />
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Publish date</Table.Cell>
                                        <Table.Cell>
                                            <DatePickerInput
                                                style={{background: "none"}}
                                                onChange={(date) => {
                                                     this.setState({
                                                        ...this.state, 
                                                        document: {...this.state.document, published_at: date.getTime()}
                                                    })
                                                }}
                                                value={moment(this.state.document.published_at)}
                                                displayFormat="MMMM Do YYYY, HH:MM"
                                                showOnInputClick
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Created at</Table.Cell>
                                        <Table.Cell>{moment(this.state.document.created_at).format("MMMM Do YYYY, HH:MM")}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Last updated at</Table.Cell>
                                        <Table.Cell>{moment(this.state.document.updated_at).format("MMMM Do YYYY, HH:MM")}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                                </Table>
                        </div>

                        <div style={{display: this.state.activeItem == "metadata" ? "block" : "none"}}>
                        
                            <Table basic='very' striped>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell width="3">Title</Table.Cell>
                                        <Table.Cell>
                                            <Form.Input 
                                                onChange={(e) => {
                                                    this.setState({
                                                        ...this.state, 
                                                        document: {...this.state.document, title: e.currentTarget.value}
                                                    })
                                                }}
                                                fluid type='text' width="12" 
                                                value={this.state.document.title}  />
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Description</Table.Cell>
                                        <Table.Cell>
                                            <Form.Input 
                                                onChange={(e) => {
                                                    this.setState({
                                                        ...this.state, 
                                                        document: {...this.state.document, description: e.currentTarget.value}
                                                    })
                                                }}
                                                fluid type='text' width="12" 
                                                value={this.state.document.description}  />
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Language</Table.Cell>
                                        <Table.Cell>
                                            <Dropdown 
                                                placeholder='Select language' 
                                                value={this.state.document.locale} 
                                                fluid selection search
                                                onChange={(e, {value}) => {
                                                    this.setState({
                                                        ...this.state, 
                                                        document: {...this.state.document, locale: value as string}
                                                    })
                                                }}
                                                options={[
                                                    {
                                                        text: "English",
                                                        value: "en",
                                                        flag: "gb"
                                                    },
                                                    {
                                                        text: "Dutch",
                                                        value: "nl",
                                                        flag: "nl"
                                                    }
                                                ]} />
                                            
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                                </Table>
                        </div>
                        

                    </Modal.Description>
                    </Modal.Content>
                     <Modal.Actions>
                        <Button.Group>
                            <Button color='grey' onClick={this.props.onClose}>
                            Close
                            </Button>
                            <Button.Or />
                            <Button 
                                positive 
                                icon='checkmark' 
                                labelPosition='right' 
                                loading={this.state.saving}
                                onClick={() => {
                                    this.setState({...this.state, saving: true, working: true}, () => {
                                        Api.updateDocument(this.state.document).then(x => {
                                            this.props.onSaved(this.state.document);
                                        });
                                    });
                                }}
                                content="Save & close"  />
                        </Button.Group>
                    </Modal.Actions>
                    {this.state.working ? 
                        <Dimmer active inverted>
                            <Loader size='small'></Loader>
                        </Dimmer>
                    : null}
                </Modal>
        );
    }
}

export default PageProperties;
