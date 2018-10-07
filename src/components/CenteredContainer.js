import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    mainContainer: {
        maxWidth: 640,

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing.unit * (2),
        },
        [theme.breakpoints.up('md')]: {
            marginTop: theme.spacing.unit * (2),
        },
        // marginTop: theme.spacing.unit * (8 + 5),
        marginBottom: theme.spacing.unit * 3,
        // marginLeft: theme.spacing.unit,
        // marginRight: theme.spacing.unit,
        // backgroundColor: "white",
        // margin: '0 auto',
        // minHeight: '100%',
        // height: '100%',
        // paddingTop: theme.spacing.unit * 3,
        // paddingBottom: theme.spacing.unit * 3,
        // paddingLeft: theme.spacing.unit * 3,
        // paddingRight: theme.spacing.unit * 3,


    },
    footer: {
        paddingBottom: theme.spacing.unit * 2,
    },
    greenText: {
        color: theme.palette.primary.main
    },

});

class CenteredContainer extends Component {
    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Grid container justify="center" >

                    <Grid item xs={12} className={classes.mainContainer}>
                        {this.props.children}
                    </Grid>
                    <Grid item xs={12} className={classes.footer}>
                        <Typography variant="caption" align="center" >#buidl with <span className={classes.greenText}>&hearts;</span> at ETHSanFrancisco</Typography>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}


function mapStateToProps(state) {
    return {

    };
}

CenteredContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(CenteredContainer));

