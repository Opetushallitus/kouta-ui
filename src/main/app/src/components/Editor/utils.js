import React from 'react';

import {
  convertToHTML as makeConvertToHTML,
  convertFromHTML as makeConvertFromHTML,
} from 'draft-convert';

import get from 'lodash/get';
import { EditorState, CompositeDecorator } from 'draft-js';
import { isObject, isFunction, isString } from '../../utils';

import Anchor from '../Anchor';

const Link = props => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();

  return <Anchor href={url}>{props.children}</Anchor>;
};

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

export const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    );
  }, callback);
};

export const linkDecorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

export const blockIsActive = ({ editorState, styleName }) => {
  return getBlockType(editorState) === styleName;
};

export const convertToHTML = makeConvertToHTML({
  entityToHTML: (entity, originalText) => {
    if (entity.type === 'LINK') {
      return <a href={get(entity, 'data.url') || ''}>{originalText}</a>;
    }

    return originalText;
  },
});

export const convertFromHTML = makeConvertFromHTML({
  htmlToEntity: (nodeName, node, createEntity) => {
    if (nodeName === 'a') {
      return createEntity('LINK', 'MUTABLE', { url: get(node, 'href') || '' });
    }
  },
});

export const createEditorStateWithContent = contentState =>
  EditorState.createWithContent(contentState, linkDecorator);

export const createEmptyEditorState = () =>
  EditorState.createEmpty(linkDecorator);

export const serialize = value => {
  if (!isObject(value) || !isFunction(value.getCurrentContent)) {
    return '';
  }

  return convertToHTML(value.getCurrentContent());
};

export const parse = value => {
  if (!isString(value)) {
    return createEmptyEditorState();
  }

  return createEditorStateWithContent(convertFromHTML(value));
};
