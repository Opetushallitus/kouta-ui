export const getSelectionLinkUrl = editorState => {
  const contentState = editorState.getCurrentContent();
  const startKey = editorState.getSelection().getStartKey();
  const startOffset = editorState.getSelection().getStartOffset();
  const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
  const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

  if (linkKey) {
    const linkInstance = contentState.getEntity(linkKey);
    return linkInstance.getData().url || '';
  }

  return '';
};

export const getBlockType = editorState => {
  const selection = editorState.getSelection();

  return editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
};

export const inlineIsActive = ({ editorState, styleName }) => {
  return editorState.getCurrentInlineStyle().has(styleName);
};

export const blockIsActive = ({ editorState, styleName }) => {
  return getBlockType(editorState) === styleName;
};
