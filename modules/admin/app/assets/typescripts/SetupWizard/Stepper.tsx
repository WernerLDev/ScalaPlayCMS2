import * as React from 'react'
import { Breadcrumb } from 'semantic-ui-react'
import { Steps } from './SetupWizard'


export const Stepper = function<T>(
    state:T,
    update?:(val:Steps) => void,
    value?: (s:T) => Steps
) {
    return (
        <div>
        <hr />
        <Breadcrumb>
            <Breadcrumb.Section 
                
                active={value(state) == 1}>Start</Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section 
               
                active={value(state) == 2}>UserAccount</Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section 
                
                active={value(state) == 3}>Seeds</Breadcrumb.Section>
        </Breadcrumb>
        <hr />
        </div>
    )
}
