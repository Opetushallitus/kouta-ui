import { useEffect } from 'react';
import { connect } from 'react-redux';

import { update } from '../../state/me';
import { getMe } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import useTranslation from '../useTranslation';

const UserGate = ({ fallback = null, children = null, onUserChange }) => {
  const { data } = useApiAsync({ promiseFn: getMe });
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!data) {
      return;
    }

    if (data.lang) {
      i18n.changeLanguage(data.lang);
    }

    onUserChange(data);
  }, [data]);

  return !data ? fallback : children;
};

export default connect(
  null,
  dispatch => ({
    onUserChange: user => dispatch(update(user)),
  }),
)(UserGate);
