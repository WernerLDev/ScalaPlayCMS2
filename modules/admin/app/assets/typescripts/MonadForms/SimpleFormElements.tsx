import * as React from 'react'
import { Button, Dropdown, Checkbox, Form, Input, Radio, Select, TextArea, Grid } from 'semantic-ui-react'
import * as moment from 'moment'
import {DatePickerInput} from 'rc-datepicker';


export function ReadonlyInput<T>(
    label:string,
    value:T,
    onChange:(v:T) => void,
    tabIndex:number
) {
    return <p>{value}</p>
}

export function TextInput(
    label:string,
    value:string,
    onChange:(v:string) => void,
    tabIndex:number
) {
    return (
        <Form.Input 
            fluid
            tabIndex={tabIndex}
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
    onChange:(v:string) => void,
    tabIndex:number
) {
    return (
        <Form>
            <Form.TextArea 
                autoHeight
                className="entity-textarea"
                tabIndex={tabIndex}
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
    onChange:(v:number) => void,
    tabIndex:number
) {
    return (
        <Form.Input 
            fluid
            type="number"
            tabIndex={tabIndex}
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
    value:number,
    onChange:(v:number) => void,
    tabIndex:number
) {
    return (
        <DatePickerInput
            style={{background: "none"}}
            onChange={(date) => {
                onChange(date.getTime())
            }}
            value={moment(new Date(value))}
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
        onChange:(v:string) => void,
        tabIndex:number
    ) => {
        return (
            <Dropdown 
                tabIndex={tabIndex}
                loading={options.length == 0}
                search
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

export function multipleSelectInput(
    options:{value:string, text:string}[]
) {
    return (
        label:string,
        values:string[],
        onChange:(v:string[]) => void,
        tabIndex:number
    ) => (
        <Dropdown 
            multiple 
            search 
            selection 
            fluid 
            openOnFocus
            defaultOpen={false}
            tabIndex={tabIndex}
            options={options} 
            placeholder='Make selection' 
            value={values}
            onChange={(e, {value}) => {
                onChange(value as string[])
            }}
            onLabelClick={(e, {value}) => {
                console.log("Clicked on " + value)
            }}
        />
    )
}

export function RadioInput(
    options:{value:string, text:string}[]
) { 
    return (
        label:string,
        value:string,
        onChange:(v:string) => void,
        tabIndex:number
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
    onChange:(v:boolean) => void,
    tabIndex:number
) {
    return (
        <Form.Radio
            tabIndex={tabIndex}
            toggle
            checked={value}
            onChange={(e, data) => {
               onChange(data.checked)
            }}
        />
    )
}

// export function TinyMCEInput(
//     label:string,
//     value:string,
//     onChange:(v:string) => void
// ) {
//     return (
//         <TinyMCE
//             content={value}
//             config={{
//             plugins: 'link code',
//             toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
//             }}
//             onChange={(e) => onChange(e.target.getContent())}
//         />
//     )
// }

export function FormInput<T>(
    inputElem:(l:string, v:T, u:(v:T) => void, ti:number) => JSX.Element,
    key?:string,
    background?:string
) {
    let bgcolor = background ? background : "white";
    return (
        label:string,
        value:T,
        onChange:(v:T) => void,
        tabIndex:number
    ) => (
        <Grid key={key} style={{background: bgcolor}} columns={2} divided>
            <Grid.Column width={4} textAlign="right" verticalAlign="middle">
                {label}
            </Grid.Column>
            <Grid.Column width={12}>
                {inputElem(label, value, onChange, tabIndex)}
            </Grid.Column>
        </Grid>
    );
}