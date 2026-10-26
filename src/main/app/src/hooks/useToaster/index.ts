import { useSelector } from '@xstate/react';
import { isEqual, omit, reject, uniqueId } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import {
  createActor,
  forwardTo,
  fromCallback,
  setup,
  type ActorRefFrom,
} from 'xstate';

import { inspect } from '#/src/utils/xstateInspector';

const DEFAULT_TOAST_DURATION = 5000;

const CLOSE_TOAST = 'CLOSE_TOAST';
const OPEN_TOAST = 'OPEN_TOAST';
const TOAST_MOUSEENTER = 'TOAST_MOUSEENTER';
const TOAST_MOUSELEAVE = 'TOAST_MOUSELEAVE';

type ToastTimerEvent =
  | { type: typeof TOAST_MOUSEENTER }
  | { type: typeof TOAST_MOUSELEAVE };

const toastTimerLogic = fromCallback<
  ToastTimerEvent,
  { key: string; duration: number }
>(({ input, sendBack, receive }) => {
  const startTimer = () =>
    setTimeout(
      () => sendBack({ type: CLOSE_TOAST, key: input.key }),
      input.duration
    );

  let timerId = startTimer();

  receive(event => {
    if (event.type === TOAST_MOUSEENTER) {
      clearTimeout(timerId);
    } else if (event.type === TOAST_MOUSELEAVE) {
      timerId = startTimer();
    }
  });

  return () => {
    clearTimeout(timerId);
  };
});

type Toast = {
  key?: string;
  duration?: number;
  ref?: ActorRefFrom<typeof toastTimerLogic>;
  [key: string]: unknown;
};

type OpenToastEvent = { type: 'OPEN_TOAST'; toast: Toast };
type CloseToastEvent = { type: 'CLOSE_TOAST'; key: string };
type ToastMouseEnterEvent = { type: 'TOAST_MOUSEENTER'; key: string };
type ToastMouseLeaveEvent = { type: 'TOAST_MOUSELEAVE'; key: string };

type ToastEvent =
  | OpenToastEvent
  | CloseToastEvent
  | ToastMouseEnterEvent
  | ToastMouseLeaveEvent;

interface ToastContext {
  toasts: Array<Toast>;
}

const machineSetup = setup({
  types: {
    context: {} as ToastContext,
    events: {} as ToastEvent,
  },
  actors: {
    toastTimer: toastTimerLogic,
  },
  guards: {
    noToasts: ({ context }) => context.toasts.length === 0,
  },
});

const toastMachine = machineSetup.createMachine({
  id: 'toastMachine',
  initial: 'empty',
  context: {
    toasts: [],
  },
  states: {
    empty: {},
    showing: {
      always: {
        target: 'empty',
        guard: 'noToasts',
      },
      on: {
        [CLOSE_TOAST]: {
          target: 'showing',
          actions: machineSetup.assign({
            toasts: ({ context, event }) =>
              reject(context.toasts, { key: (event as CloseToastEvent).key }),
          }),
        },
        [TOAST_MOUSEENTER]: {
          actions: forwardTo(
            ({ event }) => (event as ToastMouseEnterEvent).key
          ),
        },
        [TOAST_MOUSELEAVE]: {
          actions: forwardTo(
            ({ event }) => (event as ToastMouseLeaveEvent).key
          ),
        },
      },
    },
  },
  on: {
    [OPEN_TOAST]: {
      target: '.showing',
      actions: machineSetup.assign({
        toasts: ({ context, event, spawn }) => {
          const { toast } = event as OpenToastEvent;
          const key = toast?.key ?? uniqueId('toast_');
          const ownToastProps = obj => omit(obj, ['ref', 'key']);

          return [
            // Hide all existing toasts, that are visually equal to the new one
            ...reject(context.toasts, oldToast =>
              isEqual(ownToastProps(oldToast), ownToastProps(toast))
            ),
            {
              ...toast,
              key,
              ref: spawn('toastTimer', {
                id: key,
                input: {
                  key,
                  duration: toast?.duration ?? DEFAULT_TOAST_DURATION,
                },
              }),
            },
          ];
        },
      }),
    },
  },
});

export const toastService = createActor(
  toastMachine,
  inspect ? { inspect } : undefined
).start();

export const useToaster = () => {
  const toasts = useSelector(toastService, s => s.context.toasts);
  const { t } = useTranslation();

  const openToast = options =>
    toastService.send({ type: OPEN_TOAST, toast: options });
  const closeToast = key => toastService.send({ type: CLOSE_TOAST, key });
  const toastMouseEnter = key =>
    toastService.send({ type: TOAST_MOUSEENTER, key });
  const toastMouseLeave = key =>
    toastService.send({ type: TOAST_MOUSELEAVE, key });

  return {
    toasts,
    openToast,
    closeToast,
    toastMouseEnter,
    toastMouseLeave,
    openSavingSuccessToast: () =>
      openToast({
        label: t('ilmoitukset.tallennusOnnistui'),
        status: 'success',
      }),
    openSavingErrorToast: error =>
      openToast({
        label: t('ilmoitukset.tallennusEpaonnistui'),
        status: 'danger',
        error,
      }),
    openGenericErrorToast: () =>
      openToast({
        label: t('ilmoitukset.tuntematonVirhe.viesti'),
        status: 'danger',
      }),
    openWarningToast: warning =>
      openToast({
        label: t(warning),
        status: 'warning',
        duration: 10000,
        warning,
      }),
  };
};

export default useToaster;
