import styled, { css } from 'styled-components';

const SegmentTab = styled.button<{
  active?: boolean;
  isInTabs?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}>`
  background-color: transparent;
  border-color: rgba(0, 0, 0, 0.2);
  border-width: 1px 1px 1px 1px;
  border-style: solid;
  font-size: 1rem;
  min-width: 12rem;
  padding: 6px 12px;
  line-height: ${({ theme }) => theme.lineHeights.body};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  cursor: pointer;
  outline: none;
  position: relative;
  transition:
    border-color 0.25s,
    box-shadow 0.25s,
    background-color 0.25s,
    color 0.25s;
  box-shadow: 0px 0px 0px 0px transparent;

  &:focus {
    box-shadow: 0px 0px 0px 2px
      ${({ theme }) => theme.colors.primary.focusOutline};
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${({ active }) =>
    active &&
    css`
      background-color: ${({ theme }) => theme.colors.primary.main};
      color: white;
      border-color: ${({ theme }) => theme.colors.primary.main};
    `}

  ${({ isInTabs }) =>
    isInTabs &&
    css`
      margin-left: -1px;
    `}

  ${({ isFirst }) =>
    isFirst &&
    css`
      margin-left: 0px;
      border-top-left-radius: ${({ theme }) => theme.radii[1]}px;
      border-bottom-left-radius: ${({ theme }) => theme.radii[1]}px;
    `}
  
    ${({ isLast }) =>
    isLast &&
    css`
      border-top-right-radius: ${({ theme }) => theme.radii[1]}px;
      border-bottom-right-radius: ${({ theme }) => theme.radii[1]}px;
    `}
`;

export default SegmentTab;
