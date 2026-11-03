import { TFunction } from 'i18next';
import { vi } from 'vitest';
import { createActor, fromPromise, waitFor } from 'xstate';

import {
  actionTypes as AT,
  controlStates as CS,
  createImageUploadMachine,
} from './imageUploadMachine';

const mockT = ((key: string) => key) as TFunction;

const createFile = (name = 'kuva.png') =>
  new File(['sisältö'], name, { type: 'image/png' });

const startMachine = (
  uploadMock = vi.fn(),
  opts: { url?: string | null; externalError?: string | null } = {}
) =>
  createActor(
    createImageUploadMachine({ t: mockT, ...opts }).provide({
      actors: {
        upload: fromPromise(({ input }) => uploadMock(input)),
      },
    })
  ).start();

test('Should start in "empty"-state without url or externalError', () => {
  const actor = startMachine();
  expect(actor.getSnapshot().matches(CS.empty)).toEqual(true);
});

test('Should start in "fileUploaded"-state when url is given', () => {
  const actor = startMachine(vi.fn(), { url: 'http://example.com/kuva.png' });
  expect(actor.getSnapshot().matches(CS.fileUploaded)).toEqual(true);
  expect(actor.getSnapshot().context.url).toEqual(
    'http://example.com/kuva.png'
  );
});

test('Should start in "error"-state when externalError is given and no url', () => {
  const actor = startMachine(vi.fn(), { externalError: 'Jokin meni pieleen' });
  expect(actor.getSnapshot().matches(CS.error)).toEqual(true);
  expect(actor.getSnapshot().context.error).toEqual('Jokin meni pieleen');
});

test('Should move to "uploading"-state and set context.file on UPLOAD_FILE', () => {
  const actor = startMachine();
  const file = createFile();

  actor.send({ type: AT.UPLOAD_FILE, files: [file] });

  expect(actor.getSnapshot().matches(CS.uploading)).toEqual(true);
  expect(actor.getSnapshot().context.file).toBe(file);
});

test('Should move to "fileUploaded"-state and set context.url when upload resolves', async () => {
  const uploadMock = vi
    .fn()
    .mockResolvedValueOnce('http://example.com/uusi.png');
  const actor = startMachine(uploadMock);

  actor.send({ type: AT.UPLOAD_FILE, files: [createFile()] });

  const state = await waitFor(actor, s => s.matches(CS.fileUploaded));

  expect(state.context.url).toEqual('http://example.com/uusi.png');
});

test('Should move to "error"-state with translated message when upload rejects with an Error', async () => {
  const uploadMock = vi.fn().mockRejectedValueOnce(new Error('boom'));
  const actor = startMachine(uploadMock);

  actor.send({ type: AT.UPLOAD_FILE, files: [createFile()] });

  const state = await waitFor(actor, s => s.matches(CS.error));

  expect(state.context.error).toEqual('yleiset.kuvanLahetysVirhe');
  expect(state.context.file).toBeNull();
  expect(state.context.url).toBeNull();
});

test('Should move to "error"-state with server message when upload rejects with a non-Error', async () => {
  const uploadMock = vi
    .fn()
    .mockRejectedValueOnce({ message: 'Palvelinvirhe' });
  const actor = startMachine(uploadMock);

  actor.send({ type: AT.UPLOAD_FILE, files: [createFile()] });

  const state = await waitFor(actor, s => s.matches(CS.error));

  expect(state.context.error).toEqual('Palvelinvirhe');
});

test('Should clear error when leaving "error"-state', async () => {
  const uploadMock = vi.fn().mockRejectedValueOnce(new Error('boom'));
  const actor = startMachine(uploadMock);

  actor.send({ type: AT.UPLOAD_FILE, files: [createFile()] });
  await waitFor(actor, s => s.matches(CS.error));

  actor.send({ type: AT.UPLOAD_FILE, files: [createFile()] });

  expect(actor.getSnapshot().matches(CS.uploading)).toEqual(true);
  expect(actor.getSnapshot().context.error).toBeNull();
});

test('Should clear file and url on REMOVE_FILE from "fileUploaded"-state', () => {
  const actor = startMachine(vi.fn(), { url: 'http://example.com/kuva.png' });

  actor.send({ type: AT.REMOVE_FILE });

  expect(actor.getSnapshot().matches(CS.empty)).toEqual(true);
  expect(actor.getSnapshot().context.file).toBeNull();
  expect(actor.getSnapshot().context.url).toBeNull();
});

test('Should move to "dragging.enabled"-state on DRAG_START from "empty"-state', () => {
  const actor = startMachine();

  actor.send({ type: AT.DRAG_START });

  expect(actor.getSnapshot().matches(CS.draggingEnabled)).toEqual(true);
});

test('Should move to "dragging.disabled"-state on DRAG_START from "fileUploaded"-state', () => {
  const actor = startMachine(vi.fn(), { url: 'http://example.com/kuva.png' });

  actor.send({ type: AT.DRAG_START });

  expect(actor.getSnapshot().matches(CS.draggingDisabled)).toEqual(true);
});

test('Should clear value and return to "empty"-state on DRAG_STOP from "dragging.enabled"-state', () => {
  const actor = startMachine();

  actor.send({ type: AT.DRAG_START });
  actor.send({ type: AT.DRAG_STOP });

  expect(actor.getSnapshot().matches(CS.empty)).toEqual(true);
});

test('Should move to "uploading"-state when a file is dropped while "dragging.enabled"', () => {
  const actor = startMachine();

  actor.send({ type: AT.DRAG_START });
  actor.send({ type: AT.UPLOAD_FILE, files: [createFile()] });

  expect(actor.getSnapshot().matches(CS.uploading)).toEqual(true);
});

test('Should return to "fileUploaded"-state on DRAG_STOP from "dragging.disabled"-state', () => {
  const actor = startMachine(vi.fn(), { url: 'http://example.com/kuva.png' });

  actor.send({ type: AT.DRAG_START });
  actor.send({ type: AT.DRAG_STOP });

  expect(actor.getSnapshot().matches(CS.fileUploaded)).toEqual(true);
});
