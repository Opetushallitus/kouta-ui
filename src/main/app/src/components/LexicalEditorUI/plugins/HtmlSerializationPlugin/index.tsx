import { useEffect } from 'react';

import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot, $isElementNode, $isDecoratorNode } from 'lexical';

export type LexicalEditorHtml = {
  htmlStr: string;
};

interface Props {
  initial?: LexicalEditorHtml;
  onContentChanged: (html: LexicalEditorHtml) => void;
}

export const HtmlSerializationPlugin = ({
  initial,
  onContentChanged,
}: Props) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!initial) return;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initial.htmlStr, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);

      // Using $insertNodes seems to directly fail with any whitespace in DOM...
      const root = $getRoot();
      nodes.forEach((node, i) => {
        if ($isElementNode(node) || $isDecoratorNode(node)) {
          root.append(node);
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tidyHtmlOutput = (rawHtml: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');

    doc
      .querySelectorAll('*')
      .forEach(element => element.removeAttribute('class'));

    return doc.documentElement.innerHTML;
  };

  return (
    <OnChangePlugin
      onChange={editorState => {
        editorState.read(() => {
          const html: LexicalEditorHtml = {
            htmlStr: tidyHtmlOutput($generateHtmlFromNodes(editor)),
          };

          onContentChanged(html);
        });
      }}
    />
  );
};

export default HtmlSerializationPlugin;
