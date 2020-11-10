import 'core-js/es';
import 'jest-styled-components';
import '@testing-library/jest-dom/extend-expect';
import {
  isEditorState,
  serializeEditorState,
} from '#/src/components/Editor/utils';

// Serialize Draft editor
expect.addSnapshotSerializer({
  test(value) {
    return isEditorState(value);
  },
  print(value, serialize, indent) {
    return indent(serialize(serializeEditorState(value)));
  },
});
