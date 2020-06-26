import { Machine, interpret, assign, spawn, forwardTo } from 'xstate';
import { useService } from '@xstate/react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash/fp';
import { isDev } from '#/src/utils';

const DEFAULT_TOAST_DURATION = 5000;

const CLOSE_TOAST = 'CLOSE_TOAST';
const OPEN_TOAST = 'OPEN_TOAST';
const TOAST_MOUSEENTER = 'TOAST_MOUSEENTER';
const TOAST_MOUSELEAVE = 'TOAST_MOUSELEAVE';

const setToastTimer = (key, duration, callback) =>
  setTimeout(() => callback({ type: CLOSE_TOAST, key }), duration);

const createToastActor = (key, duration = DEFAULT_TOAST_DURATION) => (
  callback,
  onReceive
) => {
  let id = setToastTimer(key, duration, callback);

  onReceive(({ type }) => {
    if (type === TOAST_MOUSEENTER) {
      clearTimeout(id);
    } else if (type === TOAST_MOUSELEAVE) {
      id = setToastTimer(key, duration, callback);
    }
  });

  return () => {
    clearTimeout(id);
  };
};

export const toastService = interpret(
  Machine(
    {
      id: 'toastMachine',
      initial: 'empty',
      context: {
        toasts: [],
      },
      states: {
        empty: {},
        showing: {
          on: {
            '': {
              target: 'empty',
              cond: 'noToasts',
            },
            [CLOSE_TOAST]: {
              target: 'showing',
              actions: 'removeToast',
            },
            [TOAST_MOUSEENTER]: {
              actions: 'forwardToToastActor',
            },
            [TOAST_MOUSELEAVE]: {
              actions: 'forwardToToastActor',
            },
          },
        },
      },
      on: {
        [OPEN_TOAST]: {
          target: 'showing',
          actions: 'addToast',
        },
      },
    },
    {
      actions: {
        forwardToToastActor: forwardTo((context, { key }) => key),
        removeToast: assign({
          toasts: (context, { key }) => _.reject({ key }, context.toasts),
        }),
        addToast: assign({
          toasts: (context, { toast }) => {
            const key = toast?.key ?? _.uniqueId('toast_');
            const ownToastProps = _.omit(['ref', 'key']);

            return [
              // Hide all existing toasts, that are visually equal to the new one
              ..._.reject(
                oldToast =>
                  _.isEqual(ownToastProps(oldToast), ownToastProps(toast)),
                context.toasts
              ),
              {
                ...toast,
                key,
                ref: spawn(createToastActor(key, toast?.duration), {
                  name: key,
                }),
              },
            ];
          },
        }),
      },
      guards: {
        noToasts: context => context.toasts.length === 0,
      },
    }
  ),
  {
    devTools: isDev,
  }
).start();

const useToaster = () => {
  const [state, send] = useService(toastService);
  const { t } = useTranslation();

  const openToast = options => send({ type: OPEN_TOAST, toast: options });
  const closeToast = key => send({ type: CLOSE_TOAST, key });
  const toastMouseEnter = key => send({ type: TOAST_MOUSEENTER, key });
  const toastMouseLeave = key => send({ type: TOAST_MOUSELEAVE, key });

  return {
    toasts: state.context.toasts,
    openToast,
    closeToast,
    toastMouseEnter,
    toastMouseLeave,
    openSavingSuccessToast: () =>
      openToast({
        label: t('ilmoitukset.tallennusOnnistui'),
        status: 'success',
      }),
    openSavingErrorToast: () =>
      openToast({
        label: t('ilmoitukset.tallennusEpaonnistui'),
        status: 'danger',
      }),
    openGenericErrorToast: () =>
      openToast({
        label: t('ilmoitukset.tuntematonVirhe'),
        status: 'danger',
      }),
  };
};

export default useToaster;
