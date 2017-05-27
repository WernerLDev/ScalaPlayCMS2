import * as React from 'react';
import * as Tree from '../TreeViewTypes'

export interface DraggableProps {
    className: string
    onContextMenu: (e:React.MouseEvent<HTMLElement>) => void
    item: Tree.TreeViewItem<any>
    onDrop : (source_id:number, target_id:number) => void
}

class Draggable extends React.Component<DraggableProps, any> {

    constructor(props:DraggableProps, context:any) {
        super(props, context);
    }

    onDragStart(e:DragEvent) {
        e.dataTransfer.setData("id", this.props.item.key);
    }

    onDragStop(e:DragEvent) {
        e.preventDefault();
        (this.refs.draggable as HTMLElement).classList.remove("dragover");
        return false;
    }

    onDragOver(e:DragEvent) {
        e.preventDefault();
        (this.refs.draggable as HTMLElement).classList.add("dragover");
        return false;
    }

    onDragLeave(e:DragEvent) {
        e.preventDefault();
        (this.refs.draggable as HTMLElement).classList.remove("dragover");
        return false;
    }

    onDrop(e:DragEvent) {
        (this.refs.draggable as HTMLElement).classList.remove("dragover");
        var targetid = e.dataTransfer.getData("id");
        this.props.onDrop(Number(targetid), Number(this.props.item.key));
    }

    render() {
        return (
            <div
                ref="draggable"
                draggable={true}
                onDragStart={this.onDragStart.bind(this)}
                onDragEnd={this.onDragStop.bind(this)}
                onDragOver={this.onDragOver.bind(this)}
                onDragLeave={this.onDragLeave.bind(this)}
                onDropCapture={this.onDrop.bind(this)}
                className={this.props.className} 
                onContextMenu={this.props.onContextMenu}>
                {this.props.children}
            </div>
        );
    }
}

export default Draggable;
