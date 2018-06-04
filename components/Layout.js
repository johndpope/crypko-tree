import * as types from './types';

function Header() {
  return (
    <div>
      Header
      <style jsx>{`
        div {
          background-color: slategray;
          height: 100px;
        }
      `}</style>
    </div>
  );
}

export default function Layout(props) {
  return (
    <div>
      <Header />
      {props.children}
    </div>
  );
}

Layout.propTypes = {
  children: types.children.isRequired,
};
