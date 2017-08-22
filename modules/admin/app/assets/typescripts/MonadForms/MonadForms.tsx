import * as React from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'
import * as moment from 'moment'
import {DatePickerInput} from 'rc-datepicker';
import { FormElement, Element, Fold, InitElem } from './Core'
import { 
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
    name:string,
    email:string,
    dob:Date,
    bla:number,
    password:string
}

const testData = {
    name: "Werner",
    email: "werner@test.nl",
    dob: new Date(),
    bla: 2,
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
                        InitElem<TestType, string>(
                            FormField(SementicInputElement, "Name"),
                            (x) => x.name,
                            (x,s) => { return{...s, name: x}},
                            NonEmptyText
                        ),
                        InitElem<TestType, string>(
                            FormField(SementicInputElement, "Email"),
                            (x) => x.email,
                            (x,s) => { return{...s, email: x}},
                            NonEmptyText
                        ),
                        InitElem<TestType, number>(
                            FormField(SementicNumberInputElement, "Bla"),
                            (x) => x.bla,
                            (x,s) => { return{...s, bla: x}},
                            (v:number) => v > 0 && v < 20
                        ),
                        InitElem<TestType, Date>(
                            FormField(SemanticDatePickerElement, "Date of birth"),
                            (x) => x.dob,
                            (x,s) => { return{...s, dob: x}}
                        ),
                        InitElem<TestType, string>(
                            SemanticButtonElement,
                            (x) => "Submit form",
                            (x,s) => {
                                alert("Email is " + s.email);
                                return s;
                            }
                        ),
                    ], (s) => {
                        this.setState({test: s})
                    }
                    )(this.state.test)
                }


                <br /><br />
                <hr />
                {JSON.stringify(this.state.test)}
            </div>
        );
    }
}
