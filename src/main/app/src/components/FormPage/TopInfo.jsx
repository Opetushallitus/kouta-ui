import React from 'react';
import Anchor from '../Anchor';
import Typography from '../Typography';
import { isObject, getFirstLanguageValue } from '../../utils';
import Flex, { FlexItem } from '../Flex';

const getEntityName = entity => {
  return entity && isObject(entity.nimi)
    ? getFirstLanguageValue(entity.nimi)
    : null;
};

export const TopInfoContainer = ({ children }) => (
  <Flex marginBottom={2} justifyBetween>
    {children}
  </Flex>
);

const ContainerIf = ({ children, condition }) => {
  return condition ? <TopInfoContainer>{children}</TopInfoContainer> : children;
};

export function TopInfo({
  title = '',
  entity,
  link,
  disableContainer = false,
}) {
  const name = entity ? getEntityName(entity) || '' : '';
  return (
    <ContainerIf condition={!disableContainer}>
      {!disableContainer && <FlexItem grow={1} />}
      <FlexItem grow={0}>
        <Typography variant="h6" marginBottom={1}>
          {title}
        </Typography>
        <Typography>
          {link ? <Anchor href={link}>{name}</Anchor> : name}
        </Typography>
      </FlexItem>
    </ContainerIf>
  );
}
