import * as React from 'react'


type FormElement<T,A> = (
    item:T,
    getValue:(item:T) => A,
    setValue:(v:A) => void
) => JSX.Element


const InputElement = function<T>(
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

const DateElement = function<T>(
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

const NumberElement = function<T>(
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


const FormField = function<T,A>(elem:FormElement<T,A>, label:string):FormElement<T,A> {
    return (
        item:T,
        getValue:(item:T) => A,
        setValue:(v:A) => void
    ) => {
        return (
            <div>
                <label>{label}</label><br />
                {elem(item, getValue, setValue)}
            </div>
        )
    }
}

const createFormField = function<T,A>(elem:FormElement<T,A>, label:string) {
    return FormField<T,A>(elem, label);
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
            <div>
                
                {createFormField<TestType, string>(InputElement, "Name")(
                    this.state.test,
                    (x) => x.name,
                    (x) => { this.setState({test: {...this.state.test, name: x}}) }
                )}
                {createFormField<TestType, string>(InputElement, "Email")(
                    this.state.test,
                    (x) => x.email,
                    (x) => { this.setState({test: {...this.state.test, email: x}}) }
                )}
                {createFormField<TestType, Date>(DateElement, "Date of birth")(
                    this.state.test,
                    (x) => x.dob,
                    (x) => { this.setState({test: {...this.state.test, dob: x}}) }
                )}
                {createFormField<TestType, number>(NumberElement, "Bla")(
                    this.state.test,
                    (x) => x.bla,
                    (x) => { this.setState({test: {...this.state.test, bla: x}}) }
                )}

                <br /><br />
                {JSON.stringify(this.state.test)}
            </div>
        );
    }
}
