import * as React from 'react';
import * as Api from '../../api/Api'
import { Grid, Image, Menu, Segment, Icon, Table } from 'semantic-ui-react'


export interface FolderViewerProps {
    folder:Api.Asset
}

export interface FolderViewState {
    childs:Api.Asset[]
    viewmode : "list" | "grid"
}

class FolderViewer extends React.Component<FolderViewerProps, FolderViewState> {

    constructor(props:FolderViewerProps, context:any) {
        super(props, context);
        this.state = { childs: [], viewmode: "grid" }
    }

    componentDidMount() {
        Api.getAssetChilds(this.props.folder.id).then(assets => {
            this.setState({ childs: assets })
        })
    }

    switchViewMode(mode: "list" | "grid") {
        this.setState({ viewmode: mode })
    }

    renderGrid() {
        return(
            <Grid celled>
                <Grid.Row columns={5}>
                    {this.state.childs.map(a => (
                        <Grid.Column key={a.id}>
                            <Image src={"/admin/uploads" + a.path} />
                        </Grid.Column>
                    ))}
                </Grid.Row>
            </Grid>
        )
    }

    renderList() {
        return(
            <Table striped sortable>
                <Table.Header>
                    <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Size</Table.HeaderCell>
                    <Table.HeaderCell>Mimetype</Table.HeaderCell>
                    <Table.HeaderCell textAlign="right">Thumbnail</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                {this.state.childs.map(a => (
                    <Table.Row key={a.id} verticalAlign="middle">
                        <Table.Cell>{a.id}</Table.Cell>
                        <Table.Cell>{a.name}</Table.Cell>
                        <Table.Cell>{a.filesize}</Table.Cell>
                        <Table.Cell>{a.mimetype}</Table.Cell>
                        <Table.Cell textAlign="right"><Image floated="right" height={100} src={"/admin/uploads" + a.path} /></Table.Cell>
                    </Table.Row>
                ))}
                </Table.Body>
                 <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='3'>
                        <Menu floated='right' pagination>
                            <Menu.Item as='a' icon>
                            <Icon name='left chevron' />
                            </Menu.Item>
                            <Menu.Item as='a'>1</Menu.Item>
                            <Menu.Item as='a'>2</Menu.Item>
                            <Menu.Item as='a'>3</Menu.Item>
                            <Menu.Item as='a'>4</Menu.Item>
                            <Menu.Item as='a' icon>
                            <Icon name='right chevron' />
                            </Menu.Item>
                        </Menu>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
        </Table>
        )
    }

    render() {
        return (
        <div>
            <Segment className="toolbar" inverted>
                <Menu inverted size="tiny">
                    <Menu.Item name='list' active={this.state.viewmode == "list"} onClick={() => this.switchViewMode("list")}>
                        <Icon name='list' />
                    </Menu.Item>
                    <Menu.Item name='grid' active={this.state.viewmode == "grid"} onClick={() => this.switchViewMode("grid")}>
                        <Icon name='grid layout' />
                    </Menu.Item>
                </Menu>
            </Segment>
            <div className="asset-wrapper">
                {this.state.viewmode == "grid" ? this.renderGrid() : this.renderList()}
            </div>
        </div>
        );
    }
}

export default FolderViewer;
