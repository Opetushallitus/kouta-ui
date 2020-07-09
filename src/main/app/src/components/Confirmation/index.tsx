import React, { useCallback } from 'react';
import { setLightness } from 'polished';
import styled, { css } from 'styled-components';
import { noop, isString } from 'lodash';
import Dropdown, { DropdownMenu } from '#/src/components/Dropdown';
import { getThemeProp, spacing } from '#/src/theme';
import { createChainedFunction } from '#/src/utils';
import Typography from '#/src/components/Typography';
import Flex, { FlexItem } from '#/src/components/Flex';

const Wrapper = styled.div`
  overflow: hidden;
  border-radius: ${getThemeProp('shape.borderRadius')};
`;

const ContentContainer = styled.div`
  padding: ${spacing(1)} ${spacing(2)};
  border-bottom: 1px solid ${getThemeProp('palette.border')};
`;

const Action = styled(FlexItem).attrs({ grow: 1 })`
  text-align: center;
  ${getThemeProp('typography.body')};
  cursor: pointer;
  padding: ${spacing(1)} ${spacing(2)};
  transition: background-color 0.25s;

  ${({ success }) =>
    success &&
    css`
      color: ${getThemeProp('palette.success.main')};

      &:hover {
        background-color: ${({ theme }) =>
          setLightness(0.95, theme.palette.success.main)};
      }
    `}

  ${({ danger }) =>
    danger &&
    css`
      color: ${getThemeProp('palette.danger.main')};

      &:hover {
        background-color: ${({ theme }) =>
          setLightness(0.95, theme.palette.danger.main)};
      }
    `}
`;

export const Confirmation = ({
  content = 'Oletko varma?',
  onConfirm = noop,
  ...props
}) => {
  const overlay = useCallback(
    ({ onToggle }) => (
      <DropdownMenu>
        <Wrapper>
          <ContentContainer>
            {isString(content) ? <Typography>{content}</Typography> : content}
          </ContentContainer>
          <Flex>
            <Action
              onClick={createChainedFunction(onConfirm, onToggle)}
              success
            >
              Vahvista
            </Action>
            <Action onClick={onToggle} danger>
              Peruuta
            </Action>
          </Flex>
        </Wrapper>
      </DropdownMenu>
    ),
    [onConfirm, content]
  );

  return <Dropdown overlay={overlay} closeOnOverlayClick={false} {...props} />;
};

export default Confirmation;
