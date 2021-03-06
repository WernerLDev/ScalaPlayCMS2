import * as React from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'
import { List } from 'immutable'


export type C<T, A> = (
  state: T,
  update?: (v: A) => void,
  value?: (s: T) => A
) => JSX.Element


export type FormElem<T, A> = (value: (s: T) => A, update: (v: A) => void) => (s: T) => JSX.Element
export type FieldValue<T, A> = {
  value: A,
  isValid: (v: A, s: T) => boolean
}

export function InitFieldValue<T, A>(v: A, valid?: ((v: A, s: T) => boolean)) {
  let isValid = valid == null ? (v: A, s: T) => true : valid;
  return { value: v, isValid: isValid }
}

export function validateField<T, A>(field: FieldValue<T, A>, state: T) {
  return field.isValid(field.value, state);
}

export function validateFields<T, A>(fields: FieldValue<T, A>[], state: T) {
  return fields.map(x => x.isValid(x.value, state)).filter(x => x == false).length == 0;
}

export class CompC<T, A> {

  private comp: C<T, A>;
  private update: (v: A, oldS: T) => T;
  private value: (s: T) => A
  private renderCondition: (s: T) => boolean
  private test: number

  constructor(
    c: C<T, A>,
    update?: (v: A, oldS: T) => T,
    value?: (s: T) => A
  ) {
    this.comp = c;
    this.update = update;
    this.value = value;
    this.renderCondition = (v) => true;
    this.test = 3;
  }

  map(f: (c: C<T, A>) => C<T, A>) {
    this.comp = f(this.comp);
    return this;
  }

  visibleIf(f: (s: T) => boolean) {
    this.renderCondition = f;
    return this;
  }

  render(state: T, callback?: (s: T) => void) {
    if (this.renderCondition(state)) {
      return this.comp(
        state,
        (value) => {
          if (callback != null && this.update != null) callback(this.update(value, state));
        },
        this.value);
    } else {
      return null;
    }
  }
}


export function InitC<T, A>(
  c: C<T, A>,
  update?: (v: A, oldS: T) => T,
  value?: (s: T) => A
): CompC<T, A> {
  let updateF = update != null ? update : (v: A, oldS: T) => oldS;
  return new CompC<T, A>(c, updateF, value);
}





type CombineCompProps<T, A> = {
  elements: CompC<T, A>[]
  initialState: T
  cont: (s: T) => void
}

type CombineCompState<T> = {
  state: T
}
class CombineComp<T, A> extends React.Component<CombineCompProps<T, A>, CombineCompState<T>> {
  constructor(props: CombineCompProps<T, A>, context: any) {
    super(props, context);
    this.state = { state: props.initialState }
  }

  componentWillReceiveProps(nextProps: CombineCompProps<T, A>) {
    if (JSON.stringify(nextProps.initialState) != JSON.stringify(this.state.state)) {
      this.setState({ state: nextProps.initialState });
    }
  }

  render() {
    let keyindex = 0;
    return (
      <div>
        {this.props.elements.map(elem =>
          <div key={++keyindex}>
            {elem.render(this.state.state, (s) => {
              this.setState({ state: s }, () => this.props.cont(s))
            })}
          </div>
        )}
      </div>
    )
  }
}

export const Fold = function <T>(elements: CompC<T, any>[]) {
  type CompType = new () => CombineComp<T, any>;
  const NewComp = CombineComp as CompType;


  return (s: T, update: (s: T) => void, value: (s: T) => T) => <NewComp elements={elements} initialState={value(s)} cont={update} />
}








type UpdateCompProps<T, A> = {
  element: CompC<T, A>
  element2: CompC<T, A>
  initialState: T
  cont: (s: T) => void
}

type UpdateCompState<T> = {
  state: T,
  updated: boolean
}
class UpdateComp<T, A> extends React.Component<UpdateCompProps<T, A>, UpdateCompState<T>> {
  constructor(props: UpdateCompProps<T, A>, context: any) {
    super(props, context);
    this.state = { state: props.initialState, updated: false }
  }

  componentWillReceiveProps(nextProps: UpdateCompProps<T, A>) {
    if (JSON.stringify(nextProps.initialState) != JSON.stringify(this.state.state)) {
      this.setState({ ...this.state, state: nextProps.initialState });
    }
  }

  render() {
    let keyindex = 0;
    return (
      <div>
        {this.props.element.render(this.state.state, (s) => {
          this.setState({ updated: true, state: s }, () => {
            this.props.cont(s);
          })
        })}
        {this.state.updated}
        {this.state.updated ?
          this.props.element2.render(this.state.state, (s) => {
            this.setState({ ...this.state, state: s }, () => {
              this.props.cont(s)
            })
          })
          : null}
      </div>
    )
  }
}

export const InitOnUpdate = function <T, A>(element: CompC<T, A>, elem2: CompC<T, A>) {
  type CompType = new () => UpdateComp<T, A>;
  const NewComp = UpdateComp as CompType;


  return (s: T, update: (s: T) => void, value: (s: T) => T) => <NewComp element={element} element2={elem2} initialState={value(s)} cont={update} />
}








export const PromiseElement = function <T, A>(element: C<T, A>, promise: (v: A) => Promise<A>) {

}