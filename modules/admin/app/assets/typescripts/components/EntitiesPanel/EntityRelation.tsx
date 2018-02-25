import * as React from 'react';
import * as Api from '../../api/Api'
import { DropdownInput, multipleSelectInput } from '../../MonadForms/SimpleFormElements'
import { Segment, Icon, Dimmer, Loader, Button, List, Header } from 'semantic-ui-react'
import * as Immutable from 'immutable'


export interface EntityRelationProps {
  relationname: string,
  relation: string,
  isUnique: boolean,
  entityid: number,
  tabIndex: number,
  colorIndex: number
}

export interface EntityRelationState {
  entities: { value: string, text: string }[]
  relations: string[]
  loading: boolean
  allRelations: Api.EntityRelation[]
}

type Color = "green" | "olive" | "orange" | "pink" | "purple" | "red"



export default class EntityDropdownComp extends React.Component<EntityRelationProps, EntityRelationState> {

  constructor(props: EntityRelationProps, context: any) {
    super(props, context);
    this.state = { entities: [], relations: [], allRelations: [], loading: true }
  }

  componentWillMount() {

    Api.getRelations(this.props.relationname, this.props.entityid).then(relations => {
      Api.getAllRelations(this.props.relationname).then(allRelations => {
        Api.getEntitiesByType(this.props.relation).then(entities => {
          this.setState({
            ...this.state,
            entities: entities.map(x => {
              return {
                value: x.object_id.toString(),
                text: x.name
              }
            }).filter(entity => {
              let isUnused = allRelations.find(x => {
                return x.target_id.toString() == entity.value
                  && x.source_id != this.props.entityid
              }) == undefined;

              return this.props.isUnique == false || isUnused;
            }),
            allRelations: allRelations,
            relations: relations.map(x => x.target_id.toString()),
            loading: false
          })
        })
      })
    })
  }

  getColor(): Color {
    let colors: Color[] = ["green", "olive", "orange", "pink", "purple", "red"]
    return colors[this.props.colorIndex]
  }

  addOrDeleteRelation(relations: string[]) {
    if (relations.length > this.state.relations.length) {
      //new item added
      let newVal = relations.filter(x => this.state.relations.find(y => y == x) == undefined);
      if (newVal.length > 0) {
        let target = parseInt(newVal[0]);
        return Api.linkEntities(this.props.relationname, this.props.entityid, target);
      } else {
        return Promise.resolve({});
      }
    } else {
      let newVal = this.state.relations.filter(x => relations.find(y => y == x) == undefined);
      if (newVal.length > 0) {
        let target = parseInt(newVal[0])
        return Api.unlinkEntities(this.props.relationname, this.props.entityid, target)
      } else {
        return Promise.resolve({});
      }
    }
  }

  renderSingleRelation(relation: string) {
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
      <Segment color={this.getColor()} loading={this.state.loading}>
        <Header as="h5">{this.props.relation}</Header>
        {/* <List divided verticalAlign='middle'>
                    {this.state.relations.map(x => this.renderSingleRelation(x))}
                    
                </List> */}

        <div>


          {multipleSelectInput(this.state.entities)(
            this.props.relation,
            this.state.relations,
            (v) => {
              this.addOrDeleteRelation(v).then(x => {
                this.setState({ ...this.state, relations: v })
              })
            },
            this.props.tabIndex
          )}
        </div>
      </Segment>
    )
  }

}
