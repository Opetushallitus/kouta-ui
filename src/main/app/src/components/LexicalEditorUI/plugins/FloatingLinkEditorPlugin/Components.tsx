import styled from 'styled-components';

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
  width: 35px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  cursor: pointer;
`;

export const LinkEditorButtonEdit = styled(LinkEditorButton)`
  margin-top: 6px;
`;

export const LinkEditorButtonCancel = styled(LinkEditorButton)`
  margin-top: 18px;
  margin-right: 22px;
`;

export const LinkEditorButtonConfirm = styled(LinkEditorButton)`
  margin-top: 18px;
  margin-right: -2px;
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
  font-family: Roboto, 'Open Sans', 'Helvetica Neue', sans-serif;

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
  font-family: Roboto, 'Open Sans', 'Helvetica Neue', sans-serif;

  a {
    display: block;
    word-break: break-word;
    width: calc(100% - 33px);
  }
`;
