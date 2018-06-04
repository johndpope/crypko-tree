import { withStyles } from '@material-ui/core/styles';
import * as types from './types';
import withRoot from '../util/withRoot';

const styles = (theme) => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

function MaterialRoot(props) {
  const { classes } = props;
  return <div className={classes.root}>{props.children}</div>;
}
MaterialRoot.propTypes = {
  classes: types.string.isRequired,
  children: types.children.isRequired,
};

export default withRoot(withStyles(styles)(MaterialRoot));
