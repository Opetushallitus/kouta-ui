import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode } from '@lexical/rich-text';
import {
  $getRoot,
  createEditor,
  CreateEditorArgs,
  LexicalEditor,
  TextNode,
  DOMExportOutput,
  $insertNodes,
  EditorState,
  $createParagraphNode,
} from 'lexical';
import _ from 'lodash';

function wrapElementWith(element: HTMLElement, tag: string): HTMLElement {
  const el = document.createElement(tag);
  el.appendChild(element);
  return el;
}

class CustomTextNode extends TextNode {
  static clone(node: CustomTextNode): CustomTextNode {
    return new CustomTextNode(node.__text);
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    let element = document.createElement('span');
    element.textContent = this.__text;

    // This is the only way to properly add support for most clients,
    // even if it's semantically incorrect to have to resort to using
    // <b>, <u>, <s>, <i> elements.
    if (element !== null) {
      if (this.hasFormat('bold')) {
        element = wrapElementWith(element, 'strong');
      }
      if (this.hasFormat('italic')) {
        element = wrapElementWith(element, 'em');
      }
      if (this.hasFormat('strikethrough')) {
        element = wrapElementWith(element, 's');
      }
      if (this.hasFormat('underline')) {
        element = wrapElementWith(element, 'u');
      }
    }

    return {
      element,
    };
  }
}

const NODES = [
  HeadingNode,
  ListNode,
  ListItemNode,
  AutoLinkNode,
  LinkNode,
  CustomTextNode,
  {
    replace: TextNode,
    with: (node: TextNode) => {
      return new CustomTextNode(node.__text);
    },
  },
];

const editorConfig: CreateEditorArgs = {
  namespace: 'ImportExportEditor',
  onError: error => {
    console.error(error);
  },
  nodes: NODES,
};

export const parseEditorState = (value: string): EditorState => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(value, 'text/html');
  const editor = createEditor(editorConfig);
  editor.update(
    () => {
      const p = $createParagraphNode();
      $getRoot().append(p);
      p.select();
      $insertNodes($generateNodesFromDOM(editor, doc));
    },
    // Päivitetään synkronisesti!
    { discrete: true }
  );
  return editor.getEditorState();
};

// TODO: Tarvii varmistua ettei rikota HTML:ää tässä!
const unwrapSpans = html => html.replace(new RegExp('</?span.*?>', 'gm'), '');

export const serializeEditorState = (value: EditorState): string => {
  const editor = createEditor(editorConfig);
  editor.setEditorState(value);

  let html = '';

  editor.update(
    () => {
      html = $generateHtmlFromNodes(editor, null);
    },
    // Päivitetään synkronisesti!
    { discrete: true }
  );

  return unwrapSpans(html);
};

export const isEditorState = (value: unknown): value is EditorState => {
  return _.isFunction(value?.isEmpty);
  //return value && typeof value === 'object' && value.hasOwnProperty('htmlStr');
};

export const isEmptyEditorState = (state: EditorState) => {
  if (!isEditorState) return false;
  return state.isEmpty();
};
