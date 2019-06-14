import { createAction } from 'redux-actions';

import { isNumber } from '../../utils';

export const OPEN_TOAST = 'toaster/OPEN_TOAST';
export const CLOSE_TOAST = 'toaster/CLOSE_TOAST';

const genKey = () => `${Date.now()}${Math.round(Math.random() * 1000)}`;

export const openToastWithKey = createAction(OPEN_TOAST);
export const closeToast = createAction(CLOSE_TOAST);

export const openToast = ({
  title,
  description,
  duration = 5000,
  status,
  key: keyArg,
} = {}) => dispatch => {
  const key = keyArg || genKey();

  dispatch(openToastWithKey({ title, description, status, key }));

  if (isNumber(duration) && duration > 0) {
    setTimeout(() => {
      dispatch(closeToast(key));
    }, duration);
  }
};

export const openSavingErrorToast = () => (
  dispatch,
  getState,
  { localisation },
) => {
  return dispatch(
    openToast({
      title: localisation.t('yleiset.tallennusEpaonnistui'),
      description: localisation.t('yleiset.tarkistaLomakkeenTiedot'),
      status: 'danger',
    }),
  );
};

export const openSavingSuccessToast = () => (
  dispatch,
  getState,
  { localisation },
) => {
  return dispatch(
    openToast({
      title: localisation.t('yleiset.tallennusOnnistui'),
      status: 'success',
    }),
  );
};

export const openGenericErrorToast = () => (
  dispatch,
  getState,
  { localisation },
) => {
  return dispatch(
    openToast({
      title: localisation.t('yleiset.virheilmoitus'),
      description: localisation.t('yleiset.virheilmoitusKuvaus'),
      status: 'danger',
    }),
  );
};
