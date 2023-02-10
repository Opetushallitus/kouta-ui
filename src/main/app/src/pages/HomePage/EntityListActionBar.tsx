import React, { useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { match } from 'ts-pattern';

import IconButton from '#/src/components/IconButton';
import Select from '#/src/components/Select';
import { Box } from '#/src/components/virkailija';
import { ENTITY, JULKAISUTILA } from '#/src/constants';
import { getThemeProp, spacing } from '#/src/theme';

import { useEntitySelection } from './useEntitySelection';

const ButtonBox = styled(Box)`
  display: flex;
  background-color: ${getThemeProp('palette.primary.main')};
  color: white;
  padding: ${spacing(1)};
  align-items: center;
  border-radius: 3px;
`;

const ActionButton = styled(IconButton).attrs({ variant: 'text' })`
  color: white;
  padding: 8px;
  &:hover {
    color: white;
    background-color: #006a8a;
  }
`;

const VerticalSeparator = styled(Box).attrs({ marginLeft: 2, marginRight: 2 })`
  display: block;
  height: auto;
  width: 1px;
  border-left: 1px solid #00526c;
  padding: 0;
  align-self: stretch;
`;

function getJulkaisutilaTranslationKeyForDropdown(tila: JULKAISUTILA): string {
  if (tila === JULKAISUTILA.TALLENNETTU) return 'julkaisutilat.tallennettu';
  if (tila === JULKAISUTILA.ARKISTOITU) return 'julkaisutilat.arkistoitu';
  if (tila === JULKAISUTILA.JULKAISTU) return 'julkaisutilat.julkaistu';
  if (tila === JULKAISUTILA.POISTETTU) return 'julkaisutilat.poistettu';
  if (tila === undefined) return '';
  throw new Error(`Unknown julkaisutila given: ${tila}`);
}

const useTilaOptions = t =>
  useMemo(
    () =>
      _.flow(
        _.values,
        tilat => _.filter(tilat, x => x !== JULKAISUTILA.POISTETTU),
        tilat =>
          _.map(tilat, tila => ({
            label: t(getJulkaisutilaTranslationKeyForDropdown(tila)),
            value: tila,
          }))
      )(JULKAISUTILA),
    [t]
  );

type EntityListActionBarProps = {
  entityType: ENTITY;
  copyEntities?: () => void;
  changeTila?: (tila?: JULKAISUTILA) => void;
  tila?: JULKAISUTILA;
};

const getJulkaisutilaFromString = (t?: string) =>
  match(t)
    .with('tallennettu', () => JULKAISUTILA.TALLENNETTU)
    .with('arkistoitu', () => JULKAISUTILA.ARKISTOITU)
    .with('julkaistu', () => JULKAISUTILA.JULKAISTU)
    .with('poistettu', () => JULKAISUTILA.POISTETTU)
    .otherwise(() => undefined);

export const EntityListActionBar = ({
  entityType,
  copyEntities,
  changeTila,
  tila,
}: EntityListActionBarProps) => {
  const { t } = useTranslation();

  const { selection, removeSelection } = useEntitySelection(entityType);

  const isDisabled = _.size(selection) === 0;

  const tilaOptions = useTilaOptions(t);

  return (
    <ButtonBox display="flex">
      <Box padding={1}>
        {t(`etusivu.${entityType}.valitut`, { count: _.size(selection) })}
      </Box>
      {changeTila && (
        <>
          <VerticalSeparator />
          <Box flexGrow={0} minWidth="180px" paddingRight={2}>
            <Select
              options={tilaOptions}
              placeholder={t('yleiset.vaihdaTila')}
              onChange={ti => {
                changeTila(getJulkaisutilaFromString(ti?.value));
              }}
              value={tila ? { value: tila } : null}
              disabled={isDisabled}
              isClearable={false}
            />
          </Box>
        </>
      )}

      <VerticalSeparator />
      <ActionButton
        iconType="deselect"
        variant="text"
        onClick={removeSelection}
        disabled={isDisabled}
      >
        {t('etusivu.poistaValinta')}
      </ActionButton>
      <VerticalSeparator />
      {copyEntities && (
        <ActionButton
          iconType="file_copy"
          variant="text"
          onClick={copyEntities}
          disabled={isDisabled}
        >
          {t('etusivu.kopioi')}
        </ActionButton>
      )}
    </ButtonBox>
  );
};
