import * as React from 'react';
import { 
    TextInput, 
    DateInput, 
    NumberInput, 
    TextareaInput, 
    DropdownInput, 
    RadioInput, 
    BoolInput,
    FormInput 
} from '../../MonadForms/SimpleFormElements'
import * as Api from '../../api/Api'
import { Menu, Dropdown, Segment, Icon, Dimmer, Loader, Button } from 'semantic-ui-react'

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
    value:Date,
    type:"date"
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
}

export interface EntityTabPanelProps {
    fields:EntityField[]
    item: Api.Entity
}

export interface EntityTabPanelState {
    fields:EntityField[]
}

export default class EntityTabPanel extends React.Component<EntityTabPanelProps, EntityTabPanelState> {
    
    constructor(props:EntityTabPanelProps, context:any) {
        super(props, context);
        this.state = { fields: props.fields}
    }

    renderFormField(f:EntityField, index:number) {
        let isEven = index % 2 == 0;
        if(f.type == "text") {
            return(
                <div className={isEven ? "evenRow" : ""} key={index}>
                    {FormInput(TextInput)(
                        f.name, 
                        f.value,
                        (v) => {
                            let oldFields = this.state.fields;
                            oldFields[index].value = v;
                            this.setState({...this.state, fields: oldFields });
                        }
                    )}
                </div>
            );
        } else if(f.type == "textarea") {
            return(
                <div className={isEven ? "evenRow" : ""} key={index}>
                {FormInput(TextareaInput)(
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
        } else if(f.type == "date") {
            return(
                <div className={isEven ? "evenRow" : ""} key={index}>
                    {FormInput(DateInput)(
                        f.name,
                        f.value,
                        (v) => {
                            let oldFields = this.state.fields;
                            oldFields[index].value = v;
                            this.setState({...this.state, fields: oldFields });
                        }
                    )}
                </div>
            );
        } else if(f.type == "number") {
            return(
                <div className={isEven ? "evenRow" : ""} key={index}>
                    {FormInput(NumberInput)(
                        f.name,
                        f.value,
                        (v) => {
                            let oldFields = this.state.fields;
                            oldFields[index].value = v;
                            this.setState({...this.state, fields: oldFields });
                        }
                    )}
                </div>
            ); 
        } else if(f.type == "dropdown") {
            return (
                <div className={isEven ? "evenRow" : ""} key={index}>
                    {FormInput(DropdownInput(f.options))(
                        f.name,
                        f.value,
                        (v) => {
                            let oldFields = this.state.fields;
                            oldFields[index].value = v;
                            this.setState({...this.state, fields: oldFields });
                        }
                    )}
                </div>
            );
        }  else if(f.type == "radio") {
            return (
                <div className={isEven ? "evenRow" : ""} key={index}>
                    {FormInput(RadioInput(f.options))(
                        f.name,
                        f.value,
                        (v) => {
                            let oldFields = this.state.fields;
                            oldFields[index].value = v;
                            this.setState({...this.state, fields: oldFields });
                        }
                    )}
                </div>
            );
        } else if(f.type == "bool") {
            return (
                <div className={isEven ? "evenRow" : ""} key={index}>
                    {FormInput(BoolInput)(
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
        } else {
            return null;
        }
    }

    handleItemClick() {

    }

    render() {
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
            <div style={{margin: "25px", overflow: "auto"}}>
                {this.props.item.name}
                {this.state.fields.map((field, index) => this.renderFormField(field, index))}
                <hr />
                <div style={{whiteSpace: "pre"}}>
                {JSON.stringify(this.state, null, 2)}
                </div>
            </div>
        </div>
        );
    }
}

