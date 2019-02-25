import { createAction } from 'redux-actions';

export const CREATE_TOAST = 'toaster/CREATE_TOAST';
export const REMOVE_TOAST = 'toaster/REMOVE_TOAST';

const genKey = () => `${Date.now()}${Math.round(Math.random() * 1000)}`;

export const createToast = toast => ({
  type: CREATE_TOAST,
  payload: { key: genKey(), ...toast },
});

export const removeToast = createAction(REMOVE_TOAST);

export const createTemporaryToast = ({ delay = 5000, ...toast }) => (
  dispatch,
  getState,
) => {
  const { key = genKey(), ...restToast } = toast;

  if (!key) {
    return;
  }

  dispatch(createToast({ key, ...restToast }));

  setTimeout(() => {
    dispatch(removeToast(key));
  }, delay);
};

export const createGenericErrorToast = (opts = {}) => dispatch => {
  dispatch(
    createTemporaryToast({
      status: 'danger',
      title: 'Tapahtui virhe',
      description:
        'Jos virhe aiheuttaa ongelmia järjestelmän käytössä, yritä päivittää sivu, tai ota yhteyttä tukeen',
      ...opts,
    }),
  );
};
