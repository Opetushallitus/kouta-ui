import { useState } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { EditorState } from 'lexical';

import { Container, EditorScroller, Editor } from './Components';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import EditorTheme from './themes/EditorTheme';
import { LEXICAL_NODES, isEditorState } from './utils';

interface LexicalEditorUIProps {
  value?: EditorState;
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
    nodes: LEXICAL_NODES,
    editorState: isEditorState(value) && !value.isEmpty() ? value : null,
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
