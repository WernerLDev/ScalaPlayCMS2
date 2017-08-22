import * as React from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'
import * as moment from 'moment'
import {DatePickerInput} from 'rc-datepicker';
import { FormElement } from './Core'

export const SementicInputElement = function<T>(
    item:T,
    getValue:(item:T) => string,
    setValue:(val:string) => void
){
    return (
        <Form.Input 
            fluid
            type="text"
            value={getValue(item)}
            onChange={(e) => {
                setValue(e.currentTarget.value)
            }}
        />
    )
}


export const SementicNumberInputElement = function<T>(
    item:T,
    getValue:(item:T) => number,
    setValue:(val:number) => void
){
    return (
        <Form.Input 
            fluid
            type="number"
            value={getValue(item)}
            onChange={(e) => {
                setValue(e.currentTarget.valueAsNumber)
            }}
        />
    )
}

export const SemanticDatePickerElement = function<T>(
    item:T,
    getValue:(item:T) => Date,
    setValue:(val:Date) => void
) {
    return (
        <DatePickerInput
            style={{background: "none"}}
            onChange={(date) => {
                setValue(date)
            }}
            value={moment(getValue(item))}
            displayFormat="MMMM Do YYYY, HH:MM"
            showOnInputClick
        />
    )
}

export const SemanticButtonElement = function<T>(
    item:T,
    getValue:(item:T) => string,
    setValue:(val:string) => void
) {
    return (
        <Button
            onClick={(e) => {
                e.preventDefault();
                setValue("saved")
            }}
        >
            {getValue(item)}
        </Button>
    )
}

export const InputElement = function<T>(
    item:T,
    getValue:(item:T) => string,
    setValue:(val:string) => void
){
    return (
        <input 
            type="text"
            value={getValue(item)}
            onChange={(e) => {
                setValue(e.currentTarget.value)
            }}
        />
    )
}

export const DateElement = function<T>(
    item:T,
    getValue:(item:T) => Date,
    setValue:(val:Date) => void
){
    return (
        <input 
            type="date"
            value={getValue(item).toTimeString()}
            onChange={(e) => {
                setValue(e.currentTarget.valueAsDate)
            }}
        />
    )
}

export const NumberElement = function<T>(
    item:T,
    getValue:(item:T) => number,
    setValue:(val:number) => void
){
    return (
        <input 
            type="number"
            value={getValue(item).toString()}
            onChange={(e) => {
                setValue(e.currentTarget.valueAsNumber)
            }}
        />
    )
}


export const FormField = function<T,A>(elem:FormElement<T,A>, label:string):FormElement<T,A> {
    return (
        item:T,
        getValue:(item:T) => A,
        setValue:(v:A) => void
    ) => {
        return (
            <div style={{marginBottom: "10px"}}>
                <label>{label}</label><br />
                {elem(item, getValue, setValue)}
            </div>
        )
    }
}