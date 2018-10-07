import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { CircularProgress } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

const styles = theme => ({
  container: {
    textAlign: 'center',
    padding: theme.spacing.unit * 4,
  }
});

class LoadingDialog extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Dialog
        open={true}
        aria-labelledby="loading-dialog-title"
        aria-describedby="loading-dialog-description"
        disableBackdropClick
        disableEscapeKeyDown
      >
        {/* <DialogTitle id="loading-dialog-title">Loading...</DialogTitle> */}
        <DialogContent>
          <div className={classes.container}>
            <CircularProgress className={classes.progress} color="secondary" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}


function mapStateToProps(state) {
  return {

  };
}

LoadingDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(LoadingDialog));

