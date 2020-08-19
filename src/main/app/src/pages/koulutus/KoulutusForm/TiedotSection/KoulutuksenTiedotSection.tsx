import React, { useMemo, useEffect } from 'react';
import _ from 'lodash';
import { Field } from 'redux-form';
import styled from 'styled-components';
import { Grid, Cell } from 'styled-css-grid';
import { useTranslation } from 'react-i18next';
import { usePrevious } from 'react-use';

import { getKoulutusByKoodi } from '#/src/utils/koulutus/getKoulutusByKoodi';
import { getThemeProp } from '#/src/theme';
import { getReadableDateTime, getTestIdProps } from '#/src/utils';
import { getLanguageValue } from '#/src/utils/languageUtils';
import {
  getEPerusteStatus,
  getEPerusteStatusCss,
} from '#/src/utils/ePeruste/ePerusteStatus';
import { useBoundFormActions, useIsDirty } from '#/src/hooks/form';
import Anchor from '#/src/components/Anchor';
import { Box, Typography, Spin } from '#/src/components/virkailija';
import { FormFieldSelect } from '#/src/components/formFields';
import useApiAsync from '#/src/hooks/useApiAsync';
import { useFieldValue } from '#/src/hooks/form';
import KoulutusField from '../KoulutusField';
import { useUrls } from '#/src/contexts/contextHooks';

const getListNimiLanguageValues = (list = [], language) =>
  list
    .map(({ nimi }) => getLanguageValue(nimi, language))
    .filter(name => !!name);

const getTutkinnonosatOptions = (selectedPeruste, language) =>
  _.map(selectedPeruste?.tutkinnonosat ?? [], ({ id, nimi, laajuus }) => ({
    label: `${getLanguageValue(nimi, language)}, ${laajuus} osp`,
    value: id,
  }));

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

const TutkinnonOsatField = ({ isLoading, ...props }) => {
  const { selectedPeruste, language } = props;
  const { t } = useTranslation();

  const tutkinnonosatOptions = useMemo(
    () => getTutkinnonosatOptions(selectedPeruste, language),
    [selectedPeruste, language]
  );

  return (
    <Field
      component={FormFieldSelect}
      label={t('koulutuslomake.valitseKaytettavaTutkinnonOsa')}
      options={tutkinnonosatOptions}
      disabled={
        isLoading || _.isNil(selectedPeruste) || _.isEmpty(selectedPeruste)
      }
      {...props}
    />
  );
};

const InfoRow = ({ title, description, suffix }) => {
  return (
    <React.Fragment>
      <Cell key="title-cell">
        <Typography color="text.dark">{title}:</Typography>
      </Cell>
      <Cell key="description-cell">
        <Typography>
          {_.isNil(description) || _.get(description, 'length') === 0
            ? '-'
            : description}
          {description && suffix ? ` ${suffix}` : ''}
        </Typography>
      </Cell>
    </React.Fragment>
  );
};

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

const InfoGrid = ({ rows, ...props }) => (
  <Grid
    columns={'auto minmax(0, 1fr)'}
    columnGap="20px"
    rowGap="25px"
    {...props}
  >
    {rows.map(({ title, description, suffix }) => (
      <InfoRow
        key={title}
        title={title}
        description={description}
        suffix={suffix}
      />
    ))}
  </Grid>
);

const KoulutusInfo = ({
  koulutus,
  language = 'fi',
  ePeruste,
  className,
  isLoading,
  name,
}) => {
  const { t } = useTranslation();

  const {
    nimi,
    koulutusala,
    opintojenlaajuus,
    nimikkeet,
    osaamisalat,
  } = useMemo(
    () => ({
      nimi: koulutus ? getLanguageValue(koulutus.nimi, language) : undefined,
      koulutusala: koulutus
        ? getLanguageValue(koulutus.koulutusala, language)
        : undefined,
      opintojenlaajuus: _.get(ePeruste, 'laajuus'),
      nimikkeet: ePeruste
        ? getListNimiLanguageValues(ePeruste.tutkintonimikeKoodit, language)
        : [],
      osaamisalat: ePeruste
        ? getListNimiLanguageValues(ePeruste.osaamisalat, language)
        : [],
    }),
    [koulutus, ePeruste, language]
  );
  const apiUrls = useUrls();

  const tutkinnonosatFieldValue = useFieldValue(`${name}.tutkinnonosat`);
  const selectedTutkinnonosat = _.find(
    ePeruste?.tutkinnonosat,
    t => t.id === _.get(tutkinnonosatFieldValue, 'value')
  );
  return koulutus || isLoading ? (
    <div className={className}>
      {isLoading ? (
        <Spin center />
      ) : (
        <>
          <Typography variant="h6" mb={2}>
            {t('koulutuslomake.koulutuksenTiedot')}
          </Typography>
          <InfoGrid
            style={{ marginBottom: '40px' }}
            rows={[
              {
                title: t('yleiset.koulutus'),
                description: `${nimi} (${koulutus.koodiArvo})`,
              },
              {
                title: t('yleiset.koulutusala'),
                description: koulutusala,
              },
            ]}
          />
          {ePeruste && (
            <>
              <Typography variant="h6" mb={2}>
                {t('yleiset.ePerusteenTiedot')}
              </Typography>
              <Grid columns="minmax(300px, 40%) auto">
                <Cell key="eperusteen-tiedot-1">
                  <InfoGrid
                    rows={[
                      {
                        title: t('yleiset.diaarinumero'),
                        description: (
                          <Anchor
                            href={apiUrls.url(
                              'eperusteet.kooste',
                              language,
                              _.get(ePeruste, 'id')
                            )}
                            target="_blank"
                          >
                            {_.get(ePeruste, 'diaarinumero')}
                          </Anchor>
                        ),
                      },
                      {
                        title: t('yleiset.voimaantulo'),
                        description: getReadableDateTime(
                          _.get(ePeruste, 'voimassaoloAlkaa')
                        ),
                      },
                      {
                        title: t('yleiset.tila'),
                        description: (
                          <StyledTilaBadge
                            status={getEPerusteStatus(ePeruste)}
                          />
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
                  <InfoGrid
                    rows={[
                      {
                        title: t('yleiset.osaamisalat'),
                        description: osaamisalat.map(o => (
                          <div key={o}>{o}</div>
                        )),
                      },
                    ]}
                  />
                </Cell>
              </Grid>
            </>
          )}
          {ePeruste?.tutkinnonosat && (
            <Box
              width={0.5}
              mr={2}
              mt={5}
              mb={5}
              {...getTestIdProps('tutkinnonOsatSelect')}
            >
              <TutkinnonOsatField
                isLoading={isLoading}
                name={`${name}.tutkinnonosat`}
                selectedPeruste={ePeruste}
                language={language}
              />
            </Box>
          )}
          {selectedTutkinnonosat && (
            <InfoGrid
              style={{ marginBottom: '40px' }}
              rows={[
                {
                  title: t('yleiset.nimi'),
                  description: `${getLanguageValue(
                    selectedTutkinnonosat.nimi,
                    language
                  )}`,
                },
                {
                  title: t('yleiset.koodi'),
                  description: (
                    <Anchor
                      href={apiUrls.url(
                        'eperusteet.tutkinnonosat',
                        language,
                        _.get(ePeruste, 'id'),
                        _.get(selectedTutkinnonosat, 'id')
                      )}
                      target="_blank"
                    >
                      {_.get(selectedTutkinnonosat, 'id')}
                    </Anchor>
                  ),
                },
              ]}
            />
          )}
        </>
      )}
    </div>
  ) : null;
};

const StyledKoulutusInfo = styled(KoulutusInfo)`
  background-color: ${getThemeProp('colors.grayLighten6')};
  padding: ${({ theme }) => theme.spacing.unit * 4}px;
  line-height: 23px;
`;

const KoulutuksenTiedotSection = ({
  disabled,
  koulutustyyppi,
  language,
  koulutuskoodi,
  name,
  selectLabel: selectLabelProp,
}) => {
  const { t } = useTranslation();
  const koulutusFieldValue = _.get(koulutuskoodi, 'value');

  const { data: koulutus, isLoading } = useApiAsync({
    promiseFn: getKoulutusByKoodi,
    koodiUri: koulutusFieldValue,
    watch: koulutusFieldValue,
  });

  const ePerusteFieldValue = useFieldValue(`${name}.eperuste`);
  const ePerusteet = _.get(koulutus, 'ePerusteet');

  const selectedPeruste = _.find(
    ePerusteet,
    ePeruste => ePeruste.id === _.get(ePerusteFieldValue, 'value')
  );

  const { change } = useBoundFormActions();
  const isDirty = useIsDirty();

  const previousKoulutus = usePrevious(koulutusFieldValue);

  useEffect(() => {
    if (isDirty && previousKoulutus !== koulutusFieldValue) {
      change(`${name}.eperuste`, null);
    }
  }, [change, koulutusFieldValue, isDirty, name, previousKoulutus]);

  const selectLabel = selectLabelProp || t('koulutuslomake.valitseKoulutus');

  return (
    <Box display="flex" flexDirection="column">
      <Box flexDirection="row" display="flex" mb={3}>
        <Box width={0.5} mr={2} {...getTestIdProps('koulutustyyppiSelect')}>
          <KoulutusField
            disabled={disabled}
            name={`${name}.koulutus`}
            koulutustyyppi={koulutustyyppi}
            label={selectLabel}
            language={language}
          />
        </Box>
        <Box width={0.5} ml={2} {...getTestIdProps('ePerusteSelect')}>
          <EPerusteField
            isLoading={isLoading}
            name={`${name}.eperuste`}
            ePerusteet={ePerusteet}
            language={language}
          />
        </Box>
      </Box>
      <Box flexDirection="row" width={1} display="flex" mr={2}>
        <Box width={1}>
          <StyledKoulutusInfo
            disabled={disabled}
            ePeruste={selectedPeruste}
            koulutus={koulutus}
            language={language}
            isLoading={isLoading}
            name={name}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default KoulutuksenTiedotSection;
