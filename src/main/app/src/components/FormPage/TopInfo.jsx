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

export const TopInfoContainer = ({ children }) => {
  const justify =
    React.Children.toArray(children).length === 1
      ? { justifyEnd: true }
      : { justifyBetween: true };
  return (
    <Flex marginBottom={2} {...justify}>
      {children}
    </Flex>
  );
};

export function TopInfo({ title = '', entity, link }) {
  const name = getEntityName(entity) || '';
  return (
    <FlexItem grow={0}>
      {entity && (
        <>
          <Typography variant="h6" marginBottom={1}>
            {title}
          </Typography>
          <Typography>
            {link ? <Anchor href={link}>{name}</Anchor> : name}
          </Typography>
        </>
      )}
    </FlexItem>
  );
}
