import * as React from 'react';
import * as Api from '../../api/Api'
import { DropdownInput } from '../../MonadForms/SimpleFormElements' 

export interface EntityDropdownCompProps {
    entityType:string,
    label:string,
    value:string,
    onChange:(v:string) => void,
    tabIndex:number
}

export interface EntityDropdownCompState {
    entities:{value:string, text:string}[]
    loading:boolean
}

export class EntityDropdownComp extends React.Component<EntityDropdownCompProps, EntityDropdownCompState> {

    constructor(props:EntityDropdownCompProps, context:any) {
        super(props, context);
        this.state = { entities: [], loading: true }
    }

    componentWillMount() {
        Api.getEntitiesByType(this.props.entityType).then(result => {
            this.setState({
                entities: result.map(x => {
                    return {
                        value: x.object_id.toString(),
                        text: x.name
                    }
                }),
                loading: false
            });
        })
    }

    render() {
        return DropdownInput(this.state.entities)(
            this.props.label,
            this.props.value,
            this.props.onChange,
            this.props.tabIndex
        )
    }
}


export const EntityDropDown = (
    entityType:string
) => (
    label:string,
    value:number,
    onChange:(v:number) => void,
    tabIndex:number
) => (
    <EntityDropdownComp
        entityType={entityType}
        label={label}
        onChange={(v => {
            onChange(parseInt(v))
        })}
        value={value.toString()}
        tabIndex={tabIndex}
    />
)