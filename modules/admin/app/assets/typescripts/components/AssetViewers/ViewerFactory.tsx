import * as React from 'react'
import { ImageViewer } from './ImageViewer'
import TextViewer from './TextViewer'
import FolderViewer from './FolderViewer'
import * as Api from '../../api/Api'
import * as fbemmiter from 'fbemitter'

export default function (asset: Api.Asset, emitter: fbemmiter.EventEmitter) {

  if (asset.mimetype.startsWith("image")) {
    return (<ImageViewer asset={asset} emitter={emitter} />)
  } else if (asset.mimetype == "text/plain") {
    return (<TextViewer asset={asset} emitter={emitter} />)
  } else if (asset.mimetype == "folder") {
    return <FolderViewer folder={asset} emitter={emitter} />
  } else {
    return (<div>Invalid asset type</div>)
  }

}