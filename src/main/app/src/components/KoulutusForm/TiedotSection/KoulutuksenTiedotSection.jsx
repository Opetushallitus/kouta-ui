import React, { useMemo, useEffect, useContext } from 'react';
import { find, isEmpty, isNil, get, map } from 'lodash';
import { Field } from 'redux-form';
import styled from 'styled-components';
import { Grid, Cell } from 'styled-css-grid';
import { FormFieldSelect } from '../../formFields';
import Typography from '../../Typography';
import KoulutusField from '../KoulutusField';
import { getKoulutusByKoodi } from '../../../apiUtils';
import { getLanguageValue, getTestIdProps } from '../../../utils';
import useTranslation from '../../useTranslation';
import useApiAsync from '../../useApiAsync';
import Box from '../../Box';
import UrlContext from '../../UrlContext';
import {
  useBoundFormActions,
  useBoundFormSelectors,
} from '../../../hooks/form';
import useFieldValue from '../../useFieldValue';
import { getReadableDateTime } from '../../../utils';
import { getThemeProp } from '../../../theme';
import Anchor from '../../Anchor';

const getPerusteetOptions = (perusteet, language) => {
  return map(perusteet, ({ id, nimi, diaarinumero }) => ({
    label: `${getLanguageValue(nimi, language)} (${diaarinumero})`,
    value: id,
  }));
};

const getTutkintonimikkeet = ({ peruste = {}, language }) => {
  const { tutkintonimikeKoodit = [] } = peruste;

  return tutkintonimikeKoodit
    .map(({ nimi }) => getLanguageValue(nimi, language))
    .filter(name => !!name);
};

const getOsaamisalat = ({ peruste = {}, language }) => {
  const { osaamisalat = [] } = peruste;

  return osaamisalat
    .map(({ nimi }) => getLanguageValue(nimi, language))
    .filter(name => !!name);
};

const PerusteField = props => {
  const { perusteet, language } = props;
  const { t } = useTranslation();
  const perusteetOptions = useMemo(
    () => getPerusteetOptions(perusteet, language),
    [perusteet, language],
  );

  return (
    <Field
      component={FormFieldSelect}
      label={t('koulutuslomake.valitseKaytettavaEperuste')}
      options={perusteetOptions}
      isDisabled={isNil(perusteet) || isEmpty(perusteet)}
      {...props}
    />
  );
};

const InfoRow = ({ title, description }) => {
  return (
    <>
      <Cell>
        <Typography color="text.dark">{title}:</Typography>
      </Cell>
      <Cell>
        <Typography>{description}</Typography>
      </Cell>
    </>
  );
};

const KoulutusInfo = ({
  koulutus,
  language = 'fi',
  visibleInfoFields = [],
  peruste,
  className,
}) => {
  const { t } = useTranslation();

  const {
    nimi,
    koulutusala,
    opintojenlaajuus,
    opintojenlaajuusYksikko,
    nimikkeet,
    osaamisalat,
  } = useMemo(
    () => ({
      nimi: koulutus ? getLanguageValue(koulutus.nimi, language) : undefined,
      koulutusala: koulutus
        ? getLanguageValue(koulutus.koulutusala, language)
        : undefined,
      opintojenlaajuus: koulutus ? koulutus.opintojenlaajuus : undefined,
      opintojenlaajuusYksikko: koulutus
        ? getLanguageValue(koulutus.opintojenlaajuusYksikko, language)
        : undefined,
      nimikkeet: peruste ? getTutkintonimikkeet({ peruste, language }) : [],
      osaamisalat: peruste ? getOsaamisalat({ peruste, language }) : [],
    }),
    [koulutus, peruste, language],
  );
  const apiUrls = useContext(UrlContext);

  return koulutus ? (
    <div className={className}>
      <Typography variant="h6" mb={2}>
        {t('koulutuslomake.koulutuksenTiedot')}
      </Typography>
      <Grid
        columns={'auto minmax(0, 1fr)'}
        style={{ marginBottom: '25px' }}
        columnGap="20px"
      >
        {visibleInfoFields.includes('koulutus') && (
          <InfoRow title={t('yleiset.koulutus')} description={nimi} />
        )}

      {visibleInfoFields.includes('osaamisalat') && (
        <InfoRow
          title={t('yleiset.osaamisalat')}
          description={osaamisalat.map((o, i) => (
            <div key={`osaamisala_${o}-${i}`}>{o}</div>
          ))}
        />
      )}

      {visibleInfoFields.includes('tutkintonimike') && (
        <InfoRow
          title={t('yleiset.tutkintonimike')}
          description={nimikkeet.map((n, i) => (
            <div key={`nimikkeet${n}-${i}`}>{n}</div>
          ))}
        />
      )}

          <Grid columns={2}>
            <Cell>
              <Grid columns={'auto minmax(0, 1fr)'} columnGap="20px">
                <InfoRow
                  title={t('yleiset.diaarinumero')}
                  description={
                    <Anchor
                      href={apiUrls.url(
                        'eperusteet.kooste',
                        language,
                        get(peruste, 'id'),
                      )}
                      target="_blank"
                    >
                      {get(peruste, 'diaarinumero')}
                    </Anchor>
                  }
                />
                <InfoRow
                  title={t('yleiset.voimaantulo')}
                  description={getReadableDateTime(
                    get(peruste, 'voimassaoloAlkaa'),
                  )}
                />
                <InfoRow
                  title={t('yleiset.tila')}
                  description={get(peruste, 'tila')}
                />
                {visibleInfoFields.includes('tutkintonimike') && (
                  <InfoRow
                    title={t('yleiset.tutkintonimike')}
                    description={nimikkeet.map(n => (
                      <div>{n}</div>
                    ))}
                  />
                )}
              </Grid>
            </Cell>
            <Cell>
              <Grid columns={'auto minmax(0, 1fr)'} columnGap="20px">
                {visibleInfoFields.includes('osaamisalat') && (
                  <InfoRow
                    title={t('yleiset.osaamisalat')}
                    description={osaamisalat.map(o => (
                      <div>{o}</div>
                    ))}
                  />
                )}
              </Grid>
            </Cell>
          </Grid>
        </>
      )}
    </div>
  ) : null;
};

const StyledKoulutusInfo = styled(KoulutusInfo)`
  background-color: ${getThemeProp('colors.secondaryBackground')};
  padding: ${({ theme }) => theme.spacing.unit * 4}px;
`;

const defaultVisibleInfoFields = [
  'koulutus',
  'koulutusala',
  'osaamisalat',
  'tutkintonimike',
  'laajuus',
];

const KoulutuksenTiedotSection = ({
  disabled,
  koulutustyyppi,
  language,
  koulutuskoodi,
  name,
  selectLabel: selectLabelProp,
  visibleInfoFields = defaultVisibleInfoFields,
}) => {
  const { t } = useTranslation();
  const { data: koulutus } = useApiAsync({
    promiseFn: getKoulutusByKoodi,
    koodiUri: get(koulutuskoodi, 'value'),
    watch: koulutuskoodi,
  });
  const perusteFieldValue = useFieldValue(`${name}.peruste`);
  const perusteet = get(koulutus, 'perusteet');
  const selectedPeruste = find(
    perusteet,
    peruste => peruste.id === get(perusteFieldValue, 'value'),
  );

  const { change } = useBoundFormActions();
  const { isDirty } = useBoundFormSelectors();

  const koodiUri = get(koulutus, 'koodiUri');

  useEffect(() => {
    if (isDirty()) {
      change(`${name}.peruste`, null);
    }
  }, [change, koodiUri, isDirty, name]);

  const selectLabel = selectLabelProp || t('koulutuslomake.valitseKoulutus');

  return (
    <Box display="flex" flexDirection="column">
      <Box flexDirection="row" display="flex" mb={3}>
        <Box width={0.5} mr={2}>
          <div display {...getTestIdProps('koulutustyyppiSelect')}>
            <KoulutusField
              disabled={disabled}
              name={`${name}.koulutus`}
              koulutustyyppi={koulutustyyppi}
              label={selectLabel}
              language={language}
            />
          </div>
        </Box>
        <Box width={0.5} ml={2}>
          <PerusteField
            name={`${name}.peruste`}
            perusteet={perusteet}
            language={language}
          />
        </Box>
      </Box>
      <Box flexDirection="row" width={1} display="flex" mr={2}>
        <Box width={1}>
          {koulutuskoodi ? (
            <StyledKoulutusInfo
              disabled={disabled}
              peruste={selectedPeruste}
              koulutus={koulutus}
              language={language}
              visibleInfoFields={visibleInfoFields}
            />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default KoulutuksenTiedotSection;
