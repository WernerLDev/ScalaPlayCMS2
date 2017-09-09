import * as React from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'
import {List} from 'immutable'


export type C<T,A> = (
    state: T,
    update?: (v:A) => void,
    value?: (s:T) => A
) => JSX.Element


export type FormElem<T,A> = (value: (s:T) => A, update: (v:A) => void) => (s:T) => JSX.Element
export type FieldValue<A> = {
    value: A,
    isValid: (v:A) => boolean
}


export class CompC<T,A> {

    comp:C<T,A>;
    update:(v:A, oldS:T) => T;
    value:(s:T) => A
    renderCondition:(s:T) => boolean

    constructor(
        c:C<T,A>,
        update?:(v:A, oldS:T) => T,
        value?:(s:T) => A
    ) {
        this.comp = c;
        this.update = update;
        this.value = value;
        this.renderCondition = (v) => true;
    }

    map(f:(c:C<T,A>) => C<T,A>) {
        return new CompC<T,A>(f(this.comp), this.update, this.value);
    }

    visibleIf(f:(s:T) => boolean) {
        this.renderCondition = f;
        return this;
    }

    render(s:T, callback?:(s:T) => void) {
        if(this.renderCondition(s)) {
            return this.comp(s, (v) => {
                if(callback != null && this.update != null) callback(this.update(v,s));
            }, this.value);
        } else {
            return null;
        }
    }
}


export function InitC<T,A>(
    c:C<T,A>,
    update?:(v:A, oldS:T) => T,
    value?:(s:T) => A
):CompC<T,A> {
    let updateF = update != null ? update : (v:A, oldS:T) => oldS;
    return new CompC<T,A>(c, updateF, value);
}





type CombineCompProps<T,A> = {
    elements: CompC<T,A>[]
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

    componentWillReceiveProps(nextProps:CombineCompProps<T,A>) {
        if(JSON.stringify(nextProps.initialState) != JSON.stringify(this.state.state)) {
            this.setState({ state: nextProps.initialState });
        }
    }

    render() {
        let keyindex = 0;
        return(
            <Form>
                {this.props.elements.map(elem =>
                    <div key={++keyindex}>
                        {elem.render(this.state.state, (s) => {
                            this.setState({state: s}, () => this.props.cont(s))
                        })}
                    </div>
                )}
            </Form>
        )
    }
}

export const Fold = function<T>(elements:CompC<T,any>[]) {
    type CompType = new() => CombineComp<T,any>;
    const NewComp = CombineComp as CompType;


    return (s:T, update:(s:T) => void, value:(s:T) => T) => <NewComp elements={elements} initialState={value(s)} cont={update} />
}








type UpdateCompProps<T,A> = {
    element: CompC<T,A>
    element2: CompC<T,A>
    initialState: T
    cont:(s:T) => void
}

type UpdateCompState<T> = {
    state: T,
    updated: boolean
}
class UpdateComp<T,A> extends React.Component<UpdateCompProps<T,A>, UpdateCompState<T>> {
    constructor(props:UpdateCompProps<T,A>, context:any) {
        super(props, context);
        this.state = { state: props.initialState, updated: false }
    }

    componentWillReceiveProps(nextProps:UpdateCompProps<T,A>) {
        if(JSON.stringify(nextProps.initialState) != JSON.stringify(this.state.state)) {
            this.setState({ ...this.state, state: nextProps.initialState });
        }
    }

    render() {
        let keyindex = 0;
        return(
            <div>
                {this.props.element.render(this.state.state, (s) => {
                    console.log("Received update");
                    this.setState({updated: true, state: s}, () => {
                        this.props.cont(s);
                    })
                })}
                {this.state.updated}
                {this.state.updated ?
                    this.props.element2.render(this.state.state, (s) => {
                        this.setState({...this.state, state: s}, () => {
                            this.props.cont(s)
                        })
                    })
                : null}
            </div>
        )
    }
}

export const InitOnUpdate = function<T,A>(element:CompC<T,A>, elem2:CompC<T,A>) {
    type CompType = new() => UpdateComp<T,A>;
    const NewComp = UpdateComp as CompType;


    return (s:T, update:(s:T) => void, value:(s:T) => T) => <NewComp element={element} element2={elem2} initialState={value(s)} cont={update} />
}


