import React, { useMemo, useEffect } from 'react';
import _ from 'lodash';
import { Grid, Cell } from 'styled-css-grid';
import styled from 'styled-components';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';
import { Box, Spin } from '#/src/components/virkailija';
import Anchor from '#/src/components/Anchor';
import {
  getEPerusteStatusCss,
  getEPerusteStatus,
} from '#/src/utils/ePeruste/ePerusteStatus';
import { getLanguageValue } from '#/src/utils/languageUtils';
import { getTestIdProps, getReadableDateTime } from '#/src/utils';
import {
  useFieldValue,
  useBoundFormActions,
  useIsDirty,
} from '#/src/hooks/form';
import { useUrls } from '#/src/contexts/contextHooks';
import { FormFieldSelect } from '#/src/components/formFields';
import { useHasChanged } from '#/src/hooks/useHasChanged';
import { InfoBoxGrid, StyledInfoBox } from './InfoBox';

const getListNimiLanguageValues = (list = [], language) =>
  list
    .map(({ nimi }) => getLanguageValue(nimi, language))
    .filter(name => !!name);

const TilaBadge = ({ status = '', className }) => {
  const { t } = useTranslation();
  return (
    <div className={className}>{t(`yleiset.ePerusteStatus.${status}`)}</div>
  );
};

const StyledTilaBadge = styled(TilaBadge)`
  display: inline-block;
  padding: 1px 10px;
  font-weight: bold;
  ${getEPerusteStatusCss}
`;

const getEPerusteetOptions = (ePerusteet, language) =>
  _.map(ePerusteet, ({ id, nimi, diaarinumero }) => ({
    label: `${getLanguageValue(nimi, language)} (${diaarinumero})`,
    value: id,
  }));

const EPerusteField = ({ isLoading, ...props }) => {
  const { ePerusteet, language } = props;
  const { t } = useTranslation();
  const ePerusteOptions = useMemo(
    () => getEPerusteetOptions(ePerusteet, language),
    [ePerusteet, language]
  );

  return (
    <Field
      component={FormFieldSelect}
      label={t('koulutuslomake.valitseKaytettavaEperuste')}
      options={ePerusteOptions}
      disabled={isLoading || _.isNil(ePerusteet) || _.isEmpty(ePerusteet)}
      {...props}
    />
  );
};

export const ValitseEPerusteBox = ({
  fieldName,
  ePerusteet,
  language,
  selectedKoulutus,
  koulutusIsLoading = false,
}) => {
  const { t } = useTranslation();
  const apiUrls = useUrls();
  const ePerusteId = useFieldValue(fieldName)?.value;
  const ePeruste = ePerusteet?.find(({ id }) => id === ePerusteId);

  const { opintojenlaajuus, nimikkeet, osaamisalat } = useMemo(
    () => ({
      opintojenlaajuus: ePeruste?.laajuus,
      nimikkeet: ePeruste
        ? getListNimiLanguageValues(ePeruste.tutkintonimikeKoodit, language)
        : [],
      osaamisalat: ePeruste
        ? getListNimiLanguageValues(ePeruste.osaamisalat, language)
        : [],
    }),
    [ePeruste, language]
  );

  const { change } = useBoundFormActions();
  const isDirty = useIsDirty();

  const koulutusHasChanged = useHasChanged(selectedKoulutus);

  useEffect(() => {
    if (isDirty && koulutusHasChanged) {
      change(fieldName, null);
    }
  }, [change, isDirty, fieldName, koulutusHasChanged]);

  return (
    <StyledInfoBox mb={2}>
      <Box width={0.7} mb={2} {...getTestIdProps('ePerusteSelect')}>
        <EPerusteField
          isLoading={koulutusIsLoading}
          name={fieldName}
          ePerusteet={ePerusteet}
          language={language}
        />
      </Box>
      {koulutusIsLoading ? (
        <Spin />
      ) : ePeruste ? (
        <Grid columns="minmax(300px, 40%) auto">
          <Cell key="eperusteen-tiedot-1">
            <InfoBoxGrid
              rows={[
                {
                  title: t('yleiset.diaarinumero'),
                  description: (
                    <Anchor
                      href={apiUrls.url(
                        'eperusteet.kooste',
                        language,
                        ePeruste?.id
                      )}
                      target="_blank"
                    >
                      {ePeruste?.diaarinumero}
                    </Anchor>
                  ),
                },
                {
                  title: t('yleiset.voimaantulo'),
                  description: getReadableDateTime(ePeruste?.voimassaoloAlkaa),
                },
                {
                  title: t('yleiset.tila'),
                  description: (
                    <StyledTilaBadge status={getEPerusteStatus(ePeruste)} />
                  ),
                },
                {
                  title: t('yleiset.laajuus'),
                  description: opintojenlaajuus,
                  suffix: t('yleiset.osaamispistetta'),
                },
                {
                  title: t('yleiset.tutkintonimike'),
                  description: nimikkeet.map(n => <div key={n}>{n}</div>),
                },
              ]}
            />
          </Cell>
          <Cell key="eperusteen-tiedot-2">
            <InfoBoxGrid
              rows={[
                {
                  title: t('yleiset.osaamisalat'),
                  description: osaamisalat.map(o => <div key={o}>{o}</div>),
                },
              ]}
            />
          </Cell>
        </Grid>
      ) : (
        <div></div>
      )}
    </StyledInfoBox>
  );
};