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

function handleErrors(response:Response) {
    if(!response.ok) {
        response.text().then(r => {
            //ApiError(response.status, response.statusText, r);
            alert(response.status + " - " + response.statusText + "\n" + r);
        });
        //throw Error(response.statusText);
    } else {
        return response
    }
}

export default function ApiCall(call:string, method:string, body?:Object, contenttype?:string) {
    var headers:ApiHeader = {
            "Csrf-Token": csrf
    }
    if(contenttype != null){
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

    return fetch(call, params).then(handleErrors).then(r => r.json());
}
