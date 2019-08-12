import React, { useEffect } from 'react';

import { getMe } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import useTranslation from '../useTranslation';
import AuthorizedUserContext from '../AuthorizedUserContext';

const UserGate = ({ fallback = null, children = null }) => {
  const { data } = useApiAsync({ promiseFn: getMe });
  const { i18n } = useTranslation();

  useEffect(() => {
    if (data && data.lang) {
      i18n.changeLanguage(data.lang);
    }
  }, [data, i18n]);

  return !data ? (
    fallback
  ) : (
    <AuthorizedUserContext.Provider value={data}>
      {children}
    </AuthorizedUserContext.Provider>
  );
};

export default UserGate;
