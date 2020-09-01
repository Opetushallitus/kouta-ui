import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { get, each, find, toLower } from 'lodash';
import { Field, FieldArray } from 'redux-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  useBoundFormActions,
  useFieldValue,
  useIsDirty,
} from '#/src/hooks/form';
import { getLanguageValue } from '#/src/utils/languageUtils';
import FormConfigFragment from '#/src/components/FormConfigFragment';
import { FormFieldInput } from '#/src/components/formFields';
import { getTestIdProps } from '#/src/utils';
import { Box, Typography } from '#/src/components/virkailija';
import useKoodi from '#/src/hooks/useKoodi';
import KoulutusField from '../KoulutusField';
import KoulutusalatField from './KoulutusalatField';
import KoulutuksenTiedotSection from './KoulutuksenTiedotSection';
import OpintojenlaajuusField from './OpintojenlaajuusField';
import TutkintonimikeField from './TutkintonimikeField';
import FieldArrayList from '#/src/components/FieldArrayList';
import Button from '#/src/components/Button';
import useApiAsync from '#/src/hooks/useApiAsync';
import { getTutkinnonOsanKuvaus } from '#/src/utils/koulutus/getTutkinnonOsanKuvaus';
import StyledSectionHTML from '#/src/components/StyledSectionHTML';
import { getThemeProp } from '#/src/theme';
import Anchor from '#/src/components/Anchor';
import { useUrls } from '#/src/contexts/contextHooks';

const useLocalizedKoulutus = ({ fieldName, language, koulutusValue }) => {
  const [changedKoulutus, setChangedKoulutus] = useState(null);
  const koulutusKoodi = useKoodi(get(koulutusValue, 'value'));
  const koodi = get(koulutusKoodi, 'koodi');
  const isDirty = useIsDirty();
  const { change } = useBoundFormActions();

  // When language changes, change the selected 'koulutus' label accordingly
  // if the form is dirty (don't override initial values)
  useEffect(() => {
    if (koodi && isDirty) {
      const { metadata } = koodi;
      const localizedNimi = get(
        find(metadata, ({ kieli }) => toLower(kieli) === language),
        'nimi'
      );
      if (localizedNimi) {
        change(`${fieldName}.koulutus.label`, localizedNimi);
      }
    }
  }, [language, koodi, fieldName, isDirty, change]);

  useEffect(() => {
    if (koulutusValue && isDirty) {
      setChangedKoulutus(koulutusValue.value);
    }
  }, [isDirty, koulutusValue, language]);

  // When koulutus field has changed to a defined value and got its 'koodi'
  // change the language versioned 'nimi' fields accordingly
  // if the form is dirty (don't override initial values)
  useEffect(() => {
    if (changedKoulutus && koodi) {
      each(get(koodi, 'metadata'), ({ kieli, nimi }) => {
        const lang = toLower(kieli);
        change(`${fieldName}.nimi.${lang}`, nimi);
      });
      setChangedKoulutus(null);
    }
  }, [change, changedKoulutus, fieldName, koodi, language]);
};

const TutkinnonOsatField = ({ disabled, language, koulutustyyppi, name }) => {
  const { t } = useTranslation();
  const koulutuskoodi = useFieldValue(`${name}.koulutus`);

  useLocalizedKoulutus({
    fieldName: name,
    koulutusValue: koulutuskoodi,
    language,
  });
  return (
    <KoulutuksenTiedotSection
      disabled={disabled}
      language={language}
      koulutuskoodi={koulutuskoodi}
      koulutustyyppi={koulutustyyppi}
      name={name}
      selectLabel={t('koulutuslomake.valitseKoulutus')}
    />
  );
};

const TutkinnonOsatFields = ({
  disabled,
  language,
  koulutustyyppi,
  fields,
  koulutusCache,
}) => {
  const { t } = useTranslation();
  const onAddField = useCallback(() => {
    fields.push({});
  }, [fields]);

  return (
    <>
      <FieldArrayList fields={fields}>
        {({ field }) => (
          <TutkinnonOsatField
            disabled={disabled}
            language={language}
            koulutusCache={koulutusCache}
            koulutustyyppi={koulutustyyppi}
            name={field}
          />
        )}
      </FieldArrayList>
      <Box
        display="flex"
        justifyContent="center"
        mt={fields.length > 0 ? 4 : 0}
      >
        <Button
          variant="outlined"
          color="primary"
          type="button"
          onClick={onAddField}
          {...getTestIdProps('lisaaKoulutusButton')}
        >
          {t('toteutuslomake.lisaaKoulutus')}
        </Button>
      </Box>
    </>
  );
};

export const KoulutuksenNimiSection = ({ language, name }) => {
  const { t } = useTranslation();
  const tutkinnonosat = useFieldValue(`${name}.osat`);
  const oneAndOnlyOne = all => all && all.length === 1 && all[0];

  const oneSelectedTutkinnonOsa = oneAndOnlyOne(
    tutkinnonosat?.flatMap(t => t.selectedTutkinnonosat?.nimi)
  );

  const { change } = useBoundFormActions();
  const isDirty = useIsDirty();

  useEffect(() => {
    if (isDirty && oneSelectedTutkinnonOsa) {
      change(
        `${name}.nimi.${language}`,
        getLanguageValue(oneSelectedTutkinnonOsa, language)
      );
    }
  }, [change, name, isDirty, oneSelectedTutkinnonOsa, language]);

  return (
    <Box mb={2} {...getTestIdProps('koulutuksenNimi')}>
      <Field
        disabled={oneSelectedTutkinnonOsa}
        name={`${name}.nimi.${language}`}
        component={FormFieldInput}
        label={t('koulutuslomake.lisaaKoulutuksenNimi')}
      />
    </Box>
  );
};

const TutkinnonOsaInfo = ({ className, eperuste, viite, osa, language }) => {
  const { t } = useTranslation();
  const apiUrls = useUrls();
  return (
    <div className={className}>
      <Typography variant="h4" mb={2}>
        {getLanguageValue(osa.nimi, language)}, {viite.laajuus} osp (
        <Anchor
          href={apiUrls?.url(
            'eperusteet.tutkinnonosat',
            language,
            eperuste,
            get(viite, 'id')
          )}
          target="_blank"
        >
          {get(viite, 'id')}
        </Anchor>
        )
      </Typography>

      <Typography variant="h6" mb={2}>
        {t('koulutuslomake.ammattitaitovaatimukset')}
      </Typography>

      <StyledSectionHTML html={get(osa.ammattitaitovaatimukset, language)} />

      <Typography variant="h6" mb={2}>
        {t('koulutuslomake.ammattitaidonOsoittamistavat')}
      </Typography>
      <StyledSectionHTML
        html={get(osa.ammattitaidonOsoittamistavat, language)}
      />
    </div>
  );
};

const StyledTutkinnonOsaInfo = styled(TutkinnonOsaInfo)`
  background-color: ${getThemeProp('colors.grayLighten6')};
  padding: ${({ theme }) => theme.spacing.unit * 4}px;
  line-height: 23px;
`;

export const TutkinnonOsienKuvausSection = ({ disabled, language, name }) => {
  const tutkinnonosat = useFieldValue(`${name}.osat`);

  const selectedTutkinnonOsat = useMemo(() => {
    return tutkinnonosat
      ?.flatMap(t => t.selectedTutkinnonosat?._tutkinnonOsa ?? [])
      .sort();
  }, [tutkinnonosat]);

  const { data: kuvaukset } = useApiAsync({
    promiseFn: getTutkinnonOsanKuvaus,
    tutkinnonOsat: selectedTutkinnonOsat,
    watch: selectedTutkinnonOsat,
  });

  const viiteForOsa = ({ id }) => {
    const viitteet = tutkinnonosat.flatMap(t => t.selectedTutkinnonosat || []);
    return viitteet.find(v => v._tutkinnonOsa === id.toString());
  };

  const eperusteForOsa = ({ id }) => {
    return tutkinnonosat.find(
      v => v.selectedTutkinnonosat._tutkinnonOsa === id.toString()
    ).eperuste?.value;
  };
  return (
    <Box mb={-2}>
      <FormConfigFragment name="osat">
        <Box mb={2}>
          {(kuvaukset || []).map((osa, index) => (
            <StyledTutkinnonOsaInfo
              viite={viiteForOsa(osa)}
              eperuste={eperusteForOsa(osa)}
              key={`${osa.id}_${index}`}
              osa={osa}
              language={language}
            />
          ))}
        </Box>
      </FormConfigFragment>
    </Box>
  );
};

export const TutkinnonOsatSection = ({
  disabled,
  language,
  koulutustyyppi,
  name,
  koulutusCache,
}) => {
  const { t } = useTranslation();

  return (
    <Box mb={-2}>
      <FormConfigFragment name="osat">
        <Box mb={2}>
          <FieldArray
            disabled={disabled}
            koulutustyyppi={koulutustyyppi}
            name={name}
            koulutusCache={koulutusCache}
            component={TutkinnonOsatFields}
            t={t}
            language={language}
          />
        </Box>
      </FormConfigFragment>
    </Box>
  );
};

const TiedotSection = ({
  disabled,
  language,
  koulutustyyppi,
  koulutuskoodi,
  name,
}) => {
  const { t } = useTranslation();

  useLocalizedKoulutus({
    fieldName: name,
    koulutusValue: koulutuskoodi,
    language,
  });

  return (
    <Box mb={-2}>
      <FormConfigFragment name="koulutuskoodiTiedoilla">
        <Box mb={2}>
          <KoulutuksenTiedotSection
            disabled={disabled}
            language={language}
            koulutuskoodi={koulutuskoodi}
            koulutustyyppi={koulutustyyppi}
            name={name}
          />
        </Box>
      </FormConfigFragment>

      <FormConfigFragment name="osaamisala">
        <Box mb={2}>
          <KoulutuksenTiedotSection
            disabled={disabled}
            language={language}
            koulutuskoodi={koulutuskoodi}
            koulutustyyppi={koulutustyyppi}
            selectLabel={t('koulutuslomake.valitseOsaamisala')}
            visibleInfoFields={['koulutus', 'koulutusala']}
            name={name}
          />
        </Box>
      </FormConfigFragment>

      <FormConfigFragment name="koulutuskoodi">
        <Box mb={2} {...getTestIdProps('koulutuskoodiSelect')}>
          <KoulutusField
            disabled={disabled}
            name={`${name}.koulutus`}
            koulutustyyppi={koulutustyyppi}
            language={language}
          />
        </Box>
      </FormConfigFragment>

      <Box mb={2}>
        <OpintojenlaajuusField disabled={disabled} name={name} />
      </Box>

      <Box mb={2}>
        <TutkintonimikeField disabled={disabled} name={name} />
      </Box>

      <Box mb={2}>
        <KoulutusalatField disabled={disabled} name={name} />
      </Box>

      <Box mb={2} {...getTestIdProps('nimiInput')}>
        <Field
          disabled={disabled}
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('koulutuslomake.muokkaaKoulutuksenNimea')}
        />
      </Box>
    </Box>
  );
};

export default TiedotSection;
