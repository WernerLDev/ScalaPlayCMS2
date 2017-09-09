import * as React from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'
import * as moment from 'moment'
import {DatePickerInput} from 'rc-datepicker';
import { C, CompC, Fold, InitC, MapC, InitOnUpdate } from './Core'
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
                        InitC<TestType, string>(
                            FormField(SementicInputElement, "Name", (s) => s == "werner"),
                            (x,s) => { return{...s, name: x}},
                            (x) => x.name
                        ).map(x => (s,u,v) => (
                            <div>
                                {x(s,u,v)}
                                Some message
                            </div>
                        )),
                        InitC<TestType, string>(
                            FormField(SementicInputElement, "Email", (s) => s.endsWith("@gmail.com")),
                            (x,s) => { return{...s, email: x}},
                            (x) => x.email
                        ),
                        InitC<TestType, number>(
                            FormField(SementicNumberInputElement, "Bla"),
                            (x,s) => { return{...s, bla: x}},
                            (x) => x.bla
                        ),
                        InitC<TestType, Date>(
                            FormField(SemanticDatePickerElement, "Date of birth"),
                            (x,s) => { return{...s, dob: x}},
                            (x) => x.dob
                        ),
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
                        ).visibleIf(x => x.name == "werner")
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
