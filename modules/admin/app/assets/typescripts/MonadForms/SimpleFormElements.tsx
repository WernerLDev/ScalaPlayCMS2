import * as React from 'react'
import { Button, Dropdown, Checkbox, Form, Input, Radio, Select, TextArea, Grid } from 'semantic-ui-react'
import * as moment from 'moment'
import {DatePickerInput} from 'rc-datepicker';
import TinyMCE from 'react-mce';


export function ReadonlyInput<T>(
    label:string,
    value:T,
    onChange:(v:T) => void
) {
    return <p>{value}</p>
}

export function TextInput(
    label:string,
    value:string,
    onChange:(v:string) => void
) {
    return (
        <Form.Input 
            fluid
            value={value}
            placeholder={label}
            onChange={(e) => {
                onChange(e.currentTarget.value)
            }}
        />
    );
}

export function TextareaInput(
    label:string,
    value:string,
    onChange:(v:string) => void
) {
    return (
        <Form>
        <TextArea 
            autoHeight
            value={value}
            placeholder={label}
            onChange={(e) => {
                onChange(e.currentTarget.value)
            }}
        />
        </Form>
    );
}

export function NumberInput(
    label:string,
    value:number,
    onChange:(v:number) => void
) {
    return (
        <Form.Input 
            fluid
            type="number"
            value={value}
            placeholder={label}
            onChange={(e) => {
                onChange(e.currentTarget.valueAsNumber)
            }}
        />
    );
}

export function DateInput(
    label:string,
    value:Date,
    onChange:(v:Date) => void
) {
    return (
        <DatePickerInput
            style={{background: "none"}}
            onChange={(date) => {
                onChange(date)
            }}
            value={moment(value)}
            displayFormat="MMMM Do YYYY, HH:MM"
            showOnInputClick
        />
    );
}


export function DropdownInput(
    options:{value:string, text:string}[]
) { 
    return (
        label:string,
        value:string,
        onChange:(v:string) => void
    ) => {
        return (
            <Dropdown 
                placeholder={"Select " + label} 
                value={value} 
                fluid selection 
                onChange={(e, {value}) => {
                    onChange(value as string)
                }}
                options={options} 
            />
        );
    }
}

export function RadioInput(
    options:{value:string, text:string}[]
) { 
    return (
        label:string,
        value:string,
        onChange:(v:string) => void
    ) => {
        return (
            <Form>
                {options.map(x => (
                    <Form.Field>
                        <Form.Radio 
                            checked={x.value == value}
                            label={x.text}
                            name={label}
                            onChange={() => onChange(x.value)}
                        />
                    </Form.Field>
                ))}
            </Form>
        );
    }
}

export function BoolInput(
    label:string,
    value:boolean,
    onChange:(v:boolean) => void
) {
    return (
        <Form.Radio
            toggle
            checked={value}
            onChange={(e, data) => {
               onChange(data.checked)
            }}
        />
    )
}

export function TinyMCEInput(
    label:string,
    value:string,
    onChange:(v:string) => void
) {
    return (
        <TinyMCE
            content={value}
            config={{
            plugins: 'link code',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
            }}
            onChange={(e) => onChange(e.target.getContent())}
        />
    )
}

export function FormInput<T>(
    inputElem:(l:string, v:T, u:(v:T) => void) => JSX.Element
) {
    return (
        label:string,
        value:T,
        onChange:(v:T) => void
    ) => (
        <Grid columns={2} divided>
            <Grid.Column width={2} textAlign="right" verticalAlign="middle">
                {label}
            </Grid.Column>
            <Grid.Column width={14}>
                {inputElem(label, value, onChange)}
            </Grid.Column>
        </Grid>
    );
}