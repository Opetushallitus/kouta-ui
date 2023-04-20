import { useState } from 'react';

import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode } from '@lexical/rich-text';

import { Container, EditorScroller, Editor } from './Components';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import HtmlSerializationPlugin from './plugins/HtmlSerializationPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import EditorTheme from './themes/EditorTheme';

interface LexicalEditorUIProps {
  value?: string;
  onChange?: any;
  inputProps?: any;
  onFocus?: any;
  onBlur?: any;
  disabled?: boolean;
  hideHeaderSelect?: boolean;
}

export const LexicalEditorUI = ({
  value,
  onChange,
  onFocus,
  onBlur,
  disabled,
}: LexicalEditorUIProps) => {
  const config = {
    namespace: 'LexicalEditor',
    theme: EditorTheme,
    onError: error => {
      console.error(error);
    },
    nodes: [HeadingNode, ListNode, ListItemNode, AutoLinkNode, LinkNode],
  };

  const [hasFocus, setHasFocus] = useState(false);

  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <Container className="Editor__" hasFocus={hasFocus} disabled={disabled}>
      <LexicalComposer
        onFocus={() => {
          setHasFocus(true);
          onFocus();
        }}
        onBlur={() => {
          setHasFocus(false);
          onBlur();
        }}
        initialConfig={config}
      >
        <HtmlSerializationPlugin initialHtml={value} onHtmlChanged={onChange} />
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <EditorScroller>
              <Editor ref={onRef}>
                <ContentEditable />
              </Editor>
            </EditorScroller>
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <LinkPlugin />
        <>
          {floatingAnchorElem && (
            <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
          )}
        </>
        <HistoryPlugin />
      </LexicalComposer>
    </Container>
  );
};

export default LexicalEditorUI;
