import styled from 'styled-components';

import DropDown, { DropDownItem } from '../../ui/DropDown';

export const Toolbar = styled.div`
  display: flex;
  margin-bottom: 16px;
  background: #fff;
  padding: 4px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  vertical-align: middle;
  overflow: auto;
  height: 36px;
  position: sticky;
  top: 0;
  z-index: 2;
  border-bottom: 1px solid #ced4da;

  button.toolbar-item {
    border: 0;
    display: flex;
    background: none;
    border-radius: 10px;
    padding: 8px;
    cursor: pointer;
    vertical-align: middle;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
  }

  button.toolbar-item:disabled {
    cursor: not-allowed;
  }

  button.toolbar-item.spaced {
    margin-right: 2px;
  }

  button.toolbar-item:disabled .icon,
  button.toolbar-item:disabled .text,
  button.toolbar-item:disabled i.format {
    opacity: 0.2;
  }

  button.toolbar-item.active {
    background-color: rgba(223, 232, 250, 0.3);
  }

  .toolbar-item:hover:not([disabled]) {
    background-color: #eee;
  }

  .toolbar-item.font-family .text {
    display: block;
    max-width: 40px;
  }

  .toolbar-item .text {
    display: flex;
    line-height: 20px;
    vertical-align: middle;
    font-size: 14px;
    color: #777;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 20px;
    text-align: left;
    padding-right: 10px;
  }

  .divider {
    width: 1px;
    background-color: #eee;
    margin: 0 4px;
  }
`;

export const StyledDropDownItem = styled(DropDownItem)`
  margin: 0 8px 0 8px;
  padding: 8px;
  color: #050505;
  cursor: pointer;
  line-height: 16px;
  font-size: 15px;
  display: flex;
  align-content: center;
  flex-direction: row;
  flex-shrink: 0;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 8px;
  border: 0;
  max-width: 250px;
  min-width: 100px;

  fontsize-item,
  fontsize-item .text {
    min-width: unset;
  }

  .active {
    display: flex;
    width: 20px;
    height: 20px;
    background-size: contain;
  }

  :first-child {
    margin-top: 8px;
  }

  :last-child {
    margin-bottom: 8px;
  }

  :hover {
    background-color: #eee;
  }

  .text {
    display: flex;
    line-height: 20px;
    flex-grow: 1;
    min-width: 150px;
  }

  #block-controls {
    display: block;
    position: absolute;
    right: 10px;
    width: 32px;
    height: 32px;
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
    top: 16px;
    z-index: 10;
    border-radius: 8px;
    border: 1px solid rgb(206, 208, 212);
    overflow: hidden;
  }

  #block-controls button {
    border: 1px solid white;
    background-color: #fff;
    display: block;
    transition: background-color 0.1s ease;
    cursor: pointer;
    outline: none;
    border-radius: 8px;
    padding: 3px;
  }

  #block-controls button:hover {
    background-color: #efefef;
  }

  #block-controls button:focus-visible {
    border-color: blue;
  }
`;

export const StyledDropDown = styled(DropDown)`
  .divider {
    width: auto;
    background-color: #eee;
    margin: 4px 8px;
    height: 1px;
  }

  @media screen and (max-width: 1100px) {
    .dropdown-button-text {
      display: none !important;
    }
  }
`;
