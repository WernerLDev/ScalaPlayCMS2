import { ApiErrorInfo } from './ApiError'
import ApiError from './ApiError'
import { UploadResult } from './AssetsApi'

var csrf = document.getElementById("csrftoken").innerText;

type ApiHeader = {
  "Csrf-Token": string,
  "Content-Type"?: string
}

type ApiParams = {
  method: string,
  credentials: RequestCredentials,
  headers: Headers,
  body?: any
}

type RequestMethod = "GET" | "POST" | "PUT" | "HEAD" | "PATCH" | "DELETE"

/**
 * Abstraction layer around the fetch method to make Api calls easier.
 * This function automatically handles errors by displaying a Modal with some information about the call.
 * 
 * @export
 * @param {string} call 
 * @param {RequestMethod} method 
 * @param {string} [body]  Use the result of JSON.stringify for the body.
 * @param {string} [contenttype] 
 * @returns {Promise<T>} 
 */
export default function ApiCall<T>(
  call: string,
  method: RequestMethod,
  body?: string,
  contenttype?: string
): Promise<T> {
  var headers: ApiHeader = {
    "Csrf-Token": csrf
  }
  if (contenttype != null && contenttype != "none") {
    headers["Content-Type"] = contenttype;
  } else if (contenttype == null) {
    headers["Content-Type"] = "application/json";
  }
  var params: ApiParams = {
    method: method,
    credentials: "include",
    headers: new Headers(headers)
  }

  if ((method != "GET" && method != "HEAD") && body != null) {
    params["body"] = body;
  }

  return fetch(call, params).then(response => {
    if (!response.ok) {
      return response.text().then(r => {
        let info: ApiErrorInfo = {
          errorCode: response.status,
          method: method,
          params: body == null ? "{}" : body.toString(),
          responseBody: r,
          statusText: response.statusText,
          url: call
        }
        ApiError(info);
        return {};
      });
    } else {
      if (contenttype == "text/plain") {
        return response.text();
      } else {
        return response.json();
      }
    }
  }).catch(x => {
    alert("Trouble connecting to the host. Host is down or you're not connected to the internet anymore.");
    return x;
  });
}


/**
 * Performs file upload by making use of the XMLHttpRequest object. onProgress is triggered multiple times during the upload to allow you to draw a progressbar.
 * 
 * @export
 * @param {File} file 
 * @param {(p:number) => void} onProgress 
 * @param {(r:UploadResult) => void} onFinished 
 * @param {(r:string) => void} onError 
 */
export function AjaxUpload(file: File, onProgress: (p: number) => void, onFinished: (r: UploadResult) => void, onError: (r: string) => void) {

  let xhr = new XMLHttpRequest();

  xhr.upload.onprogress = (e: ProgressEvent) => {
    let done = e.loaded;
    let total = e.total;
    onProgress(Math.floor(done / total * 1000) / 10);
  }

  xhr.onreadystatechange = (e: Event) => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
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

  xhr.upload.onerror = (e: Event) => {
    onError("Something went wrong");
  }

  xhr.open('POST', "/admin/api/v1/assets/upload", true);
  xhr.withCredentials = true;
  xhr.setRequestHeader("Csrf-Token", csrf);
  let formData = new FormData();
  formData.append("asset", file);
  xhr.send(formData)
}