import { useState, useRef, useEffect, useLayoutEffect, useId } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { $getRoot, type EditorState, HISTORY_MERGE_TAG } from 'lexical';

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

// Ohjelmallisten synkkojen tunniste. EditorChangePlugin ohittaa tällä tagilla merkityt
// päivitykset, jotta ne eivät emittoi onChangea; syy on UpdatePluginin efektissä.
const HISTORY_MERGE = { tag: HISTORY_MERGE_TAG };

// Oma kuuntelija kirjaston OnChangePluginin (@lexical/react) sijaan.
//
// Kirjaston plugin ohittaa päivityksen, jonka EDELLINEN tila on
// prevEditorState.isEmpty(). Se ei tarkoita "tyhjä teksti" vaan koskemattoman editorin
// alkutilaa, joten samalla katoaa käyttäjän ENSIMMÄINEN muokkaus, jos se osuu editorin
// ensimmäiseen committiin - hiljaa, kenttä vain puuttuu tallennusrungosta.
//
// Alustuksen vaimennukseen vartijaa ei tarvita: UpdatePluginin isInitialMountRef ohittaa
// mountin, ohjelmalliset synkat on merkitty history-merge-tagilla, eikä mount-commit
// muutenkaan päädy kuuntelijalle.
const EditorChangePlugin = ({ onChange }: { onChange?: any }) => {
  const [editor] = useLexicalComposerContext();

  useLayoutEffect(() => {
    if (!onChange) {
      return;
    }

    return editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves, tags }) => {
        // Pelkkä kursorin siirto ei ole muutos (kirjaston ignoreSelectionChange).
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
          return;
        }

        // Ohjelmallinen synkkaus (UpdatePlugin), ei käyttäjän muokkaus.
        if (tags.has(HISTORY_MERGE_TAG)) {
          return;
        }

        onChange(editorState, editor, tags);
      }
    );
  }, [editor, onChange]);

  return null;
};

/* We need this, so that when editor is updated in the fly,
   eg. when changing language, the state updates accordingly. */
const UpdatePlugin = ({ value }: { value?: EditorState }) => {
  const [editor] = useLexicalComposerContext();
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    // Skip the initial mount to avoid triggering onChange during setup
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    // Synkka on OHJELMALLINEN eikä siitä saa lähteä onChangea, siksi HISTORY_MERGE-tagi.
    //
    // Ilman sitä kielivälilehden vaihto tuhoaa sen kielen tekstin, jolta poistutaan.
    // Vaihto muuttaa Fieldin name-propin (kuvaus.fi -> kuvaus.sv) instanssia purkamatta,
    // tämä efekti ajaa setEditorStaten, ja onChange on react-final-formin input.onChange,
    // jonka ref.current päivitetään EFEKTISSÄ. React ajaa lapsen efektit ennen
    // vanhemman, joten kirjoitus menisi edellisen renderin nimeen eli väärälle kielelle.
    // redux-formilla ongelmaa ei ollut, koska sen käsittelijä luki nimen kutsuhetkellä.
    if (value) {
      // If the update was done by lexical internally the editorstate object identity remains the same -> no need to reset the editor state
      if (value !== editor.getEditorState()) {
        editor.setEditorState(value, HISTORY_MERGE);
      }
    } else {
      editor.update(() => {
        $getRoot().clear();
      }, HISTORY_MERGE);
    }
  }, [value, editor]);

  return null;
};

export const LexicalEditorUI = ({
  value,
  onChange,
  onFocus = () => {},
  onBlur = () => {},
  disabled,
}: LexicalEditorUIProps) => {
  const id = useId();
  const editorId = `LexicalEditor__${id}`;

  const config = {
    namespace: editorId,
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
      <LexicalComposer initialConfig={config}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <EditorScroller>
              <Editor ref={onRef}>
                <ContentEditable
                  onFocus={() => {
                    setHasFocus(true);
                    onFocus();
                  }}
                  onBlur={() => {
                    setHasFocus(false);
                    onBlur();
                  }}
                />
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
        <EditorChangePlugin onChange={onChange} />
        <UpdatePlugin value={value} />
      </LexicalComposer>
    </Container>
  );
};
