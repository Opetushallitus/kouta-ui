import styled from 'styled-components';

import closeIcon from '../../images/icons/close.svg';
import editIcon from '../../images/icons/pencil-fill.svg';
import confirmIcon from '../../images/icons/success-alt.svg';

export const LinkEditor = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  max-width: 400px;
  width: 100%;
  opacity: 0;
  background-color: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  border-radius: 0 0 8px 8px;
  transition: opacity 0.5s;
  will-change: transform;

  select {
    padding: 6px;
    border: none;
    background-color: rgba(0, 0, 0, 0.075);
    border-radius: 4px;
  }
`;

export const LinkEditorButton = styled.div`
  background-size: 16px;
  background-position: center;
  background-repeat: no-repeat;
  width: 35px;
  vertical-align: -0.25em;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  cursor: pointer;
`;

export const LinkEditorButtonEdit = styled(LinkEditorButton)`
  background-image: url(${editIcon});
`;

export const LinkEditorButtonCancel = styled(LinkEditorButton)`
  background-image: url(${closeIcon});
  margin-right: 28px;
`;

export const LinkEditorButtonConfirm = styled(LinkEditorButton)`
  background-image: url(${confirmIcon});
  margin-right: 2px;
`;

export const LinkInput = styled.input`
  display: block;
  width: calc(100% - 75px);
  box-sizing: border-box;
  margin: 12px 12px;
  padding: 8px 12px;
  border-radius: 15px;
  background-color: #eee;
  font-size: 15px;
  color: rgb(5, 5, 5);
  border: 0;
  outline: 0;
  position: relative;
  font-family: inherit;

  a {
    color: rgb(33, 111, 219);
    text-decoration: underline;
    white-space: nowrap;
    overflow: hidden;
    margin-right: 30px;
    text-overflow: ellipsis;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const LinkView = styled.div`
  display: block;
  width: calc(100% - 24px);
  margin: 8px 12px;
  padding: 8px 12px;
  border-radius: 15px;
  font-size: 15px;
  color: rgb(5, 5, 5);
  border: 0;
  outline: 0;
  position: relative;
  font-family: inherit;

  a {
    display: block;
    word-break: break-word;
    width: calc(100% - 33px);
  }
`;
