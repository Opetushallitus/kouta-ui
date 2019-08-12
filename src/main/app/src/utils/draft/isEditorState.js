import { EditorState } from 'draft-js';

const isEditorState = value => value instanceof EditorState;

export default isEditorState;
