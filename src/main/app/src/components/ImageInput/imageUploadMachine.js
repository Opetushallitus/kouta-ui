import { Machine, assign } from 'xstate';
import get from 'lodash/get';

export const actionTypes = {
  UPLOAD_FILE: 'UPLOAD_FILE',
  REMOVE_FILE: 'REMOVE_FILE',
  RESET: 'RESET',
  DRAG_START: 'DRAG_START',
  DRAG_STOP: 'DRAG_STOP',
};

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

const createUploadingState = t => ({
  id: uploading,
  entry: assign({
    file: (_, e) => e.files[0],
  }),
  invoke: {
    id: 'uploadFile',
    src: 'upload',
    onDone: {
      target: fileUploaded,
      actions: assign({
        url: (_, e) => e.data,
      }),
    },
    onError: {
      target: error,
      actions: assign({
        file: () => null,
        url: () => null,
        error: (_, e) =>
          e.data instanceof Error
            ? t('yleiset.kuvanLahetysVirhe')
            : get(e, 'data.message'),
      }),
    },
  },
});

const draggingStates = {
  states: {
    enabled: {
      on: {
        [DRAG_STOP]: `#${empty}`,
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

export function createImageUploadMachine({ url, externalError, t }) {
  let initial = empty;
  if (url) {
    initial = fileUploaded;
  } else if (externalError) {
    initial = error;
  }

  return Machine({
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
        entry: assign({
          file: () => null,
          url: () => null,
        }),
        on: {
          [UPLOAD_FILE]: uploading,
          [DRAG_START]: draggingEnabled,
        },
      },
      [fileUploaded]: {
        id: fileUploaded,
        on: {
          [REMOVE_FILE]: empty,
          [DRAG_START]: draggingDisabled,
        },
      },
      [uploading]: createUploadingState(t),
      [error]: {
        on: {
          [UPLOAD_FILE]: uploading,
          [DRAG_START]: draggingEnabled,
        },
        exit: assign({
          error: () => null,
        }),
      },
      dragging: draggingStates,
    },
  });
}
