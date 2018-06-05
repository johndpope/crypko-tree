import { withStyles } from '@material-ui/core/styles';
import * as types from '../util/types';
import withRoot from '../util/withRoot';

const styles = {
  root: {
    textAlign: 'center',
  },
};

function MaterialRoot(props) {
  const { classes } = props;
  return <div className={classes.root}>{props.children}</div>;
}
MaterialRoot.propTypes = {
  classes: types.classes.isRequired,
  children: types.children.isRequired,
};

export default withRoot(withStyles(styles)(MaterialRoot));
