import 'draft-js/dist/Draft.css';

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';

import {
  Editor as DraftEditor,
  EditorState as DraftEditorState,
  RichUtils,
} from 'draft-js';
import { setLightness } from 'polished';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import Button from '#/src/components/Button';
import Select from '#/src/components/Select';
import {
  Box,
  Icon,
  Input,
  Dropdown,
  DropdownMenu,
} from '#/src/components/virkailija';
import { spacing, getThemeProp } from '#/src/theme';

import {
  getBlockType,
  inlineIsActive,
  blockIsActive,
  parseEditorState,
  getSelectionLinkUrl,
  getLinkKey,
  createEmptyEditorState,
} from './utils';

export { EditorState } from 'draft-js';

const Container = styled.div`
  border: 1px solid ${getThemeProp('colors.inputBorder')};
  border-radius: ${getThemeProp('shape.borderRadius')};
  background-color: white;
  box-shadow: 0 0 0 0 transparent;
  transition: border-color 0.25s, box-shadow 0.25s;
  margin-bottom: ${spacing(2)};

  &:hover {
    border-color: ${getThemeProp('colors.primary.main')};
  }

  ${({ hasFocus }) =>
    hasFocus &&
    css`
      border-color: ${getThemeProp('colors.primary.main')};
      box-shadow: 0 0 0 3px ${getThemeProp('colors.primary.focusOutline')};
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      & * {
        background-color: hsl(0, 0%, 95%);
        pointer-events: none;
      }
    `}
`;

const EditorWrapper = styled.div`
  padding: ${spacing(1)};
  ${getThemeProp('typography.body')};
  max-height: 250px;
  min-height: 100px;
  overflow-y: auto;
  cursor: text;
`;

const Toolbar = styled.div`
  position: relative;
  padding: ${spacing(1)};
  border-bottom: 1px solid ${getThemeProp('colors.inputBorder')};
  display: flex;
  align-items: center;
  z-index: 2;
`;

const StyleIcon = styled(Icon)`
  color: ${getThemeProp('palette.text.primary')};
  font-size: 1.4rem;
`;

const StyleButtonBase = styled.button.attrs({ type: 'button' })`
  line-height: ${getThemeProp('typography.lineHeight')};
  background-color: transparent;
  transition: background-color 0.25s;
  border: 0px none;
  border-radius: ${getThemeProp('shape.borderRadius')};
  width: 2.2rem;
  height: 2.2rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) =>
      setLightness(0.9, theme.palette.text.primary)};
  }

  ${({ active }) =>
    active &&
    css`
      background-color: ${({ theme }) =>
        setLightness(0.9, theme.palette.text.primary)};
    `}
`;

const HeaderSelectContainer = styled.div`
  margin-left: ${spacing(1)};
  width: 15rem;
`;

const LinkDropdownContainer = styled.div`
  padding: ${spacing(1)};
  width: 20rem;
`;

const focusRef = ref => {
  setTimeout(() => {
    ref && ref.current && ref.current.focus();
  }, 100);
};

const StyleButton = ({
  icon,
  styleName,
  onChange,
  editorState,
  inline,
  block,
  editorRef,
  ...props
}) => {
  const onSelect = useCallback(() => {
    if (inline) {
      onChange(RichUtils.toggleInlineStyle(editorState, styleName));
    } else if (block) {
      onChange(RichUtils.toggleBlockType(editorState, styleName));
    }

    focusRef(editorRef);
  }, [editorState, onChange, inline, block, editorRef, styleName]);

  const isActive = useMemo(() => {
    if (inline) {
      return inlineIsActive({ editorState, styleName });
    } else if (block) {
      return blockIsActive({ editorState, styleName });
    }

    return false;
  }, [editorState, styleName, inline, block]);

  return (
    <StyleButtonBase
      tabIndex="-1"
      onClick={onSelect}
      active={isActive}
      {...props}
    >
      <StyleIcon type={icon} />
    </StyleButtonBase>
  );
};

const HeaderSelect = ({ editorState, onChange, editorRef }) => {
  const { t } = useTranslation();
  const onSelect = useCallback(
    ({ value }) => {
      onChange(RichUtils.toggleBlockType(editorState, value));
      focusRef(editorRef);
    },
    [onChange, editorState, editorRef]
  );

  const value = useMemo(() => {
    return getBlockType(editorState);
  }, [editorState]);

  return (
    <HeaderSelectContainer>
      <Select
        tabIndex="-1"
        options={[
          { value: 'unstyled', label: t('editor.normaaliTeksti') },
          { value: 'header-three', label: `${t('editor.otsikko')} 1` },
          { value: 'header-four', label: `${t('editor.otsikko')} 2` },
        ]}
        value={{ value }}
        onChange={onSelect}
        menuPosition="fixed"
        menuPortalTarget={document.body}
        isClearable={false}
      />
    </HeaderSelectContainer>
  );
};

const LinkDropdown = ({ value, onChange, onSubmit }) => {
  const { t } = useTranslation();
  const inputRef = useRef();

  useEffect(() => {
    focusRef(inputRef);
  }, []);

  return (
    <LinkDropdownContainer>
      <Box display="flex">
        <Box flexGrow={1} paddingRight={1}>
          <Input
            placeholder="https://..."
            value={value}
            onChange={onChange}
            ref={inputRef}
          />
        </Box>
        <Box flexGrow={0}>
          <Button type="button" onClick={onSubmit}>
            {t('editor.lisaa')}
          </Button>
        </Box>
      </Box>
    </LinkDropdownContainer>
  );
};

const LinkButton = ({ editorState, onChange, editorRef, ...props }) => {
  const [link, setLink] = useState('');

  const onAddLink = useCallback(() => {
    const contentState = editorState.getCurrentContent();
    const linkKey = getLinkKey(editorState);

    const contentStateWithEntity =
      linkKey === ''
        ? contentState.createEntity('LINK', 'MUTABLE', { url: link })
        : contentState.replaceEntityData(getLinkKey(editorState), {
            url: link,
          });

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newEditorState = DraftEditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    onChange(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    );

    setLink('');
    focusRef(editorRef);
  }, [onChange, editorState, link, editorRef]);

  const onLinkChange = useCallback(
    e => {
      setLink(e.target.value);
    },
    [setLink]
  );

  const setLinkByEditorState = useCallback(() => {
    setLink(getSelectionLinkUrl(editorState));
  }, [editorState]);

  const overlay = ({ onToggle }) => (
    <DropdownMenu>
      <LinkDropdown
        value={link}
        onChange={onLinkChange}
        onSubmit={() => {
          onAddLink();
          onToggle();
          focusRef(editorRef);
        }}
      />
    </DropdownMenu>
  );

  return (
    <Dropdown overlay={overlay} closeOnOverlayClick={false} overflow>
      {({ onToggle, ref, open }) => (
        <div ref={ref}>
          <StyleButtonBase
            tabIndex="-1"
            onClick={e => {
              e.preventDefault();
              !open && setLinkByEditorState();
              onToggle();
            }}
            active={open}
            {...props}
          >
            <StyleIcon type="insert_link" />
          </StyleButtonBase>
        </div>
      )}
    </Dropdown>
  );
};

const emptyEditorState = createEmptyEditorState();

export const Editor = ({
  value,
  onChange,
  inputProps,
  onFocus = () => {},
  onBlur = () => {},
  disabled,
  hideHeaderSelect = false, // NOTE: If other parts should be able to be hidden too, refactor this as options or smth
  ...props
}) => {
  const { t } = useTranslation();
  const editorState = value ? value : emptyEditorState;
  const [hasFocus, setHasFocus] = useState(false);
  const editorRef = useRef();

  const styleButtonProps = { editorState, onChange, editorRef };

  return (
    <Container className="Editor__" hasFocus={hasFocus} disabled={disabled}>
      <Toolbar>
        <StyleButton
          icon="format_bold"
          styleName="BOLD"
          title={t('editor.lihavointi')}
          inline
          {...styleButtonProps}
        />
        <StyleButton
          icon="format_list_bulleted"
          styleName="unordered-list-item"
          title={t('editor.lista')}
          block
          {...styleButtonProps}
        />
        <StyleButton
          icon="format_list_numbered"
          styleName="ordered-list-item"
          title={t('editor.numeroituLista')}
          block
          {...styleButtonProps}
        />
        <LinkButton {...styleButtonProps} title={t('editor.linkki')} />
        {!hideHeaderSelect && <HeaderSelect {...styleButtonProps} />}
      </Toolbar>
      <EditorWrapper
        onClick={() => {
          if (!hasFocus) {
            editorRef?.current?.focus?.();
          }
        }}
      >
        <DraftEditor
          onFocus={() => {
            setHasFocus(true);
            onFocus();
          }}
          onBlur={() => {
            setHasFocus(false);
            onBlur();
          }}
          handlePastedText={(text, html) => {
            const replaceIfHtml = () => {
              if ((text || '').trim().startsWith('<')) {
                onChange(parseEditorState(text));
                return true;
              } else {
                return false;
              }
            };
            return replaceIfHtml() ? 'handled' : 'unhandled';
          }}
          editorState={editorState}
          ref={editorRef}
          onChange={onChange}
          readOnly={disabled}
          {...props}
        />
      </EditorWrapper>
    </Container>
  );
};

export default Editor;
