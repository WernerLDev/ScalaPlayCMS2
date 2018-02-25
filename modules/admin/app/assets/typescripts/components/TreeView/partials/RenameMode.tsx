import * as React from 'react';

export interface RenameModeProps {
  onSubmit: (value: string) => void,
  onBlur: () => void,
  defaultValue: string,
  icon: string
}

class RenameMode extends React.Component<RenameModeProps, any> {

  constructor(props: RenameModeProps, context: any) {
    super(props, context);
  }

  render() {
    return (
      <div className="renameContainer">
        <div className="treeicon">
          <i className={"fa fa-" + this.props.icon + " fileicon"} aria-hidden="true"></i>
        </div>
        <div className="treerename">
          <input
            autoFocus
            ref="editfield"
            type="text"
            onKeyDown={(e) => {
              if (e.keyCode == 13) this.props.onSubmit(e.currentTarget.value);
            }}
            onBlur={this.props.onBlur}
            defaultValue={this.props.defaultValue} />
        </div>
      </div>
    )
  }
}

export default RenameMode;
