import * as React from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'
import * as moment from 'moment'
import { DatePickerInput } from 'rc-datepicker';
import { C, FieldValue } from './Core'


export const TextElement = (txt: string) => function <T>(
  state: T,
  update?: (val: string) => void,
  value?: (s: T) => string
) {
  return (
    <p>{txt}</p>
  )
}

export const SementicInputElement = function <T>(
  state: T,
  update?: (val: FieldValue<T, string>) => void,
  value?: (s: T) => FieldValue<T, string>
) {
  let val = value(state);
  return (
    <Form.Input
      fluid
      error={!val.isValid(val.value, state)}
      type="text"
      value={val.value}
      onChange={(e) => {
        update({ ...val, value: e.currentTarget.value })
      }}
    />
  )
}

export const SementicPasswordElement = function <T>(
  state: T,
  update?: (val: FieldValue<T, string>) => void,
  value?: (s: T) => FieldValue<T, string>
) {
  let val = value(state);
  return (
    <Form.Input
      fluid
      error={!val.isValid(val.value, state)}
      type="password"
      value={val.value}
      onChange={(e) => {
        update({ ...val, value: e.currentTarget.value })
      }}
    />
  )
}


export const SementicNumberInputElement = function <T>(
  state: T,
  update: (val: FieldValue<T, number>) => void,
  value: (s: T) => FieldValue<T, number>
) {
  let val = value(state);
  return (
    <Form.Input
      fluid
      error={!val.isValid(val.value, state)}
      type="number"
      value={val.value}
      onChange={(e) => {
        update({ ...val, value: e.currentTarget.valueAsNumber })
      }}
    />
  )
}

export const SemanticDatePickerElement = function <T>(
  state: T,
  update: (val: FieldValue<T, Date>) => void,
  value: (s: T) => FieldValue<T, Date>
) {
  let val = value(state);
  return (
    <DatePickerInput

      style={{ background: "none" }}
      onChange={(date) => {
        update({ ...val, value: date })
      }}
      value={moment(val.value)}
      displayFormat="MMMM Do YYYY, HH:MM"
      showOnInputClick
    />
  )
}

export const SemanticButtonElement = (label: string, disabled?: boolean) => function <T>(
  state: T,
  update?: (val: string) => void,
  value?: (s: T) => string
) {
  return (
    <Button
      disabled={disabled ? disabled : false}
      onClick={(e) => {
        e.preventDefault();
        if (update != null) update("clicked")
      }}
    >
      {label}
    </Button>
  )
}



export const FormField = function <T, A>(elem: C<T, A>, label: string): C<T, A> {
  return (
    state: T,
    update: (v: A) => void,
    value: (s: T) => A
  ) => {
    return (
      <Form.Field >
        <label>{label}</label>
        {elem(state, update, value)}
        <br />
      </Form.Field>
    )
  }
}