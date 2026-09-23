import { type TFunction } from 'i18next';
import { isError } from 'lodash-es';
import { assign, fromPromise, setup } from 'xstate';

export interface ImageUploadContext {
  file?: File | null;
  url?: string | null;
  error?: string | null;
}

export type ImageUploadEvent =
  | { type: 'UPLOAD_FILE'; files: Array<File> }
  | { type: 'REMOVE_FILE' }
  | { type: 'RESET' }
  | { type: 'DRAG_START' }
  | { type: 'DRAG_STOP' };

export const actionTypes = {
  UPLOAD_FILE: 'UPLOAD_FILE',
  REMOVE_FILE: 'REMOVE_FILE',
  RESET: 'RESET',
  DRAG_START: 'DRAG_START',
  DRAG_STOP: 'DRAG_STOP',
} as const;

const { UPLOAD_FILE, REMOVE_FILE, DRAG_START, DRAG_STOP } = actionTypes;

export const controlStates = {
  fileUploaded: 'fileUploaded',
  empty: 'empty',
  uploading: 'uploading',
  error: 'error',
  draggingEnabled: 'dragging.enabled',
  draggingDisabled: 'dragging.disabled',
};

const {
  fileUploaded,
  empty,
  uploading,
  error,
  draggingEnabled,
  draggingDisabled,
} = controlStates;

const machineSetup = setup({
  types: {
    context: {} as ImageUploadContext,
    events: {} as ImageUploadEvent,
  },
  actors: {
    upload: fromPromise<string, ImageUploadEvent>(() => {
      throw new Error('upload actor must be provided via .provide()');
    }),
  },
});

const createUploadingState = (t: TFunction) =>
  machineSetup.createStateConfig({
    id: uploading,
    entry: machineSetup.assign({
      file: ({ event }) =>
        event.type === UPLOAD_FILE ? event.files[0] : undefined,
    }),
    invoke: {
      id: 'uploadFile',
      src: 'upload',
      input: ({ event }) => event,
      onDone: {
        target: fileUploaded,
        actions: assign({
          url: ({ event }) => event.output,
        }),
      },
      onError: {
        target: error,
        actions: [
          assign({
            file: () => null,
            url: () => null,
          }),
          assign({
            error: ({ event }) =>
              isError(event.error)
                ? t('yleiset.kuvanLahetysVirhe')
                : (event.error as { message?: string } | undefined)?.message,
          }),
        ],
      },
    },
  });

const draggingStates = {
  initial: 'enabled',
  states: {
    enabled: {
      on: {
        [DRAG_STOP]: {
          target: `#${empty}`,
          actions: machineSetup.assign({
            file: () => null,
            url: () => null,
          }),
        },
        [UPLOAD_FILE]: `#${uploading}`,
      },
    },
    disabled: {
      on: {
        [DRAG_STOP]: `#${fileUploaded}`,
        [UPLOAD_FILE]: `#${fileUploaded}`,
      },
    },
  },
};

export function createImageUploadMachine({
  url,
  externalError,
  t,
}: {
  url?: string | null;
  externalError?: string | null;
  t: TFunction;
}) {
  let initial = empty;
  if (url) {
    initial = fileUploaded;
  } else if (externalError) {
    initial = error;
  }

  return machineSetup.createMachine({
    id: 'imageUpload',
    initial,
    context: {
      file: undefined,
      url,
      error: externalError,
    },
    states: {
      [empty]: {
        id: empty,
        on: {
          [UPLOAD_FILE]: uploading,
          [DRAG_START]: draggingEnabled,
        },
      },
      [fileUploaded]: {
        id: fileUploaded,
        on: {
          [REMOVE_FILE]: {
            target: empty,
            actions: machineSetup.assign({
              file: () => null,
              url: () => null,
            }),
          },
          [DRAG_START]: draggingDisabled,
        },
      },
      [uploading]: createUploadingState(t),
      [error]: {
        on: {
          [UPLOAD_FILE]: uploading,
          [DRAG_START]: draggingEnabled,
        },
        exit: machineSetup.assign({
          error: () => null,
        }),
      },
      dragging: draggingStates,
    },
  });
}
