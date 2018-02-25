import * as React from 'react';

export interface AddModeProps {
  onBlur: () => void,
  icon: string,
  onSubmit: (value: string) => void
}

class AddMode extends React.Component<AddModeProps, any> {

  constructor(props: AddModeProps, context: any) {
    super(props, context);
  }

  render() {
    return (
      <div className="addContainer">
        <div className="treeicon">
          <i className={"fa fa-" + this.props.icon + " fileicon"} aria-hidden="true"></i>
        </div>
        <div className="treerename">
          <input
            autoFocus
            ref="treeinput"
            onBlur={this.props.onBlur}
            onKeyDown={(e) => {
              var nodename = (this.refs.treeinput as HTMLInputElement).value;
              if (e.keyCode == 13) this.props.onSubmit(nodename)
            }}
            type="text" name="" />
        </div>
      </div>
    )
  }
}

export default AddMode;
