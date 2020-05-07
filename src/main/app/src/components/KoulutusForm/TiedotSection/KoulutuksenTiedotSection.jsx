import React, { useMemo, useEffect, useContext } from 'react';
import { find, isEmpty, isNil, get, map } from 'lodash';
import { Field } from 'redux-form';
import styled from 'styled-components';
import { Grid, Cell } from 'styled-css-grid';
import { useTranslation } from 'react-i18next';
import { getKoulutusByKoodi } from '#/src/apiUtils';
import { getThemeProp } from '#/src/theme';
import {
  getReadableDateTime,
  getLanguageValue,
  getTestIdProps,
} from '#/src/utils';
import {
  getEPerusteStatus,
  getEPerusteStatusCss,
} from '#/src/utils/ePeruste/ePerusteStatus';
import { useBoundFormActions, useBoundFormSelectors } from '#/src/hooks/form';
import Anchor from '#/src/components/Anchor';
import Box from '#/src/components/Box';
import { FormFieldSelect } from '#/src/components/formFields';
import Spin from '#/src/components/Spin';
import Typography from '#/src/components/Typography';
import useApiAsync from '#/src/components/useApiAsync';
import UrlContext from '#/src/components/UrlContext';
import { useFieldValue } from '#/src/hooks/form';
import KoulutusField from '../KoulutusField';

const getListNimiLanguageValues = (list = [], language) =>
  list
    .map(({ nimi }) => getLanguageValue(nimi, language))
    .filter(name => !!name);

const getEPerusteetOptions = (ePerusteet, language) =>
  map(ePerusteet, ({ id, nimi, diaarinumero }) => ({
    label: `${getLanguageValue(nimi, language)} (${diaarinumero})`,
    value: id,
  }));

const EPerusteField = ({ isLoading, ...props }) => {
  const { ePerusteet, language } = props;
  const { t } = useTranslation();
  const ePerusteOptions = useMemo(
    () => getEPerusteetOptions(ePerusteet, language),
    [ePerusteet, language],
  );

  return (
    <Field
      component={FormFieldSelect}
      label={t('koulutuslomake.valitseKaytettavaEperuste')}
      options={ePerusteOptions}
      isDisabled={isLoading || isNil(ePerusteet) || isEmpty(ePerusteet)}
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
          {isNil(description) || get(description, 'length') === 0
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
      opintojenlaajuus: get(ePeruste, 'laajuus'),
      nimikkeet: ePeruste
        ? getListNimiLanguageValues(ePeruste.tutkintonimikeKoodit, language)
        : [],
      osaamisalat: ePeruste
        ? getListNimiLanguageValues(ePeruste.osaamisalat, language)
        : [],
    }),
    [koulutus, ePeruste, language],
  );
  const apiUrls = useContext(UrlContext);

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
                              get(ePeruste, 'id'),
                            )}
                            target="_blank"
                          >
                            {get(ePeruste, 'diaarinumero')}
                          </Anchor>
                        ),
                      },
                      {
                        title: t('yleiset.voimaantulo'),
                        description: getReadableDateTime(
                          get(ePeruste, 'voimassaoloAlkaa'),
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
        </>
      )}
    </div>
  ) : null;
};

const StyledKoulutusInfo = styled(KoulutusInfo)`
  background-color: ${getThemeProp('colors.secondaryBackground')};
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
  const koulutusFieldValue = get(koulutuskoodi, 'value');

  const { data: koulutus, isLoading } = useApiAsync({
    promiseFn: getKoulutusByKoodi,
    koodiUri: koulutusFieldValue,
    watch: koulutusFieldValue,
  });

  const ePerusteFieldValue = useFieldValue(`${name}.eperuste`);
  const ePerusteet = get(koulutus, 'ePerusteet');

  const selectedPeruste = find(
    ePerusteet,
    ePeruste => ePeruste.id === get(ePerusteFieldValue, 'value'),
  );

  const { change } = useBoundFormActions();
  const { isDirty } = useBoundFormSelectors();

  useEffect(() => {
    if (isDirty()) {
      change(`${name}.eperuste`, null);
    }
  }, [change, koulutusFieldValue, isDirty, name]);

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
          />
        </Box>
      </Box>
    </Box>
  );
};

export default KoulutuksenTiedotSection;
