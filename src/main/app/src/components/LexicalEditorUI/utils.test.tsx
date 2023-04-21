import { createEditor } from 'lexical';

import { isEditorState } from './utils';

const editor = createEditor();
const es = editor.getEditorState();

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
