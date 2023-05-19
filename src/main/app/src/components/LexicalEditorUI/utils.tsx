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
  SerializedTextNode,
} from 'lexical';

function wrapElementWith(element: HTMLElement, tag: string): HTMLElement {
  const el = document.createElement(tag);
  el.appendChild(element);
  return el;
}

class CustomTextNode extends TextNode {
  static getType() {
    return 'CustomTextNode';
  }

  static clone(node: CustomTextNode): CustomTextNode {
    return new CustomTextNode(node.__text);
  }

  static importJSON(serializedNode: SerializedTextNode): CustomTextNode {
    const serialized = TextNode.importJSON(serializedNode);
    return new CustomTextNode(serialized.__text);
  }

  exportJSON(): SerializedTextNode {
    const node = super.exportJSON();
    node.type = 'CustomTextNode';
    return node;
  }

  exportDOM(_editor: LexicalEditor): DOMExportOutput {
    let element = document.createElement('span');
    element.textContent = this.__text;

    // This is the only way to properly add support for most clients,
    // even if it's semantically incorrect to have to resort to using
    // <b>, <u>, <s>, <i> elements.
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

    return {
      element,
    };
  }
}

const editorConfig: CreateEditorArgs = {
  namespace: 'ImportExportEditor',
  onError: error => {
    console.error(error);
  },
  nodes: [
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
  ],
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

export const createEmptyEditorState = () => {
  const editor = createEditor(editorConfig);
  return editor.getEditorState();
};

export const isEditorState = (value: unknown): value is EditorState => {
  const es = createEmptyEditorState();
  // Ei voida käyttää suoraan EditorState:a instanceof-tarkistuksessa, koska lexicalista exportataan vain tyyppi
  return value instanceof es.constructor;
};

export const isEmptyEditorState = (state: unknown) =>
  isEditorState(state) && state.isEmpty();
