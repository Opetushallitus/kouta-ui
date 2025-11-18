import styled, { css } from 'styled-components';

import { spacing, getThemeProp } from '#/src/theme';

export const Container = styled.div<{ hasFocus: boolean; disabled?: boolean }>`
  border: 1px solid ${getThemeProp('colors.inputBorder')};
  border-radius: ${getThemeProp('shape.borderRadius')};
  background-color: white;
  box-shadow: 0 0 0 0 transparent;
  transition:
    border-color 0.25s,
    box-shadow 0.25s;
  margin-bottom: ${spacing(2)};

  div[contenteditable] {
    min-width: 100%;
    min-height: 100%;
  }

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

export const EditorScroller = styled.div`
  min-height: 150px;
  border: 0;
  display: flex;
  position: relative;
  outline: 0;
  z-index: 0;
  overflow: auto;
  resize: vertical;
`;

export const Editor = styled.div`
  flex: auto;
  position: relative;
  resize: vertical;
  z-index: -1;
  padding: 0 16px 0 16px;

  [contenteditable]:focus {
    outline: none;
  }

  .ContentEditable__root .EditorTheme__link {
    pointer-events: none;
  }

  .ltr {
    text-align: left;
  }

  .rtl {
    text-align: right;
  }

  .EditorTheme__blockCursor {
    display: block;
    pointer-events: none;
    position: absolute;
  }

  .EditorTheme__blockCursor:after {
    content: '';
    display: block;
    position: absolute;
    top: -2px;
    width: 20px;
    border-top: 1px solid black;
    animation: CursorBlink 1.1s steps(2, start) infinite;
  }

  @keyframes CursorBlink {
    to {
      visibility: hidden;
    }
  }
`;
