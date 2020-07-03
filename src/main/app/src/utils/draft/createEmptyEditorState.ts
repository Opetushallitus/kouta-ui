import { EditorState } from 'draft-js';

import linkDecorator from './linkDecorator';

const createEmptyEditorState = () => EditorState.createEmpty(linkDecorator);

export default createEmptyEditorState;
