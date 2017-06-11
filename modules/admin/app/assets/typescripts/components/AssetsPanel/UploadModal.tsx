import * as React from 'react';
import { Button, Header, Image, Modal, Progress } from 'semantic-ui-react'
import * as Api from '../../api/Api'
import { AjaxUpload } from '../../api/ApiBase'
import SingleUpload from './SingleUpload'

export interface UploadModalProps {
  onClose: () => void
  parent_id : number,
  onUploadFinished : (progress:number) => void
}

export interface UploadModalState {
  progress : number,
  numFiles : number,
  files: FileList
}

class UploadModal extends React.Component<UploadModalProps, UploadModalState> {

    constructor(props:UploadModalProps, context:any) {
      super(props, context);
      this.state = { progress: 0, numFiles: 0, files: null }
    }

    onDragOver(e:DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        let uploadbtn = this.refs.uploadbtn as HTMLElement;
        uploadbtn.classList.add("fileover");
    }

    onDragLeave(e:DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        let uploadbtn = this.refs.uploadbtn as HTMLElement;
        uploadbtn.classList.remove("fileover");
    }

    onDrop(e:DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        var droppedFiles = e.dataTransfer.files;
        let uploadbtn = this.refs.uploadbtn as HTMLElement;
        uploadbtn.classList.remove("fileover");
        this.doUpload(droppedFiles);
    }

    uploadFile(file:File):Promise<Api.UploadResult> {
        return new Promise(function(resolve, error){
            AjaxUpload(file, (p:number) => {
                console.log("Progress is " + p)
            }, (r:Api.UploadResult) => {
                console.log("finished, resolving promise");
                resolve(r);
            }, (msg:string) => {
                error(msg);
            })

        })
    }

    createAsset(result:Api.UploadResult) {
        Api.addAsset(this.props.parent_id, result.name, result.server_path, result.contenttype).then(x => {
            this.setState({ progress: this.state.progress + 1 }, () => {
                setTimeout(() => {
                    this.props.onUploadFinished(this.state.progress / (this.state.numFiles / 100));
                },300);
            })
        })
    }

    uploadFiles(current:number, files:FileList) {
        this.uploadFile(files[current]).then(x => {
            if(current < files.length - 1) {
              this.uploadFiles(current + 1, files);
            }
        })
    }

    doUpload(files:FileList) {
        this.setState({ progress: 0, numFiles: files.length, files: files }, () => {
        });
    }

    renderUploadForm() {
      return(
        <div className="uploadDialog">
              <form
                  onDragOver={this.onDragOver.bind(this)}
                  onDragLeave={this.onDragLeave.bind(this)}
                  onDropCapture={this.onDrop.bind(this)}
              >
                <label ref="uploadbtn" className="uploadbtn">
                    <input multiple
                        type="file"
                        id="file-select"
                        name="asset[]"
                        onChange={(e) => {
                            var files = e.currentTarget.files;
                            this.doUpload(files);
                        }} />
                        <span><i className="fa fa-upload" aria-hidden="true"></i><br />Drop files here or click to Select files from your computer</span>
                    </label>
                  </form>
          </div>
      )
    }

    renderProgres() {
        return(
            <div>
                {[].map.call(this.state.files, (file:File) => (
                    <SingleUpload 
                        key={file.name}
                        file={file}
                        onFinished={(result:Api.UploadResult) => {
                            this.createAsset(result);
                        }}
                    />
                ))}
                <hr />
                {"Finished " + this.state.progress + " of " + this.state.numFiles + " files"}
            </div>
        )
    }

    render() {
        return (
          <Modal onClose={this.props.onClose} open={true}>
            <Modal.Header>Upload Assets</Modal.Header>
            <Modal.Content>
              {this.state.numFiles == 0 ? this.renderUploadForm() : this.renderProgres() }
            </Modal.Content>
          </Modal>
        );
    }
}

export default UploadModal;
