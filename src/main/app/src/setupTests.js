import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createSerializer } from 'enzyme-to-json';
import 'jest-styled-components';

expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }));
Enzyme.configure({ adapter: new Adapter() });
