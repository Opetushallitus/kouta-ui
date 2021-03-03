import 'core-js/es';
import 'jest-styled-components';
import '@testing-library/jest-dom/extend-expect';
import {
  isEditorState,
  serializeEditorState,
} from '#/src/components/Editor/utils';

// Serialize Draft editor
expect.addSnapshotSerializer({
  test: isEditorState,
  print: (value, serialize) => serialize(serializeEditorState(value)),
});
