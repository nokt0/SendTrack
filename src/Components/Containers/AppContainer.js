import {connect} from 'react-redux';
import App from '../../App';

const mapStateToProps = (state) => {
  return {
    background: state.background,
    inputInfo : state.inputInfo
  };
};


export default connect(mapStateToProps)(App);
