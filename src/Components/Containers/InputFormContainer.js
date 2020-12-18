import {connect} from 'react-redux';
import {submitForm} from '../../store/actions';
import InputForm from '../UI/InputForm';

const mapStateToProps = (state) => {
  return {
    arrayOfUrls: state.arrayOfUrls,
    hasErrored: state.tracksHasErrored,
    isLoading: state.tracksIsFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitForm: (input) => dispatch(submitForm(input)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InputForm);
