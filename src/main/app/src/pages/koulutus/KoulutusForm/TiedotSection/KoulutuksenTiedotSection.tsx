import React, { useMemo, useEffect } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { usePrevious } from 'react-use';
import { Field } from 'redux-form';
import styled from 'styled-components';
import { Grid, Cell } from 'styled-css-grid';

import Anchor from '#/src/components/Anchor';
import { FormFieldSelect } from '#/src/components/formFields';
import KoulutusField from '#/src/components/KoulutusField';
import { Box, Typography, Spin } from '#/src/components/virkailija';
import { useUrls } from '#/src/contexts/UrlContext';
import { useBoundFormActions, useIsDirty } from '#/src/hooks/form';
import { useFieldValue } from '#/src/hooks/form';
import { getReadableDateTime, getTestIdProps } from '#/src/utils';
import {
  getEPerusteStatus,
  getEPerusteStatusCss,
} from '#/src/utils/ePeruste/ePerusteStatus';
import { useKoulutusByKoodi } from '#/src/utils/koulutus/getKoulutusByKoodi';
import { useTutkinnonOsienKuvaukset } from '#/src/utils/koulutus/getTutkinnonOsanKuvaus';
import { getLanguageValue } from '#/src/utils/languageUtils';

import {
  InfoBoxGrid,
  StyledInfoBox,
} from '../KoulutuksenEPerusteTiedot/InfoBox';

const getListNimiLanguageValues = (list = [], language) =>
  list
    .map(({ nimi }) => getLanguageValue(nimi, language))
    .filter(name => !!name);

const getTutkinnonosatOptions = (selectedPeruste, language) =>
  _.map(
    selectedPeruste?.tutkinnonosat ?? [],
    ({ _tutkinnonOsa, nimi, laajuus, id }) => ({
      label: `${getLanguageValue(nimi, language)}, ${laajuus} osp`,
      value: _tutkinnonOsa,
      viite: id,
    })
  );

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
      isMulti={true}
      {...props}
    />
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

const TutkinnonOsaInfo = ({ ePerusteId, tutkinnonOsa, language }) => {
  const { t } = useTranslation();
  const apiUrls = useUrls();
  return (
    <InfoBoxGrid
      style={{ marginBottom: '40px' }}
      rows={[
        {
          title: t('yleiset.nimi'),
          description: `${getLanguageValue(tutkinnonOsa.nimi, language)}`,
        },
        {
          title: t('yleiset.koodi'),
          description: (
            <Anchor
              href={apiUrls.url(
                'eperusteet.tutkinnonosat',
                language,
                ePerusteId,
                tutkinnonOsa?.id
              )}
              target="_blank"
            >
              {tutkinnonOsa?.koodiArvo}
            </Anchor>
          ),
        },
      ]}
    />
  );
};

const KoulutusInfo = ({
  koulutus,
  language = 'fi',
  ePeruste,
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
      opintojenlaajuus: ePeruste?.laajuus,
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

  const tutkinnonosatFieldValue = useFieldValue(`${name}.osat`);
  const selectedTutkinnonosat = useMemo(
    () =>
      _.filter(ePeruste?.tutkinnonosat, t =>
        _.some(
          tutkinnonosatFieldValue,
          ({ value }) => value === t._tutkinnonOsa
        )
      ),
    [ePeruste, tutkinnonosatFieldValue]
  );

  const { data: kuvaukset } = useTutkinnonOsienKuvaukset({
    tutkinnonOsat: selectedTutkinnonosat?.map(t => t?._tutkinnonOsa),
  });

  const tutkinnonOsienKuvaukset = kuvaukset?.map(({ id, koodiArvo }) => {
    return {
      ...(selectedTutkinnonosat?.find(
        t => _.toNumber(t?._tutkinnonOsa) === id
      ) || {}),
      koodiArvo,
    };
  });

  return koulutus || isLoading ? (
    isLoading ? (
      <StyledInfoBox>
        <Spin center />
      </StyledInfoBox>
    ) : (
      <StyledInfoBox>
        <Typography variant="h6" mb={2}>
          {t('koulutuslomake.koulutuksenTiedot')}
        </Typography>
        <InfoBoxGrid
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
                      description: getReadableDateTime(
                        ePeruste?.voimassaoloAlkaa
                      ),
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
              name={`${name}.osat`}
              selectedPeruste={ePeruste}
              language={language}
            />
          </Box>
        )}
        {_.map(tutkinnonOsienKuvaukset, tutkinnonOsa => (
          <TutkinnonOsaInfo
            key={tutkinnonOsa?.id}
            tutkinnonOsa={tutkinnonOsa}
            language={language}
            ePerusteId={ePeruste?.id}
          />
        ))}
      </StyledInfoBox>
    )
  ) : null;
};

const KoulutuksenTiedotSection = ({
  disabled,
  language,
  koulutuskoodi,
  name,
  selectLabel: selectLabelProp = undefined,
}) => {
  const { t } = useTranslation();
  const koulutusFieldValue = koulutuskoodi?.value;

  const { data: koulutus, isLoading } = useKoulutusByKoodi({
    koodiUri: koulutusFieldValue,
  });

  const ePerusteFieldValue = useFieldValue(`${name}.eperuste`)?.value;
  const ePerusteet = koulutus?.ePerusteet;

  const selectedPeruste = _.find(
    ePerusteet,
    ePeruste => ePeruste.id.toString() === _.toString(ePerusteFieldValue ?? '')
  );

  const { change } = useBoundFormActions();
  const isDirty = useIsDirty();

  const previousKoulutus = usePrevious(koulutusFieldValue);

  useEffect(() => {
    if (isDirty && previousKoulutus !== koulutusFieldValue) {
      change(`${name}.eperuste`, null);
    }
  }, [change, koulutusFieldValue, isDirty, name, previousKoulutus]);

  const previousEPeruste = usePrevious(ePerusteFieldValue);

  useEffect(() => {
    if (isDirty && previousEPeruste !== ePerusteFieldValue) {
      change(`${name}.osat`, null);
    }
  }, [change, ePerusteFieldValue, isDirty, name, previousEPeruste]);

  const selectLabel = selectLabelProp || t('yleiset.valitseKoulutus');

  return (
    <Box display="flex" flexDirection="column">
      <Box flexDirection="row" display="flex" mb={3}>
        <Box width={0.5} mr={2} {...getTestIdProps('koulutusSelect')}>
          <KoulutusField
            disabled={disabled}
            name={`${name}.koulutus`}
            label={selectLabel}
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
        <KoulutusInfo
          ePeruste={selectedPeruste}
          koulutus={koulutus}
          language={language}
          isLoading={isLoading}
          name={name}
        />
      </Box>
    </Box>
  );
};

export default KoulutuksenTiedotSection;
