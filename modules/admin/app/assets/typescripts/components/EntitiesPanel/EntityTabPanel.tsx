import * as React from 'react';
import { 
    TextInput, 
    DateInput, 
    NumberInput, 
    TextareaInput, 
    DropdownInput, 
    RadioInput, 
    BoolInput,
    ReadonlyInput,
    FormInput 
} from '../../MonadForms/SimpleFormElements'
import * as Api from '../../api/Api'
import { Menu, Dropdown, Segment, Icon, Dimmer, Loader, Button, List, Grid } from 'semantic-ui-react'
import { EntityDropDown } from './EntityDropdown'
import EntityRelation from './EntityRelation'

interface MyType {
    [name: string]: any;
}

export type EntityField = {
    name:string,
    value:string,
    type:"text"
} | {
    name:string,
    value:string,
    type:"textarea"
} | {
    name:string,
    value:string,
    type:"richtext"
} | {  
    name:string,
    value:number,
    type:"datetime"
} | {
    name:string,
    value:number,
    type:"number"
} | {
    name:string,
    value:string,
    type:"dropdown",
    options:{value:string, text:string}[]
} | {
    name:string,
    value:string,
    type:"radio",
    options:{value:string, text:string}[]
} | {
    name:string,
    value:boolean,
    type:"bool"
} | {
    name: string,
    value:any,
    type:"readonly"
} | {
    name: string,
    relation: string,
    value: number,
    type: "relation"
}

export interface EntityTabPanelProps {
    item: Api.Entity
}

export interface EntityTabPanelState {
    fields:EntityField[],
    relations:{relationname:string, relation:string}[],
    working:boolean,
    saving:boolean
}

export default class EntityTabPanel extends React.Component<EntityTabPanelProps, EntityTabPanelState> {
    
    constructor(props:EntityTabPanelProps, context:any) {
        super(props, context);
        this.state = { fields: [], relations: [], working: true, saving: false }
    }

    componentWillMount() {
        Api.getEntityForm(this.props.item).then(fields => {
            this.setState({ fields: fields.attributes, relations: fields.relations, working: false });
        })
    }

    saveEntity() {
        var entity:MyType = {};
        this.state.fields.forEach(x => {
            entity[x.name] = x.value;
        })
        this.setState({...this.state, saving: true}, () => {
            Api.updateEntity(entity, this.props.item.discriminator).then(x => {
                setTimeout(() => {
                    this.setState({...this.state, saving: false})
                }, 1000)
            })
        })
    }

    handleItemClick() {

    }

    bgcolor(isEven:boolean) {
        return isEven ? "#fbfbfb" : "white";
    }

    renderFormField(f:EntityField, index:number) {
        let isEven = index % 2 == 0;
        if(f.type == "text") {
            return(
               FormInput(TextInput, index.toString(), this.bgcolor(isEven))(
                        f.name, 
                        f.value,
                        (v) => {
                            let oldFields = this.state.fields;
                            oldFields[index].value = v;
                            this.setState({...this.state, fields: oldFields });
                        }
                    )
            );
        } else if(f.type == "textarea") {
            return(
                
                FormInput(TextareaInput, index.toString(), this.bgcolor(isEven))(
                    f.name,
                    f.value,
                    (v) => {
                        let oldFields = this.state.fields;
                        oldFields[index].value = v;
                        this.setState({...this.state, fields: oldFields });
                    }
                )
            
            )
        } else if(f.type == "datetime") {
            return(
               FormInput(DateInput, index.toString(), this.bgcolor(isEven))(
                        f.name,
                        f.value,
                        (v) => {
                            let oldFields = this.state.fields;
                            oldFields[index].value = v;
                            this.setState({...this.state, fields: oldFields });
                        }
                    )
            );
        } else if(f.type == "number") {
            return(
                FormInput(NumberInput, index.toString(), this.bgcolor(isEven))(
                        f.name,
                        f.value,
                        (v) => {
                            let oldFields = this.state.fields;
                            oldFields[index].value = v;
                            this.setState({...this.state, fields: oldFields });
                        }
                    )
            ); 
        } else if(f.type == "dropdown") {
            return (
                FormInput(DropdownInput(f.options), index.toString(), this.bgcolor(isEven))(
                        f.name,
                        f.value,
                        (v) => {
                            let oldFields = this.state.fields;
                            oldFields[index].value = v;
                            this.setState({...this.state, fields: oldFields });
                        }
                    )
            );
        }  else if(f.type == "radio") {
            return (
                FormInput(RadioInput(f.options), index.toString(), this.bgcolor(isEven))(
                        f.name,
                        f.value,
                        (v) => {
                            let oldFields = this.state.fields;
                            oldFields[index].value = v;
                            this.setState({...this.state, fields: oldFields });
                        }
                    )
            );
        } else if(f.type == "bool") {
            return (
                FormInput(BoolInput, index.toString(), this.bgcolor(isEven))(
                        f.name,
                        f.value,
                        (v) => {
                            let oldFields = this.state.fields;
                            oldFields[index].value = v;
                            this.setState({...this.state, fields: oldFields });
                        }
                    )
            )  
        } else if(f.type == "richtext") {
            return (
                <div className={isEven ? "evenRow" : ""} key={index}>
                    {FormInput(TextareaInput, index.toString(), this.bgcolor(isEven))(
                        f.name,
                        f.value,
                        (v) => {
                            let oldFields = this.state.fields;
                            oldFields[index].value = v;
                            this.setState({...this.state, fields: oldFields });
                        }
                    )}
                </div>
            )
        } else if(f.type == "readonly") {
            return (
                FormInput(ReadonlyInput, index.toString(), this.bgcolor(isEven))(
                        f.name,
                        f.value,
                        (v) => {}
                    )
            );
        } else if(f.type == "relation") {
            return (
                FormInput(EntityDropDown(f.relation), index.toString())(
                    f.relation,
                    f.value,
                    (v) => {
                        let oldFields = this.state.fields;
                        oldFields[index].value = v;
                        this.setState({...this.state, fields: oldFields });
                    }
                )
            )
        } else {
            return null;
        }
    }

   

    render() {
        if(this.state.working) return (
            <Dimmer active inverted>
                <Loader inverted content="Loading..." />
            </Dimmer> 
        )
        return (
        <div>
            <Segment inverted className="toolbar">
                <Menu inverted icon="labeled" size="massive">
                    <Menu.Item name='properties' active={false} onClick={this.saveEntity.bind(this)}>
                        <Icon name='save' />Save
                    </Menu.Item>

                    <Menu.Item name='properties' active={false} onClick={this.handleItemClick.bind(this)}>
                        <Icon name='setting' />Properties
                    </Menu.Item>
                    <Menu.Item position="right" name='deletething' active={false} onClick={this.handleItemClick.bind(this)}>
                        <Icon name='trash' />Remove
                    </Menu.Item>
                </Menu>
            </Segment>
            <div className="entityEditPane">
                {this.state.saving ?
                    <Dimmer active inverted>
                        <Loader inverted content="Saving..." />
                    </Dimmer>
                : null }
                <Grid columns={2} divided>
                    <Grid.Column width={12}>
                    <Segment color="blue">
                        {this.state.fields.map((field, index) => this.renderFormField(field, index))}
                        
                        {/* {FormInput(EntityDropDown("category"))(
                            "Category",
                            "",
                            (v) => {}
                        )}
                        
                        {FormInput(EntityDropDown("post"), this.bgcolor(true))(
                            "Post",
                            "",
                            (v) => {}
                        )} */}
                    
                    </Segment>
                    {/* <Segment>
                        <div style={{marginTop: "15px", whiteSpace: "pre"}}>
                            {JSON.stringify(this.state, null, 2)}
                        </div>
                    </Segment> */}
                    </Grid.Column>
                    <Grid.Column width={4}>
                        {this.state.relations.map(x => 
                            <EntityRelation
                                entityid={this.props.item.object_id}
                                relation={x.relation}
                                relationname={x.relationname}
                            />
                        )}
                    </Grid.Column>
                </Grid>
            </div>
        </div>
        );
    }
}

