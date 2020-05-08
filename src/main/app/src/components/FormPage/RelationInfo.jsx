import React from 'react';
import { isObject } from 'lodash';
import Typography from '../Typography';
import { getFirstLanguageValue } from '../../utils';
import Flex, { FlexItem } from '../Flex';
import LocalLink from '#/src/components/LocalLink';

const getEntityName = entity => {
  return entity && isObject(entity.nimi)
    ? getFirstLanguageValue(entity.nimi)
    : null;
};

export const RelationInfoContainer = ({ children }) => {
  const justify =
    React.Children.count(children) === 1
      ? { justifyEnd: true }
      : { justifyBetween: true };
  return (
    <Flex marginBottom={2} {...justify}>
      {children}
    </Flex>
  );
};

export function RelationInfo({ title = '', entity, linkUrl }) {
  const name = getEntityName(entity) || '';
  return (
    <FlexItem grow={0}>
      {entity && (
        <>
          <Typography variant="h6" marginBottom={1}>
            {title}
          </Typography>
          <Typography>
            {linkUrl ? <LocalLink to={linkUrl}>{name}</LocalLink> : name}
          </Typography>
        </>
      )}
    </FlexItem>
  );
}
