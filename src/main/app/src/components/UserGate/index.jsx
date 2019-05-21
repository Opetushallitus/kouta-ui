import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { update } from '../../state/me';
import { getMe } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import useTranslation from '../useTranslation';
import AuthorizedUserContext from '../AuthorizedUserContext';

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
  }, [data, i18n, onUserChange]);

  return !data ? (
    fallback
  ) : (
    <AuthorizedUserContext.Provider value={data}>
      {children}
    </AuthorizedUserContext.Provider>
  );
};

export default connect(
  null,
  dispatch => ({
    onUserChange: user => dispatch(update(user)),
  }),
)(UserGate);
