
export function getAssetIcon(mimetype:string) {
    switch(mimetype) {
        case "home":
            return "home"
        case "folder":
           return "folder"
        case "image/jpeg":
            return "file-image-o"
        case "text/plain":
            return "file-text-o"
        case "application/pdf":
            return "file-pdf-o"
        default:
            return "file-o"
    }
}