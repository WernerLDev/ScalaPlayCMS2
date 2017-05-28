import {ApiErrorInfo} from './ApiError'
import ApiError from './ApiError'

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

export default function ApiCall(call:string, method:string, body?:Object, contenttype?:string) {
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
            return r.json();
        } else {
            return r;
        }
    });
}
