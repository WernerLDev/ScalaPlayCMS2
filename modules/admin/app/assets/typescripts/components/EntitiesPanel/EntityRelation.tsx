import * as React from 'react';
import * as Api from '../../api/Api'
import { DropdownInput } from '../../MonadForms/SimpleFormElements' 
import { Segment, Icon, Dimmer, Loader, Button, List } from 'semantic-ui-react'

export interface EntityRelationProps {
    relationname:string,
    relation:string,
    entityid:number
}

export interface EntityRelationState {
    entities:{value:number, text:string}[]
    relations:number[]
    loading:boolean
}



export default class EntityDropdownComp extends React.Component<EntityRelationProps, EntityRelationState> {
    
    constructor(props:EntityRelationProps, context:any) {
        super(props, context);
        this.state = { entities: [], relations: [], loading: true }   
    }

    componentWillMount() {
        Api.getRelations(this.props.relationname, this.props.entityid).then(relations => {
            Api.getEntitiesByType(this.props.relation).then(entities => {
                this.setState({
                    ...this.state, 
                    entities: entities.map(x => {
                        return {
                            value: x.id,
                            text: x.name
                        }
                    }),
                    relations: relations.map(x => x.target_id),
                    loading: false
                })
            })
        })
    }

    renderSingleRelation(relation:number) {
        return (
            <List.Item key={relation}>
                <List.Content floated='right'>
                    <Button size="mini">Unlink</Button>
                </List.Content>
                
                <List.Content verticalAlign="middle">
                    {this.state.entities.filter(x => x.value == relation)[0]}
                </List.Content>
            </List.Item>
        )
    }

    render() {
        return (
            <Segment color="green" loading={this.state.loading}>
                <h3>{this.props.relation}</h3>
                <List divided verticalAlign='middle'>
                    {this.state.relations.map(x => this.renderSingleRelation(x))}
                    
                </List>
            </Segment>
        )
    }

}
