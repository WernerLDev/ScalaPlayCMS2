import * as React from 'react';
import { Progress } from 'semantic-ui-react'
import { AjaxUpload } from '../../api/ApiBase'
import * as Api from '../../api/Api'

export interface SingleUploadProps {
    file:File
    onFinished: (result:Api.UploadResult) => void
}

export interface SingleUploadState {
    progress: number
}

class SingleUpload extends React.Component<SingleUploadProps, SingleUploadState> {

    constructor(props:SingleUploadProps, context:any) {
        super(props, context);
        this.state = { progress: 0 }
    }

    componentDidMount() {
        AjaxUpload(this.props.file, (p:number) => {
            this.setState({ progress: p })
        }, (r:Api.UploadResult) => {
            this.props.onFinished(r);
        }, (msg:string) => {
            console.log("Error: " + msg);
        })
    }

    render() {
        return (
            <Progress 
                percent={this.state.progress}
                active
                autoSuccess
                indicating
                size="small"
                label={this.props.file.name}
                className="uploadProgress"
            />
        );
    }
}

export default SingleUpload;
