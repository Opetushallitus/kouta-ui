import styled from 'styled-components';

import iconRedo from '../../images/icons/arrow-clockwise.svg';
import iconUndo from '../../images/icons/arrow-counterclockwise.svg';
import iconChevronDown from '../../images/icons/chevron-down.svg';
import iconClose from '../../images/icons/close.svg';
import iconLink from '../../images/icons/link.svg';
import iconOl from '../../images/icons/list-ol.svg';
import iconUl from '../../images/icons/list-ul.svg';
import iconParagraph from '../../images/icons/text-paragraph.svg';
import iconBold from '../../images/icons/type-bold.svg';
import iconH1 from '../../images/icons/type-h1.svg';
import iconH2 from '../../images/icons/type-h2.svg';
import DropDown, { DropDownItem } from '../../ui/DropDown';

export const Toolbar = styled.div`
  display: flex;
  margin-bottom: 1px;
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

  button.toolbar-item i.format {
    background-size: contain;
    display: inline-block;
    height: 18px;
    width: 18px;
    vertical-align: -0.25em;
    display: flex;
    opacity: 0.6;
  }

  button.toolbar-item:disabled .icon,
  button.toolbar-item:disabled .text,
  button.toolbar-item:disabled i.format,
  button.toolbar-item:disabled .chevron-down {
    opacity: 0.2;
  }

  button.toolbar-item.active {
    background-color: rgba(223, 232, 250, 0.3);
  }

  button.toolbar-item.active i {
    opacity: 1;
  }

  .toolbar-item:hover:not([disabled]) {
    background-color: #eee;
  }

  .toolbar-item.font-family .text {
    display: block;
    max-width: 40px;
  }

  .code-language {
    width: 150px;
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

  .toolbar-item .icon {
    display: flex;
    width: 20px;
    height: 20px;
    user-select: none;
    margin-right: 8px;
    line-height: 16px;
    background-size: contain;
  }

  i.chevron-down {
    margin-top: 3px;
    width: 16px;
    height: 16px;
    display: flex;
    user-select: none;
  }

  i.chevron-down.inside {
    width: 16px;
    height: 16px;
    display: flex;
    margin-left: -25px;
    margin-top: 11px;
    margin-right: 10px;
    pointer-events: none;
  }

  .divider {
    width: 1px;
    background-color: #eee;
    margin: 0 4px;
  }

  i.bold {
    background-image: url(${iconBold});
  }

  i.link {
    background-image: url(${iconLink});
  }

  i.close {
    background-image: url(${iconClose});
  }

  i.undo {
    background-image: url(${iconUndo});
  }

  i.redo {
    background-image: url(${iconRedo});
  }

  i.chevron-down {
    background-color: transparent;
    background-size: contain;
    display: inline-block;
    height: 8px;
    width: 8px;
    background-image: url(${iconChevronDown});
  }

  .icon.paragraph {
    background-image: url(${iconParagraph});
  }

  .icon.h1 {
    background-image: url(${iconH1});
  }

  .icon.h2 {
    background-image: url(${iconH2});
  }

  .icon.bullet-list,
  .icon.bullet {
    background-image: url(${iconUl});
  }

  .icon.numbered-list,
  .icon.number {
    background-image: url(${iconOl});
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

  .icon {
    display: flex;
    width: 20px;
    height: 20px;
    user-select: none;
    margin-right: 12px;
    line-height: 16px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
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

  #block-controls span.block-type {
    background-size: contain;
    display: block;
    width: 18px;
    height: 18px;
    margin: 2px;
  }

  #block-controls span.block-type.paragraph {
    background-image: url(${iconParagraph});
  }

  #block-controls span.block-type.h1 {
    background-image: url(${iconH1});
  }

  #block-controls span.block-type.h2 {
    background-image: url(${iconH2});
  }

  #block-controls span.block-type.ul {
    background-image: url(${iconUl});
  }

  #block-controls span.block-type.ol {
    background-image: url(${iconOl});
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
    .font-size .dropdown-button-text {
      display: flex !important;
    }
    .code-language .dropdown-button-text {
      display: flex !important;
    }
  }
`;
