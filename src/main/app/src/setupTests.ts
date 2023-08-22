import 'jest-styled-components';
import '@testing-library/jest-dom';
import { expect } from 'vitest';

import {
  isEditorState,
  serializeEditorState,
} from '#/src/components/LexicalEditorUI/utils';

// Serialize Lexical editor
expect.addSnapshotSerializer({
  test: isEditorState,
  print: (value: any, serialize) => serialize(serializeEditorState(value)),
});
