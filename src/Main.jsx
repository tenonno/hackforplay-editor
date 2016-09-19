import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


import {Model} from './LoosePostmate';
import Dock from './Dock';
import Menu from './Menu';
import Pane from './Pane';

import SaveDialog from './SaveDialog';

export default class Main extends Component {
  constructor(props) {
    super(props);

    new Model({
      view: this.getViewState
    }).then(parent => {
      this.parent = parent;
      const {align, edge, files} = parent.model;
      this.setState({align, edge, files});
    });

    this.state = {
      align: '',
      edge: { x: 0, y: 0 },
      files: [],

      saveFile: null
    };
  }

  setDockSize = ({x, y}) => {
    const edge = {
      x: typeof x === 'number' ? x : this.state.edge.x,
      y: typeof y === 'number' ? y : this.state.edge.y
    };
    this.setState({edge}, this.renderRequest);
  }

  setDockAlign = (align) => {
    this.setState({align}, this.renderRequest);
  }

  updateFile = (index, file) => {
    const files = this.state.files.map((item, i) => index === i ? file : item);
    this.setState({files});
  }

  runRequest = () => {
    if (!this.parent) return;
    this.parent.emit('run', this.state.files);
  }

  renderRequest = () => {
    if (!this.parent) return;
    this.parent.emit('render', this.getViewState());
  }

  getViewState = () => {
    const {align, edge} = this.state;
    return {align, edge};
  }

  openSaveDialog = (saveFile) => {
    this.setState({ saveFile });
  }

  closeSaveDialog = () => {
    this.setState({ saveFile: null });
  }

  render() {
    const { align, edge, files, saveFile } = this.state;

    return (
      <MuiThemeProvider>
        <Dock align={align} edge={edge} setDockSize={this.setDockSize}>
          <SaveDialog
            open={!!saveFile}
            file={saveFile}
            onRequestClose={this.closeSaveDialog}
          />
          <Menu
            align={align}
            files={files}
            setDockAlign={this.setDockAlign}
            runRequest={this.runRequest}
            openSaveDialog={this.openSaveDialog}
            style={{ flex: '0 0 auto' }}
          />
          <Pane
            files={files}
            updateFile={this.updateFile}
            style={{ flex: '1 1 auto' }}
          />
        </Dock>
      </MuiThemeProvider>
    );
  }
}

Main.propTypes = {
};
