import {connect} from 'react-redux';
import LinksBlock from '../UI/LinksBlock';

const mapStateToProps = (state) => {
  return {
    arrayOfUrls: {...state.fetchSuccess},
  };
};


export default connect(mapStateToProps)(LinksBlock);
