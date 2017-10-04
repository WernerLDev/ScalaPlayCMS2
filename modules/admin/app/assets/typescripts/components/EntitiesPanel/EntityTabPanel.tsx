import * as React from 'react';
import { 
    TextInput, 
    DateInput, 
    NumberInput, 
    TextareaInput, 
    DropdownInput, 
    RadioInput, 
    BoolInput,
    TinyMCEInput,
    ReadonlyInput,
    FormInput 
} from '../../MonadForms/SimpleFormElements'
import * as Api from '../../api/Api'
import { Menu, Dropdown, Segment, Icon, Dimmer, Loader, Button, List, Grid } from 'semantic-ui-react'
import { EntityDropDown } from './EntityDropdown'

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
}

export interface EntityTabPanelProps {
    item: Api.Entity
}

export interface EntityTabPanelState {
    fields:EntityField[],
    working:boolean
}

export default class EntityTabPanel extends React.Component<EntityTabPanelProps, EntityTabPanelState> {
    
    constructor(props:EntityTabPanelProps, context:any) {
        super(props, context);
        this.state = { fields: [], working: true }
    }

    componentWillMount() {
        Api.getEntityForm(this.props.item).then(fields => {
            this.setState({ fields: fields, working: false });
        })
    }

    bgcolor(isEven:boolean) {
        return isEven ? "#fbfbfb" : "white";
    }

    renderFormField(f:EntityField, index:number) {
        let isEven = index % 2 == 0;
        if(f.type == "text") {
            return(
               FormInput(TextInput, this.bgcolor(isEven))(
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
                
                FormInput(TextareaInput, this.bgcolor(isEven))(
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
               FormInput(DateInput, this.bgcolor(isEven))(
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
                FormInput(NumberInput, this.bgcolor(isEven))(
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
                FormInput(DropdownInput(f.options), this.bgcolor(isEven))(
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
                FormInput(RadioInput(f.options), this.bgcolor(isEven))(
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
                FormInput(BoolInput, this.bgcolor(isEven))(
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
                    {FormInput(TinyMCEInput)(
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
                FormInput(ReadonlyInput, this.bgcolor(isEven))(
                        f.name,
                        f.value,
                        (v) => {}
                    )
            );
        } else {
            return null;
        }
    }

    handleItemClick() {
        var entity:MyType = {};
        this.state.fields.forEach(x => {
            entity[x.name] = x.value;
        })
        console.log(entity);
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
                    <Menu.Item name='properties' active={false} onClick={this.handleItemClick.bind(this)}>
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
                <Grid columns={2} divided>
                    <Grid.Column width={12}>
                    <Segment color="blue">
                        {this.state.fields.map((field, index) => this.renderFormField(field, index))}
                        
                        {FormInput(EntityDropDown("category"))(
                            "Category",
                            "",
                            (v) => {}
                        )}
                        
                        {FormInput(EntityDropDown("post"), this.bgcolor(true))(
                            "Post",
                            "",
                            (v) => {}
                        )}
                    
                    </Segment>
                    {/* <Segment>
                        <div style={{marginTop: "15px", whiteSpace: "pre"}}>
                            {JSON.stringify(this.state, null, 2)}
                        </div>
                    </Segment> */}
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Segment color="green">
                        <h3>Categories</h3>
                        <List divided verticalAlign='middle'>
                            <List.Item verticalAlign="middle">
                                <List.Content floated='right'>
                                    <Button size="mini">Unlink</Button>
                                </List.Content>
                                
                                <List.Content verticalAlign="middle">
                                    Lena
                                </List.Content>
                            </List.Item>
                            <List.Item verticalAlign="middle">
                                <List.Content floated='right'>
                                    <Button size="mini">Unlink</Button>
                                </List.Content>
                                
                                <List.Content verticalAlign="middle">
                                    test
                                </List.Content>
                            </List.Item>
                            <List.Item verticalAlign="middle">
                                <List.Content floated='right'>
                                    <Button size="mini">Unlink</Button>
                                </List.Content>
                                
                                <List.Content verticalAlign="middle">
                                    Blaat
                                </List.Content>
                            </List.Item>
                        </List>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        </div>
        );
    }
}

