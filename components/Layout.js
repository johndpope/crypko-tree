import * as types from './types';
import MaterialRoot from './MaterialRoot';

function Header() {
  return <div>hoge</div>;
}

export default function Layout(props) {
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
