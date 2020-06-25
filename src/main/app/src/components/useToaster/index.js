import { Machine, interpret, assign, spawn } from 'xstate';
import { useService } from '@xstate/react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { isDev } from '#/src/utils';

const DEFAULT_TOAST_DURATION = 5000;

const noToasts = (context, event) => context.toasts.length === 0;

const durationTimeout = (
  key,
  duration = DEFAULT_TOAST_DURATION
) => callback => {
  const id = setTimeout(() => callback({ type: 'CLOSE_TOAST', key }), duration);

  return () => {
    clearTimeout(id);
  };
};

export const toastService = interpret(
  Machine({
    initial: 'empty',
    context: {
      toasts: [],
    },
    states: {
      empty: {},
      showing: {
        on: {
          CLOSE_TOAST: [
            {
              actions: assign({
                toasts: (context, event) =>
                  _.filter(context.toasts, toast => toast.key !== event.key),
              }),
            },
            {
              target: 'empty',
              cond: noToasts,
            },
          ],
        },
      },
    },
    on: {
      OPEN_TOAST: {
        target: 'showing',
        actions: assign({
          toasts: (ctx, event) => {
            const key = event?.toast?.key ?? _.uniqueId('toast_');
            const toast = {
              ...event.toast,
              key,
              ref: spawn(durationTimeout(key, event?.toast?.duration)),
            };
            return [...ctx.toasts, toast];
          },
        }),
      },
    },
  }),
  { devTools: isDev }
).start();

const useToaster = () => {
  const [state, send] = useService(toastService);
  const { t } = useTranslation();

  const openToast = options => send({ type: 'OPEN_TOAST', toast: options });
  const closeToast = key => send({ type: 'CLOSE_TOAST', key });

  return {
    toasts: state.context.toasts,
    openToast,
    closeToast,
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
