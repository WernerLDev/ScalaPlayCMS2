import {ApiErrorInfo} from './ApiError'
import ApiError from './ApiError'
import { UploadResult } from './AssetsApi'

var csrf = document.getElementById("csrftoken").innerText;

type ApiHeader = {
    "Csrf-Token" : string,
    "Content-Type"? : string
}

type ApiParams = {
    method: string,
    credentials : RequestCredentials,
    headers: ApiHeader,
    body?:any 
}

export default function ApiCall(call:string, method:string, body?:Object, contenttype?:string):Promise<any> {
    var headers:ApiHeader = {
            "Csrf-Token": csrf
    }
    if(contenttype != null && contenttype != "none"){
        headers["Content-Type"] = contenttype;
    } else if(contenttype == null) {
        headers["Content-Type"] = "application/json";
    }
    var params:ApiParams = {
        method: method,
        credentials : "include",
        headers: headers 
    }

    if( (method != "GET" && method != "HEAD") && body != null) {
        params["body"] = body;
    }

    return fetch(call, params).then(response => {
        if(!response.ok) {
            return response.text().then(r => {
                let info:ApiErrorInfo = {
                    errorCode : response.status,
                    method : method,
                    params : body == null ? "{}" : body.toString(),
                    responseBody : r,
                    statusText : response.statusText,
                    url : call
                }
                ApiError(info);
                return response;
            });
        }
        return response;
    }).then(r => {
        if(r.ok) {
            if(contenttype == "text/plain") {
                return r.text();
            } else {
                return r.json();
            }
        } else {
            return r;
        }
    });
}

export function AjaxUpload(file:File, onProgress:(p:number) => void, onFinished:(r:UploadResult) => void, onError:(r:string) => void) {

    let xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e:ProgressEvent) => {
        let done = e.loaded;
        let total = e.total;
        onProgress(Math.floor(done/total*1000)/10);
    }

    xhr.onreadystatechange = (e:Event) => {
        if(xhr.readyState == 4) {
            if(xhr.status == 200) {
                onFinished(JSON.parse(xhr.responseText));
            } else {
                ApiError({
                    errorCode: xhr.status,
                    method: "POST",
                    params: JSON.stringify({
                        asset: {
                            name: file.name,
                            contenttype: file.type,
                            size: file.size
                        }
                    }),
                    responseBody: xhr.responseText,
                    statusText: xhr.statusText,
                    url: "/admin/api/v1/assets/upload"
                })
            }
        }
    }

    xhr.upload.onerror = (e:Event) => {
        onError("Something went wrong");
    }

    xhr.open('POST', "/admin/api/v1/assets/upload", true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Csrf-Token", csrf);
    let formData = new FormData();
    formData.append("asset", file);
    xhr.send(formData)
}