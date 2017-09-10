import * as React from 'react'
import { Container, Icon, Step, Form  } from 'semantic-ui-react'
import {UserAccount, AccountForm} from './SetupUserAccount'
import { C, CompC, Fold, InitC, InitFieldValue, FieldValue, InitOnUpdate } from '../MonadForms/Core'
import { 
    TextElement,
    SementicInputElement, 
    SementicNumberInputElement,
    SemanticDatePickerElement,
    SemanticButtonElement,
    FormField
} from '../MonadForms/FormElements'

export interface SetupWizardProps {}



export interface SetupWizardState {
    step: 1 | 2 | 3
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
                repeatPassword: InitFieldValue<UserAccount, string>("", (x, s) => x == s.password.value),
                email: InitFieldValue<UserAccount, string>("", (x, s) => x.endsWith("@gmail.com"))
            }
        }
    }

    render() {
        return (
            <div>
                <h1>First time setup</h1>
                <p>asdfasf</p>
                <Form>
                    {
                        Fold<SetupWizardState>([
                            InitC<SetupWizardState, string>(
                                SemanticButtonElement("Continue"),
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
                                TextElement("Account created")
                            ).visibleIf(x => x.step == 3)
                        ])(
                            this.state, 
                            (s) => this.setState(s),
                            (s) => s
                        )
                    }
                </Form>
            </div>
        )
    }
}