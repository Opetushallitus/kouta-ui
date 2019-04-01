import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createSerializer } from 'enzyme-to-json';
import {
  isEditorState,
  serialize as serializeEditor,
} from './components/Editor';

import 'jest-styled-components';

expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }));

// Serialize Draft editor
expect.addSnapshotSerializer({
  test(value) {
    return isEditorState(value);
  },
  print(value, serialize, indent) {
    return indent(serialize(serializeEditor(value)));
  },
});

Enzyme.configure({ adapter: new Adapter() });
