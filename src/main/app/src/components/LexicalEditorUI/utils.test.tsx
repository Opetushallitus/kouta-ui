import { createEditor } from 'lexical';

import { isEditorState, isEditorEmpty, parseEditorState } from './utils';

const editor = createEditor();
const es = editor.getEditorState();

describe('isEditorState', () => {
  test.each([
    ['test', false],
    [{}, false],
    [es, true],
    [null, false],
    [Object.create({}), false],
    [undefined, false],
  ])('isEditorState', (candidateState, result) => {
    expect(isEditorState(candidateState)).toEqual(result);
  });
});

describe('isEditorEmpty', () => {
  test('should return false when there is text in the editor in a paragraph', () => {
    const editorState = parseEditorState('<p>Editor has text</p>');
    expect(isEditorEmpty(editorState)).toBeFalsy();
  });

  test('should return false when there is text in the editor', () => {
    const editorState = parseEditorState('Editor has text');
    expect(isEditorEmpty(editorState)).toBeFalsy();
  });

  test('should return true when editor is empty', () => {
    expect(isEditorEmpty(parseEditorState(''))).toBeTruthy();
  });

  test('should return true when editor has only whitespace', () => {
    expect(isEditorEmpty(parseEditorState(' '))).toBeTruthy();
  });

  test('should return true when editor has empty paragraph', () => {
    expect(isEditorEmpty(parseEditorState('<p></p>'))).toBeTruthy();
  });
});
