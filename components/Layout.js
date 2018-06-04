import * as types from './types';
import MaterialRoot from './MaterialRoot';
import Header from './Header';

function Layout(props) {
  return (
    <MaterialRoot>
      <Header />
      {props.children}
    </MaterialRoot>
  );
}
Layout.propTypes = {
  children: types.children.isRequired,
};

export default Layout;
