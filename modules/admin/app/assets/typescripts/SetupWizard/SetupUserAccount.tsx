import { C, CompC, Fold, InitC, InitFieldValue, FieldValue, InitOnUpdate } from '../MonadForms/Core'
import { 
    TextElement,
    SementicInputElement, 
    SementicNumberInputElement,
    SemanticDatePickerElement,
    SemanticButtonElement,
    SementicPasswordElement,
    FormField
} from '../MonadForms/FormElements'


export interface UserAccount {
    username: FieldValue<UserAccount, string>,
    password: FieldValue<UserAccount, string>,
    repeatPassword: FieldValue<UserAccount, string>,
    email: FieldValue<UserAccount, string>
}

export const AccountForm = function<T>(
    state: T,
    update?:(val:UserAccount) => void,
    value?: (s:T) => UserAccount
){
    return Fold<UserAccount>([
        InitC<UserAccount, FieldValue<UserAccount, string>>(
            FormField(SementicInputElement, "Username"),
            (v, s) => { return {...s, username: v} },
            (s) => s.username
        ),
        InitC<UserAccount, FieldValue<UserAccount, string>>(
            FormField(SementicPasswordElement, "Password"),
            (v, s) => { return {...s, password: v} },
            (s) => s.password
        ),
        InitC<UserAccount, FieldValue<UserAccount, string>>(
            FormField(SementicPasswordElement, "Repeat password"),
            (v, s) => { return {...s, repeatPassword: v} },
            (s) => s.repeatPassword
        ),
        InitC<UserAccount, FieldValue<UserAccount, string>>(
            FormField(SementicInputElement, "Email" + value(state).email.value),
            (v, s) => { return {...s, email: v} },
            (s) => s.email
        ),
        InitC<UserAccount, string>(
            SemanticButtonElement("Continue"),
            (v, s) => {
                update(s)
                return s;
            }
        )
    ])(value(state), (v) => {}, (v) => v)
}
