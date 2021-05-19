import React, { useCallback, useState } from 'react';

import { transparentize } from 'polished';
import styled, { css } from 'styled-components';

import CollapseContent from '#/src/components/CollapseContent';
import Heading from '#/src/components/Heading';
import { Box, Icon } from '#/src/components/virkailija';
import { getThemeProp } from '#/src/theme';

const SectionInnerCollapseHeader = styled.div`
  display: flex;
  transition-property: color, background-color border-radius;
  transition-duration: 0.4s;
  color: black;
  background-color: ${getThemeProp('colors.grayLighten6')};
  cursor: pointer;
  flex: 0 0 auto;
  border-radius: 4px;
  padding: 22px 20px 22px 30px;
  ${({ isOpen }) =>
    isOpen &&
    css`
      background-color: ${getThemeProp('colors.primary.main')};
      border-radius: 4px 4px 0 0;
      & > * {
        color: white;
      }
    `}
  & > * {
    margin: 0;
    line-height: 24px;
  }
`;

const SectionInnerCollapseContent = styled(Box)`
  background-color: ${getThemeProp('colors.blueLighten4', transparentize(0.7))};
  padding: 22px 30px;
`;

const SectionInnerCollapseToggle = ({ header, isOpen, onToggle }) => {
  return (
    <SectionInnerCollapseHeader onClick={onToggle} isOpen={isOpen}>
      <Heading>
        <span>{header}</span>
        <Icon
          style={{ float: 'right' }}
          type={isOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
        />
      </Heading>
    </SectionInnerCollapseHeader>
  );
};

type SectionInnerCollapseProps = {
  header: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
};

export const SectionInnerCollapse = ({
  header,
  children,
  defaultOpen,
}: SectionInnerCollapseProps) => {
  const [isOpen, setIsOpen] = useState(() => defaultOpen);

  const onToggle = useCallback(() => setIsOpen(open => !open), [setIsOpen]);

  return (
    <Box>
      <SectionInnerCollapseToggle
        onToggle={onToggle}
        isOpen={isOpen}
        header={header}
      ></SectionInnerCollapseToggle>
      <CollapseContent open={isOpen}>
        <SectionInnerCollapseContent>{children}</SectionInnerCollapseContent>
      </CollapseContent>
    </Box>
  );
};
