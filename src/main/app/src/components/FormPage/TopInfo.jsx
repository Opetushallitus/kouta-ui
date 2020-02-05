import React from 'react';
import styled from 'styled-components';
import Anchor from '../Anchor';
import Typography from '../Typography';
import { isObject, getFirstLanguageValue } from '../../utils';

const getEntityName = entity => {
  return entity && isObject(entity.nimi)
    ? getFirstLanguageValue(entity.nimi)
    : null;
};

export const TopInfoContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.unit * 2}px;
  display: flex;
  justify-content: space-between;
`;

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
      {!disableContainer && <div></div>}
      <div>
        {entity && (
          <>
            <Typography as="div" marginBottom={0.5}>
              {title}:
            </Typography>
            <Typography
              style={{ fontWeight: 'bold' }}
              as="div"
              marginBottom={0.5}
            >
              {link ? <Anchor href={link}>{name}</Anchor> : name}
            </Typography>
          </>
        )}
      </div>
    </ContainerIf>
  );
}
