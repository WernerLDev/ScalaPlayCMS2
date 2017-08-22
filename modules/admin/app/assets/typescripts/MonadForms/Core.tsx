import * as React from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'

export type FormElement<T,A> = (
    item:T,
    getValue:(item:T) => A,
    setValue:(v:A) => void
) => JSX.Element


export type Element<T,A> = {
    comp: FormElement<T,A>,
    getValue:(item:T) => A,
    setValue:(v:A, oldState:T) => T,
    isValid?:(v:A) => boolean
}

export function InitElem<T,A>(
    elem:FormElement<T,A>, 
    getValue:(i:T) => A, 
    setValue:(x:A, s:T) => T, 
    isValid?:(v:A) => boolean  
):Element<T,A> {
    return {
        comp: elem,
        getValue: getValue,
        setValue: setValue,
        isValid: isValid
    }
}



type CombineCompProps<T,A> = {
    elements: Element<T,A>[]
    initialState: T
    cont:(s:T) => void
}

type CombineCompState<T> = {
    state: T
}
class CombineComp<T,A> extends React.Component<CombineCompProps<T,A>, CombineCompState<T>> {
    constructor(props:CombineCompProps<T,A>, context:any) {
        super(props, context);
        this.state = { state: props.initialState }
    }

    render() {
        let keyindex = 0;
        return(
            <Form>
                {this.props.elements.map(elem =>
                    <div key={++keyindex}>
                    {elem.comp(
                        this.state.state, 
                        elem.getValue, 
                        (x) => this.setState( {state: elem.setValue(x, this.state.state) }, () => {
                            this.props.cont(this.state.state)
                        })
                    )}
                    </div>
                )}
            </Form>
        )
    }
}

export const Fold = function<T>(elements:Element<T,any>[], cont?:(s:T) => void) {
    type CompType = new() => CombineComp<T,any>;
    const NewComp = CombineComp as CompType;

    return (s:T) => <NewComp elements={elements} initialState={s} cont={cont} />
}