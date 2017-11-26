import * as React from 'react';
import * as Api from '../../api/Api'
import { DropdownInput } from '../../MonadForms/SimpleFormElements' 

export type EntityObject = {
    [key:string] : string
}

export interface EntityDropdownCompProps {
    entityType:string,
    source_id:number,
    label:string,
    value:string,
    onChange:(v:string) => void,
    tabIndex:number,
    objects:EntityObject[],
    isUnique:boolean
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

    getUsedIds():string[] {
        return this.props.objects.map(obj => {
            return obj[this.props.entityType + "_id"];
        });
    }

    componentWillMount() {
        let usedIds = this.getUsedIds();
        Api.getEntitiesByType(this.props.entityType).then(result => {
            this.setState({
                entities: result.map(x => {
                    return {
                        value: x.object_id.toString(),
                        text: x.name
                    }
                }).filter(e => {
                    if(this.props.isUnique) {
                     return usedIds.find(x => x == e.value) == undefined
                            || e.value == this.props.value;
                    } else {
                        return true;
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
    entityType:string,
    source_id:number,
    objects:EntityObject[],
    isUnique:boolean
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
        objects={objects}
        isUnique={isUnique}
        source_id={source_id}
    />
)