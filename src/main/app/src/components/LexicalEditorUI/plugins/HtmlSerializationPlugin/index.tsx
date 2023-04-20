import { useState, useEffect } from 'react';

import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot, $isElementNode, $isDecoratorNode } from 'lexical';

interface Props {
  initialHtml?: string;
  onHtmlChanged: (html: string) => void;
}

const HtmlSerializationPlugin = ({ initialHtml, onHtmlChanged }: Props) => {
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (!initialHtml || !isFirstRender) return;
    setIsFirstRender(false);

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHtml, 'text/html');
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
          onHtmlChanged(tidyHtmlOutput($generateHtmlFromNodes(editor)));
        });
      }}
    />
  );
};

export default HtmlSerializationPlugin;
