import React, { useMemo } from 'react';
import { Field } from 'redux-form';

import Typography from '../../Typography';
import KoulutusSelect from '../KoulutusSelect';
import { getKoulutusByKoodi } from '../../../apiUtils';
import { getLanguageValue, getTestIdProps, noop } from '../../../utils';
import useTranslation from '../../useTranslation';
import { createFormFieldComponent } from '../../FormFields';
import useApiAsync from '../../useApiAsync';
import Box from '../../Box';

const getTutkintonimikkeet = ({ koulutus, language }) => {
  const { tutkintonimikeKoodit = [] } = koulutus;

  return tutkintonimikeKoodit
    .map(({ nimi }) => getLanguageValue(nimi, language))
    .filter(name => !!name);
};

const getOsaamisalat = ({ koulutus, language }) => {
  const { osaamisalat = [] } = koulutus;

  return osaamisalat
    .map(({ nimi }) => getLanguageValue(nimi, language))
    .filter(name => !!name);
};

const InfoRow = ({ title, description }) => {
  return (
    <Box display="flex" mb={2}>
      <Box width={0.3} pr={2}>
        <Typography color="text.dark">{title}:</Typography>
      </Box>
      <Box width={0.7}>
        <Typography>{description}</Typography>
      </Box>
    </Box>
  );
};

const KoulutusField = createFormFieldComponent(
  KoulutusSelect,
  ({ input, ...props }) => ({
    ...input,
    onBlur: noop,
    ...props,
  }),
);

const KoulutusInfo = ({
  koulutusKoodiUri,
  language = 'fi',
  visibleInfoFields = [],
}) => {
  const { t } = useTranslation();

  const { data: koulutus } = useApiAsync({
    promiseFn: getKoulutusByKoodi,
    koodiUri: koulutusKoodiUri,
    watch: koulutusKoodiUri,
  });

  const {
    nimikkeet,
    osaamisalat,
    koulutusala,
    opintojenlaajuus,
    opintojenlaajuusYksikko,
    nimi,
  } = useMemo(
    () => ({
      nimikkeet: koulutus ? getTutkintonimikkeet({ koulutus, language }) : [],
      osaamisalat: koulutus ? getOsaamisalat({ koulutus, language }) : [],
      koulutusala: koulutus
        ? getLanguageValue(koulutus.koulutusala, language)
        : undefined,
      opintojenlaajuusYksikko: koulutus
        ? getLanguageValue(koulutus.opintojenlaajuusYksikko, language)
        : undefined,
      nimi: koulutus ? getLanguageValue(koulutus.nimi, language) : undefined,
      opintojenlaajuus: koulutus ? koulutus.opintojenlaajuus : undefined,
    }),
    [koulutus, language],
  );

  return koulutus ? (
    <>
      {visibleInfoFields.includes('koulutus') && (
        <InfoRow title={t('yleiset.koulutus')} description={nimi} />
      )}

      {visibleInfoFields.includes('koulutusala') && (
        <InfoRow title={t('yleiset.koulutusala')} description={koulutusala} />
      )}

      {visibleInfoFields.includes('osaamisalat') && (
        <InfoRow
          title={t('yleiset.osaamisalat')}
          description={osaamisalat.join(', ')}
        />
      )}

      {visibleInfoFields.includes('tutkintonimike') && (
        <InfoRow
          title={t('yleiset.tutkintonimike')}
          description={nimikkeet.join(', ')}
        />
      )}

      {visibleInfoFields.includes('laajuus') && (
        <InfoRow
          title={t('yleiset.laajuus')}
          description={<>{opintojenlaajuus} {opintojenlaajuusYksikko}</>}
        />
      )}
    </>
  ) : null;
};

const defaultVisibleInfoFields = [
  'koulutus',
  'koulutusala',
  'osaamisalat',
  'tutkintonimike',
  'laajuus',
];

const KoulutuksenTiedotSection = ({
  koulutustyyppi,
  language,
  koulutuskoodi,
  name,
  selectLabel: selectLabelProp,
  visibleInfoFields = defaultVisibleInfoFields,
}) => {
  const { t } = useTranslation();

  const selectLabel = selectLabelProp || t('koulutuslomake.valitseKoulutus');

  return (
    <>
      <Box display="flex">
        <Box flexGrow={1} width={0.4}>
          <div {...getTestIdProps('koulutustyyppiSelect')}>
            <Field
              name={`${name}.koulutus`}
              component={KoulutusField}
              koulutustyyppi={koulutustyyppi}
              label={selectLabel}
            />
          </div>
        </Box>
        <Box flexGrow={1} pl={3} width={0.6}>
          {koulutuskoodi ? (
            <KoulutusInfo
              koulutusKoodiUri={koulutuskoodi.value}
              language={language}
              visibleInfoFields={visibleInfoFields}
            />
          ) : null}
        </Box>
      </Box>
    </>
  );
};

export default KoulutuksenTiedotSection;
