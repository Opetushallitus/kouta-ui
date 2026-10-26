import { type TFunction } from 'i18next';
import { isError } from 'lodash';
import {
  createMachine,
  assign,
  type DoneInvokeEvent,
  type ErrorPlatformEvent,
  type EventObject,
} from 'xstate';

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

const clearValue = assign<ImageUploadContext, EventObject>({
  file: () => null,
  url: () => null,
});

const createUploadingState = (t: TFunction) => ({
  id: uploading,
  entry: assign<ImageUploadContext, ImageUploadEvent>({
    file: (_ctx, e) => (e.type === UPLOAD_FILE ? e.files[0] : undefined),
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
        assign<ImageUploadContext, ErrorPlatformEvent>({
          error: (_ctx, e) =>
            isError(e.data) ? t('yleiset.kuvanLahetysVirhe') : e?.data?.message,
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

  return createMachine<ImageUploadContext, ImageUploadEvent>({
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
        exit: assign<ImageUploadContext, ImageUploadEvent>({
          error: () => null,
        }),
      },
      dragging: draggingStates,
    },
  });
}
