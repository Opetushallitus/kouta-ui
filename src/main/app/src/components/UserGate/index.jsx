import { useEffect } from 'react';
import { connect } from 'react-redux';

import { update } from '../../state/me';
import { getMe, koutaBackendLogin } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import useTranslation from '../useTranslation';

const getMeAndUpdateSession = async ({ httpClient, apiUrls }) => {
  const me = await getMe({ httpClient, apiUrls });

  await koutaBackendLogin({ httpClient, apiUrls });

  return me;
};

const UserGate = ({ fallback = null, children = null, onUserChange }) => {
  const { data } = useApiAsync({ promiseFn: getMeAndUpdateSession });
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

  return !data ? fallback : children;
};

export default connect(
  null,
  dispatch => ({
    onUserChange: user => dispatch(update(user)),
  }),
)(UserGate);
