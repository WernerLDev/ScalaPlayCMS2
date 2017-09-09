import * as React from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'
import * as moment from 'moment'
import {DatePickerInput} from 'rc-datepicker';
import { C, CompC, Fold, InitC, InitFieldValue, FieldValue, InitOnUpdate } from './Core'
import { 
    TextElement,
    SementicInputElement, 
    SementicNumberInputElement,
    SemanticDatePickerElement,
    SemanticButtonElement,
    FormField
} from './FormElements'

const NonEmptyText = function(v:string) {
    return v.length > 0;
}


type TestType = {
    name:FieldValue<string>,
    email:FieldValue<string>,
    dob:FieldValue<Date>,
    bla:FieldValue<number>,
    password:string
}

const testData = {
    name: InitFieldValue<string>("", (v) => v == "werner"),
    email: InitFieldValue<string>("", (v) => v.endsWith("gmail.com")),
    dob: InitFieldValue<Date>(new Date()),
    bla: InitFieldValue<number>(0, (v) => v > 10),
    password: "test123"
}

type FormProps = {}
type FormState = {
    test: TestType
}
export class ReactForms extends React.Component<FormProps, FormState> {
    
    constructor(props:FormProps, context:any) {
        super(props, context);
        this.state = {
            test: testData
        }
    }

    render() {
        return (
            <div style={{padding: "25px"}}>
                
                {Fold<TestType>(
                    [
                        InitC<TestType, FieldValue<string>>(
                            FormField(SementicInputElement, "Name"),
                            (x,s) => { return{...s, name: x}},
                            (x) => x.name
                        ),
                        InitC<TestType, FieldValue<string>>(
                            FormField(SementicInputElement, "Email"),
                            (x,s) => { return{...s, email: x}},
                            (x) => x.email
                        ).visibleIf(x => x.name.value != ""),
                        InitC<TestType, FieldValue<number>>(
                            FormField(SementicNumberInputElement, "Bla"),
                            (x,s) => { return{...s, bla: x}},
                            (x) => x.bla
                        ).visibleIf(x => x.email.value != ""),
                        InitC<TestType, FieldValue<Date>>(
                            FormField(SemanticDatePickerElement, "Date of birth"),
                            (x,s) => { return{...s, dob: x}},
                            (x) => x.dob
                        ).visibleIf(x => x.bla.value > 0),
                        InitC<TestType, TestType>(
                            InitOnUpdate(
                                InitC<TestType, string>(
                                    SemanticButtonElement("Submit")
                                ).map(btn => {
                                    return (s, u, v) => (
                                        <div>
                                            {btn(s,u,v)}
                                            <hr />
                                        </div>
                                    )
                                }),
                                InitC<TestType, string>(
                                    TextElement("Dit is wat tekst.")
                                ).map(x => {
                                    return (s, u, v) => (
                                        <div>
                                            <h3>Mapping component to something new</h3>
                                            {x(s,u,v)}
                                        </div>
                                    )
                                })
                            ),
                            (x, s) => s,
                            (x) => x
                        ).visibleIf(x => x.bla.value > 0)
                    ]
                    )(this.state.test, (x) => {
                        this.setState({test: x})
                    }, (x => x))
                }



                <br /><br />
                <hr />
                {JSON.stringify(this.state.test)}
            </div>
        );
    }
}
