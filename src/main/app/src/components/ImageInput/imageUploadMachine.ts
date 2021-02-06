import _ from 'lodash';
import { Machine, assign } from 'xstate';

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

const clearValue = assign({
  file: () => null,
  url: () => null,
});

const createUploadingState = t => ({
  id: uploading,
  entry: assign({
    file: (ctx, e) => e.files[0],
  }),
  invoke: {
    id: 'uploadFile',
    src: 'upload',
    onDone: {
      target: fileUploaded,
      actions: assign({
        url: (ctx, e) => e.data,
      }),
    },
    onError: {
      target: error,
      actions: [
        clearValue,
        assign({
          error: (ctx, e) =>
            _.isError(e.data)
              ? t('yleiset.kuvanLahetysVirhe')
              : e?.data?.message,
        }),
      ],
    },
  },
});

const draggingStates = {
  states: {
    enabled: {
      on: {
        [DRAG_STOP]: {
          target: `#${empty}`,
          actions: clearValue,
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
            actions: clearValue,
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
        exit: assign({
          error: () => null,
        }),
      },
      dragging: draggingStates,
    },
  });
}
