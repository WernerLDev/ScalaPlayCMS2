import * as React from 'react';
import * as Api from '../../api/Api'
import { Grid, Image, Menu, Segment, Icon, Table } from 'semantic-ui-react'
import * as fbemmiter from 'fbemitter'


export interface FolderViewerProps {
  folder: Api.Asset
  emitter: fbemmiter.EventEmitter
}

export interface FolderViewState {
  childs: Api.Asset[]
  viewmode: "list" | "grid"
}



class FolderViewer extends React.Component<FolderViewerProps, FolderViewState> {

  constructor(props: FolderViewerProps, context: any) {
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
    return (
      <div className="asset-wrapper">
        <Grid celled>
          <Grid.Row columns={5}>
            {this.state.childs.map(a => (
              <Grid.Column key={a.id}>
                <Image src={"/admin/uploads" + a.path} />
              </Grid.Column>
            ))}
          </Grid.Row>
        </Grid>
      </div>
    )
  }



  renderList() {
    return (
      <div>
        <div className="table-head">
          <Table striped sortable>
            <Table.Header className="tablehead">
              <Table.Row>
                <Table.HeaderCell width="2">ID</Table.HeaderCell>
                <Table.HeaderCell width="2">Name</Table.HeaderCell>
                <Table.HeaderCell width="2">Size</Table.HeaderCell>
                <Table.HeaderCell width="2">Mimetype</Table.HeaderCell>
                <Table.HeaderCell width="2" textAlign="right">Thumbnail</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          </Table>
        </div>
        <div className="table-body">
          <Table className="table--fixed" striped sortable>
            <Table.Header className="tablehead">
              <Table.Row>
                <Table.HeaderCell width="2">ID</Table.HeaderCell>
                <Table.HeaderCell width="2">Name</Table.HeaderCell>
                <Table.HeaderCell width="2">Size</Table.HeaderCell>
                <Table.HeaderCell width="2">Mimetype</Table.HeaderCell>
                <Table.HeaderCell width="2" textAlign="right">Thumbnail</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.childs.map(a => (
                <Table.Row key={a.id} verticalAlign="middle">
                  <Table.Cell>{a.id}</Table.Cell>
                  <Table.Cell>{a.name}</Table.Cell>
                  <Table.Cell>{a.filesize}</Table.Cell>
                  <Table.Cell>{a.mimetype}</Table.Cell>
                  <Table.Cell textAlign="right"><Image floated="right" height={100} width="2" src={"/admin/uploads" + a.path} /></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>

          </Table>
        </div>
        <div className="table-footer">
          <Menu floated='right' pagination>
            <Menu.Item as='a' icon>
              <Icon name='chevron left' />
            </Menu.Item>
            <Menu.Item as='a'>1</Menu.Item>
            <Menu.Item as='a'>2</Menu.Item>
            <Menu.Item as='a'>3</Menu.Item>
            <Menu.Item as='a'>4</Menu.Item>
            <Menu.Item as='a' icon>
              <Icon name='chevron right' />
            </Menu.Item>
          </Menu>
        </div>
      </div>
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
        {this.state.viewmode == "grid" ? this.renderGrid() : this.renderList()}

      </div>
    );
  }
}

export default FolderViewer;
