import { Machine, assign } from 'xstate';
import get from 'lodash/get';

export const actionTypes = {
  UPLOAD_FILE: 'UPLOAD_FILE',
  REMOVE_FILE: 'REMOVE_FILE',
  RESET: 'RESET',
  DRAG_START: 'DRAG_START',
  DRAG_STOP: 'DRAG_STOP',
};

export const controlStates = {
  fileUploaded: 'fileUploaded',
  empty: 'empty',
  uploading: 'uploading',
  error: 'error',
  draggingEnabled: 'dragging.enabled',
  draggingDisabled: 'dragging.disabled',
};

export const createImageUploadMachine = ({ url, error, t }) => {
  let initial = controlStates.empty;
  if (url) {
    initial = controlStates.fileUploaded;
  } else if (error) {
    initial = controlStates.error;
  }

  return Machine({
    id: 'imageUpload',
    initial,
    context: {
      file: null,
      url,
      error,
    },
    states: {
      [controlStates.empty]: {
        id: 'empty',
        on: {
          [actionTypes.UPLOAD_FILE]: controlStates.uploading,
          [actionTypes.DRAG_START]: controlStates.draggingEnabled,
        },
      },
      [controlStates.fileUploaded]: {
        id: 'fileUploaded',
        on: {
          [actionTypes.REMOVE_FILE]: {
            target: controlStates.empty,
            actions: assign({
              url: () => null,
            }),
          },
          [actionTypes.DRAG_START]: controlStates.draggingDisabled,
        },
      },
      [controlStates.uploading]: {
        id: 'uploading',
        entry: assign({
          file: (_, e) => e.files[0],
        }),
        invoke: {
          id: 'uploadFile',
          src: 'upload',
          onDone: {
            target: controlStates.fileUploaded,
            actions: assign({
              url: (_, e) => e.data,
            }),
          },
          onError: {
            target: controlStates.error,
            actions: assign({
              file: () => null,
              url: () => null,
              error: (ctx, e) =>
                e.data instanceof Error
                  ? t('yleiset.kuvanLahetysVirhe')
                  : get(e, 'data.message'),
            }),
          },
        },
      },
      [controlStates.error]: {
        on: {
          [actionTypes.UPLOAD_FILE]: controlStates.uploading,
          [actionTypes.DRAG_START]: controlStates.draggingEnabled,
        },
        exit: assign({
          error: () => null,
        }),
      },
      dragging: {
        states: {
          enabled: {
            on: {
              [actionTypes.DRAG_STOP]: '#empty',
              [actionTypes.UPLOAD_FILE]: '#uploading',
            },
          },
          disabled: {
            on: {
              [actionTypes.DRAG_STOP]: '#fileUploaded',
              [actionTypes.UPLOAD_FILE]: '#fileUploaded',
            },
          },
        },
      },
    },
  });
};
