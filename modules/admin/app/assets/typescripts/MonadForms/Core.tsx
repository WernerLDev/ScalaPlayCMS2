import * as React from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'
import {List} from 'immutable'

// export type FormElement<T,A> = (
//     item:T,
//     getValue:(item:T) => A,
//     setValue:(v:A) => void
// ) => JSX.Element


export type C<T,A> = (
    state: T,
    update?: (v:A) => void,
    value?: (s:T) => A
) => JSX.Element


export type FormElem<T,A> = (value: (s:T) => A, update: (v:A) => void) => (s:T) => JSX.Element

export type Comp<T,A> = { 
    comp: C<T,A>,
    update: (val:A, oldS:T) => T,
    value: (s:T) => A
}

export function InitC<T,A>(
    c:C<T,A>,
    update?:(v:A, oldS:T) => T,
    value?:(s:T) => A
) {
    return {
        comp: c,
        update: update != null ? update : (v:A, oldS:T) => oldS,
        value: value,
    }
}


// export type Element<T,A> = {
//     comp: FormElement<T,A>,
//     getValue:(item:T) => A,
//     setValue:(v:A, oldState:T) => T,
//     isValid?:(v:A) => boolean
// }

// export function InitElem<T,A>(
//     elem:FormElement<T,A>, 
//     getValue:(i:T) => A, 
//     setValue:(x:A, s:T) => T, 
//     isValid?:(v:A) => boolean  
// ):Element<T,A> {
//     return {
//         comp: elem,
//         getValue: getValue,
//         setValue: setValue,
//         isValid: isValid
//     }
// }



type CombineCompProps<T,A> = {
    elements: Comp<T,A>[]
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
                        (x) => this.setState( {state: elem.update(x, this.state.state) }, () => {
                            this.props.cont(this.state.state)
                        }),
                        elem.value
                    )}
                    </div>
                )}
            </Form>
        )
    }
}

export const Fold = function<T>(elements:Comp<T,any>[]) {
    type CompType = new() => CombineComp<T,any>;
    const NewComp = CombineComp as CompType;


    return (s:T, update:(s:T) => void, value:(s:T) => T) => <NewComp elements={elements} initialState={value(s)} cont={update} />
}


type MapCompProps<T,A> = {
    element: Comp<T,A>
    map: (elem:Comp<T,A>) => Comp<T,A>
    initialState: T
    cont:(s:T) => void
}

type MapCompState<T> = {
    state: T
}
class MapComp<T,A> extends React.Component<MapCompProps<T,A>, MapCompState<T>> {
    constructor(props:MapCompProps<T,A>, context:any) {
        super(props, context);
        this.state = { state: props.initialState }
    }

    render() {
        let keyindex = 0;
        return(
            this.props
                .map(this.props.element)
                .comp(
                    this.state.state, 
                    (x) => {
                        this.setState({state: this.props.element.update(x, this.state.state)}, () => {
                            this.props.cont(this.state.state)
                        })
                    },
                    this.props.element.value
                )
        )
    }
}

export const MapC = function<T,A>(element:Comp<T,A>, mapFunc:(elem:Comp<T,A>) => Comp<T,A>) {
    type MapType = new() => MapComp<T,A>;
    const NewComp = MapComp as MapType;

    let ret = {
        comp: (s:T, update:(s:T) => void, value:(s:T) => T) => <NewComp map={mapFunc} element={element} initialState={value(s)} cont={update} />,
        update: element.update,
        value: element.value
    }

    return ret;
}










type UpdateCompProps<T,A> = {
    element: Comp<T,A>
    element2: Comp<T,A>
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

    render() {
        let keyindex = 0;
        return(
            <div>
                {this.props.element.comp(this.state.state, (x) => {
                    this.setState({updated: true, state: this.props.element.update(x, this.state.state)}, () => {
                        this.props.cont(this.state.state)
                    })
                }, this.props.element.value)}

                {this.state.updated ? 
                    this.props.element2.comp(this.state.state, (x) => {
                        this.setState({ state: this.props.element2.update(x, this.state.state)}, () => {
                            this.props.cont(this.state.state)
                        })
                    }, this.props.element2.value)
                : null}
            </div>
        )
    }
}

export const InitOnUpdate = function<T,A>(element:Comp<T,A>, elem2:Comp<T,A>) {
    type CompType = new() => UpdateComp<T,A>;
    const NewComp = UpdateComp as CompType;


    return (s:T, update:(s:T) => void, value:(s:T) => T) => <NewComp element={element} element2={elem2} initialState={value(s)} cont={update} />
}