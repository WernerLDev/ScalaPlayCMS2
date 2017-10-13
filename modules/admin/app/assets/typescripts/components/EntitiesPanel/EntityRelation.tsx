import * as React from 'react';
import * as Api from '../../api/Api'
import { DropdownInput, multipleSelect } from '../../MonadForms/SimpleFormElements' 
import { Segment, Icon, Dimmer, Loader, Button, List, Header } from 'semantic-ui-react'

export interface EntityRelationProps {
    relationname:string,
    relation:string,
    entityid:number
}

export interface EntityRelationState {
    entities:{value:string, text:string}[]
    relations:string[]
    loading:boolean
}



export default class EntityDropdownComp extends React.Component<EntityRelationProps, EntityRelationState> {
    
    constructor(props:EntityRelationProps, context:any) {
        super(props, context);
        this.state = { entities: [], relations: [],loading: true }   
    }

    componentWillMount() {
        Api.getRelations(this.props.relationname, this.props.entityid).then(relations => {
            Api.getEntitiesByType(this.props.relation).then(entities => {
                this.setState({
                    ...this.state, 
                    entities: entities.map(x => {
                        return {
                            value: x.id.toString(),
                            text: x.name
                        }
                    }),
                    relations: relations.map(x => x.target_id.toString()),
                    loading: false
                })
            })
        })
    }

    renderSingleRelation(relation:string) {
        return (
            <List.Item key={relation}>
                <List.Content floated='right'>
                    <Button size="mini">Unlink</Button>
                </List.Content>
                
                <List.Content verticalAlign="middle">
                    {this.state.entities.filter(x => x.value == relation)[0].text}
                </List.Content>
            </List.Item>
        )
    }

    render() {
        return (
            <Segment color="green" loading={this.state.loading}>
                <Header as="h5">{this.props.relation}</Header>
                {/* <List divided verticalAlign='middle'>
                    {this.state.relations.map(x => this.renderSingleRelation(x))}
                    
                </List> */}

                <div>

                
                {multipleSelect(this.state.entities)(
                    this.props.relation,
                    this.state.relations,
                    (v) => this.setState({...this.state, relations: v})
                )}
                </div>
            </Segment>
        )
    }

}
