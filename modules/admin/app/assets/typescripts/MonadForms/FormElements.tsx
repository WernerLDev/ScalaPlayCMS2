import * as React from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'
import * as moment from 'moment'
import {DatePickerInput} from 'rc-datepicker';
import { C } from './Core'


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
    update:(val:string) => void,
    value: (s:T) => string
){
    return (
        <Form.Input 
            fluid
            type="text"
            value={value(state)}
            onChange={(e) => {
                update(e.currentTarget.value)
            }}
        />
    )
}


export const SementicNumberInputElement = function<T>(
    state: T,
    update:(val:number) => void,
    value: (s:T) => number
){
    return (
        <Form.Input 
            fluid
            type="number"
            value={value(state)}
            onChange={(e) => {
                update(e.currentTarget.valueAsNumber)
            }}
        />
    )
}

export const SemanticDatePickerElement = function<T>(
    state: T,
    update:(val:Date) => void,
    value: (s:T) => Date
) {
    return (
        <DatePickerInput
            style={{background: "none"}}
            onChange={(date) => {
                update(date)
            }}
            value={moment(value(state))}
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