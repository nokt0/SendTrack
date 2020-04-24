import {connect} from 'react-redux';
import App from '../../App';

const mapStateToProps = (state) => {
  return {
    background: state.background,
  };
};


export default connect(mapStateToProps)(App);
