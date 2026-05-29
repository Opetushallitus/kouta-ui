import _ from 'lodash';
import { Machine, assign, DoneInvokeEvent } from 'xstate';

type UploadFileEvent = { type: 'UPLOAD_FILE'; files: FileList };

type ImageUploadContext = {
  file: File | null | undefined;
  url: string | null | undefined;
  error: string | null | undefined;
};

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

const clearValue = assign<ImageUploadContext>({
  file: () => null,
  url: () => null,
});

const createUploadingState = t => ({
  id: uploading,
  entry: assign<ImageUploadContext, UploadFileEvent>({
    file: (_ctx, e) => e.files[0],
  }),
  invoke: {
    id: 'uploadFile',
    src: 'upload',
    onDone: {
      target: fileUploaded,
      actions: assign<ImageUploadContext, DoneInvokeEvent<string>>({
        url: (_ctx, e) => e.data,
      }),
    },
    onError: {
      target: error,
      actions: [
        clearValue,
        assign<ImageUploadContext, DoneInvokeEvent<any>>({
          error: (_ctx, e) =>
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

  return Machine<ImageUploadContext>({
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
