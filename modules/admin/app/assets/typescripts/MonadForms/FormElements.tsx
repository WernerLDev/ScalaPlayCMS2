import * as React from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'
import * as moment from 'moment'
import {DatePickerInput} from 'rc-datepicker';
import { C, FieldValue } from './Core'


export const TextElement = (txt:string) => function<T>(
    state: T,
    update?:(val:string) => void,
    value?: (s:T) => string
){
    return (
        <p>{txt}</p>
    )
}

export const SementicInputElement = function<T>(
    state: T,
    update?:(val:FieldValue<string>) => void,
    value?: (s:T) => FieldValue<string>
){
    let val = value(state);
    return (
        <Form.Input 
            fluid
            error={!val.isValid(val.value)}
            type="text"
            value={val.value}
            onChange={(e) => {
                update({...val, value: e.currentTarget.value})
            }}
        />
    )
}


export const SementicNumberInputElement = function<T>(
    state: T,
    update:(val:FieldValue<number>) => void,
    value: (s:T) => FieldValue<number>
){
    let val = value(state);
    return (
        <Form.Input 
            fluid
            error={!val.isValid(val.value)}
            type="number"
            value={val.value}
            onChange={(e) => {
                update({...val, value: e.currentTarget.valueAsNumber})
            }}
        />
    )
}

export const SemanticDatePickerElement = function<T>(
    state: T,
    update:(val:FieldValue<Date>) => void,
    value: (s:T) => FieldValue<Date>
) {
    let val = value(state);
    return (
        <DatePickerInput
            style={{background: "none"}}
            onChange={(date) => {
                update({...val, value: date})
            }}
            value={moment(val.value)}
            displayFormat="MMMM Do YYYY, HH:MM"
            showOnInputClick
        />
    )
}

export const SemanticButtonElement = (label:string) => function<T>(
    state: T,
    update?:(val:string) => void,
    value?: (s:T) => string
) {
    return (
        <Button
            onClick={(e) => {
                e.preventDefault();
                if(update != null) update("clicked")
            }}
        >
            {label}
        </Button>
    )
}



export const FormField = function<T,A>(elem:C<T,A>, label:string):C<T,A> {
    return (
        state: T,
        update:(v:A) => void,
        value: (s:T) => A
    ) => {
        return (
            <div style={{marginBottom: "10px"}}>
                <label>{label}</label><br />
                {elem(state, update, value)}
            </div>
        )
    }
}