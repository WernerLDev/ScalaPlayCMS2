import * as React from 'react';
import { Button, Header, Image, Modal, Menu, Table, Form, Dropdown, Dimmer, Loader, Segment } from 'semantic-ui-react'
import * as Api from '../../api/Api'
import * as moment from 'moment'
import {DatePickerInput} from 'rc-datepicker';

export interface AssetPropertiesProps {
    onClose: () => void
    onSaved: (doc:Api.Asset) => void
    open: boolean
    asset: Api.Asset
}

export interface AssetPropertiessState {
    activeItem: string
    asset: Api.Asset
    saving : boolean
}

class AssetProperties extends React.Component<AssetPropertiesProps, AssetPropertiessState> {

    constructor(props:AssetPropertiesProps, context:any) {
        super(props, context);
        this.state = { activeItem: "properties", asset: props.asset, saving: false }
        console.log(this.props.asset);
    }

    refresh() {
        Api.getAsset(this.props.asset.id).then(document => {
            this.setState({
                asset: document,
                saving: false
            })
        })
    }

    render() {
        return (
            <Modal  onClose={this.props.onClose} open={this.props.open}>
                    <Modal.Header>Properties</Modal.Header>
                    <Modal.Content>
                    <Modal.Description>
                        <div>
                        
                            <Table basic='very' striped>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell width="3">#</Table.Cell>
                                        <Table.Cell>{this.state.asset.id}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Path</Table.Cell>
                                        <Table.Cell>{this.state.asset.path}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Server path</Table.Cell>
                                        <Table.Cell>{this.state.asset.server_path}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Name</Table.Cell>
                                        <Table.Cell>
                                            <Form.Input 
                                                onChange={(e) => {
                                                    this.setState({
                                                        ...this.state, 
                                                        asset: {...this.state.asset, name: e.currentTarget.value}
                                                    })
                                                }}
                                                fluid type='text' width="12" 
                                                value={this.state.asset.name}  />
                                        </Table.Cell>
                                    </Table.Row>
                                   
                                    <Table.Row>
                                        <Table.Cell>Filesize</Table.Cell>
                                        <Table.Cell>{(this.state.asset.filesize / 1000).toFixed(1) + " kB"}</Table.Cell>
                                    </Table.Row>
                                     <Table.Row>
                                        <Table.Cell>Mimetype</Table.Cell>
                                        <Table.Cell>{this.state.asset.mimetype}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Created at</Table.Cell>
                                        <Table.Cell>{moment(this.state.asset.created_at).format("MMMM Do YYYY, HH:MM")}</Table.Cell>
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
                                    this.setState({...this.state, saving: true}, () => {
                                        Api.updateAsset(this.state.asset).then(x => {
                                            this.props.onSaved(this.state.asset);
                                        });
                                    });
                                }}
                                content="Save & close"  />
                        </Button.Group>
                    </Modal.Actions>
                </Modal>
        );
    }
}

export default AssetProperties;
