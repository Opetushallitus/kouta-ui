import 'core-js/es';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createSerializer } from 'enzyme-to-json';
import '@testing-library/jest-dom/extend-expect';
import {
  isEditorState,
  serializeEditorState,
} from '#/src/components/Editor/utils';

import 'jest-styled-components';

expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }));

// Serialize Draft editor
expect.addSnapshotSerializer({
  test(value) {
    return isEditorState(value);
  },
  print(value, serialize, indent) {
    return indent(serialize(serializeEditorState(value)));
  },
});

Enzyme.configure({ adapter: new Adapter() });
