import * as React from 'react'
import { ImageViewer } from './ImageViewer'
import TextViewer from './TextViewer'
import * as Api from '../../api/Api'


export default function(asset:Api.Asset) {

    if(asset.mimetype.startsWith("image")) {
        return (<ImageViewer asset={asset} />)
    } else if(asset.mimetype == "text/plain") {
        return (<TextViewer asset={asset} />)
    } else {
        return(<div>Invalid asset type</div>)
    }

}