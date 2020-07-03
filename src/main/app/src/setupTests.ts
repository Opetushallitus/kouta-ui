import 'core-js/es';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createSerializer } from 'enzyme-to-json';

import isEditorState from './utils/draft/isEditorState';
import serializeEditorState from './utils/draft/serializeEditorState';

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
