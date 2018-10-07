import React, { Component } from 'react';
import Header from './components/Header';
import { connect } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import routes from './routes';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Profile from './components/Profile';
import LoadingDialog from './components/LoadingDialog';
import * as globalAppSelectors from './store/global-app/reducer';
import CenteredContainer from './components/CenteredContainer';
import Attest from './components/Attest';
import AcceptAttestation from './components/AcceptAttestation';
import PublicProfile from './components/PublicProfile';

const styles = theme => ({
  mainContainer: {
    maxWidth: 640,
    // backgroundColor: 'white',

  }
});

export const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: '4px 16px 4px 16px'
      }
    }
  }
});

class App extends Component {

  render() {

    return (
      <React.Fragment>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <div className="App">
              {this.props.isLoading && <LoadingDialog />}

              <Header />
              <CenteredContainer>
                <Route exact path={routes.HOME()} component={Profile} />
                <Route exact path={routes.PROFILE()} component={Profile} />
                <Route exact path={routes.ATTEST()} component={Attest} />
                <Route exact path={routes.ACCEPT_ATTESTATION()} component={AcceptAttestation} />
                <Route exact path={routes.PUBLIC_PROFILE()} component={PublicProfile} />

              </CenteredContainer>
            </div>
          </MuiThemeProvider>
        </BrowserRouter>
      </React.Fragment >
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoading: globalAppSelectors.isLoading(state),
  };
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(App));
