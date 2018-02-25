import { C, CompC, Fold, InitC, InitFieldValue, FieldValue, InitOnUpdate, validateFields } from '../MonadForms/Core'
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

let isValid = function (values: UserAccount) {
  return validateFields([
    values.email, values.password, values.repeatPassword, values.username
  ], values);
}

// let isValid = function(values:UserAccount) {
//     return values.username.isValid(values.username.value, values)
//             && values.password.isValid(values.password.value, values)
//             && values.repeatPassword.isValid(values.repeatPassword.value, values)
//             && values.email.isValid(values.email.value, values)
// }

export const AccountForm = function <T>(
  state: T,
  update?: (val: UserAccount) => void,
  value?: (s: T) => UserAccount
) {
  return Fold<UserAccount>([
    InitC<UserAccount, FieldValue<UserAccount, string>>(
      FormField(SementicInputElement, "Username"),
      (v, s) => { return { ...s, username: v } },
      (s) => s.username
    ),
    InitC<UserAccount, FieldValue<UserAccount, string>>(
      FormField(SementicPasswordElement, "Password"),
      (v, s) => { return { ...s, password: v } },
      (s) => s.password
    ),
    InitC<UserAccount, FieldValue<UserAccount, string>>(
      FormField(SementicPasswordElement, "Repeat password"),
      (v, s) => { return { ...s, repeatPassword: v } },
      (s) => s.repeatPassword
    ),
    InitC<UserAccount, FieldValue<UserAccount, string>>(
      FormField(SementicInputElement, "Email"),
      (v, s) => { return { ...s, email: v } },
      (s) => s.email
    ),
    InitC<UserAccount, string>(
      (s, u, v) => {
        return SemanticButtonElement("Continue", !isValid(s))(s, u, v)
      },
      (v, s) => {
        update(s)
        return s;
      }
    )
  ])(value(state), (v) => { }, (v) => v)
}
