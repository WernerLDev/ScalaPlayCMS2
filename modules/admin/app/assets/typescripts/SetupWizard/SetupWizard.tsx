import * as React from 'react'
import { Container, Icon, Step, Form  } from 'semantic-ui-react'
import {UserAccount, AccountForm} from './SetupUserAccount'
import {  Stepper } from './Stepper'
import { C, CompC, Fold, InitC, InitFieldValue, FieldValue, InitOnUpdate } from '../MonadForms/Core'
import { 
    TextElement,
    SementicInputElement, 
    SementicNumberInputElement,
    SemanticDatePickerElement,
    SemanticButtonElement,
    FormField
} from '../MonadForms/FormElements'

export type Steps = 1 | 2 | 3

export interface SetupWizardProps {}

export interface SetupWizardState {
    step: Steps
    userAccount:UserAccount
}

/**
 * Setup wizard
 * 
 * @class SetupWizard
 * @extends {React.Component<SetupWizardProps, SetupWizardState>}
 */
export default class SetupWizard extends React.Component<SetupWizardProps, SetupWizardState> {
 
    constructor(props:SetupWizardProps, context:any) {
        super(props, context);
        this.state = { 
            step: 1,
            userAccount: {
                username: InitFieldValue<UserAccount, string>("", (x, s) => x.length > 4),
                password: InitFieldValue<UserAccount, string>("", (x, s) => x.length > 8),
                repeatPassword: InitFieldValue<UserAccount, string>("", (x, s) => x == s.password.value && x.length > 8),
                email: InitFieldValue<UserAccount, string>("", (x, s) => x.endsWith("@gmail.com"))
            }
        }
    }

    render() {
        return (
            <div>
                <h1>First time setup</h1>

                <Form>
                    {Fold<SetupWizardState>([
                        InitC<SetupWizardState, Steps>(
                            Stepper,
                            (v,s) => { return {...s, step: v} },
                            (s) => s.step
                        ),
                        InitC<SetupWizardState, string>(
                            (s,u,v) => (
                                <div>
                                    <p>With this wizard you create an admin account and fill the database with some initial data.</p> 
                                    <p>Click 'continue' to start.</p>
                                    <hr />
                                    {SemanticButtonElement("Continue")(s,u,v)}
                                </div>
                            ),
                            (v,s) => { return {...s, step: 2 }}
                        ).visibleIf(x => x.step == 1)
                        ,
                        InitC<SetupWizardState, UserAccount>(
                            AccountForm,
                            (v,s) => { return {...s, userAccount: v, step: 3 }},
                            (s) => s.userAccount
                        ).visibleIf(x => x.step == 2)
                        ,
                        InitC<SetupWizardState, string>(
                            (s,u,v) => (
                                <div style={{whiteSpace: "pre"}}>
                                    {JSON.stringify(s.userAccount, null, 2)}
                                </div>
                            )
                        ).visibleIf(x => x.step == 3)
                    ])(
                        this.state, 
                        (s) => this.setState(s),
                        (s) => s
                    )}
                </Form>
            </div>
        )
    }
}