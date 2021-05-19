import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import FieldGroup from '#/src/components/FieldGroup';
import {
  FormFieldAsyncKoodistoSelect,
  FormFieldEditor,
  FormFieldSwitch,
} from '#/src/components/formFields';
import { SectionInnerCollapse } from '#/src/components/SectionInnerCollapse';
import Spacing from '#/src/components/Spacing';
import { Box } from '#/src/components/virkailija';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import { useFieldValue } from '#/src/hooks/form';
import { useKoodisto } from '#/src/hooks/useKoodisto';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getTestIdProps } from '#/src/utils';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

const koodiUriWithoutVersion = koodiUri =>
  koodiUri.slice(0, koodiUri.lastIndexOf('#'));

const LukiolinjaOsio = ({
  name,
  title,
  isKaytossaLabel,
  valinnatLabel,
  kuvausLabel,
  koodisto,
  ...props
}) => {
  const selectedItems = useFieldValue(`${name}.valinnat`);
  const isKaytossa = useFieldValue(`${name}.kaytossa`);
  const { data } = useKoodisto({ koodisto });
  const userLanguage = useUserLanguage();
  const languageTab = useLanguageTab();

  const selectedItemsWithLabels = useMemo(
    () =>
      selectedItems?.map(({ value, label }) => {
        if (!label) {
          const koodi = data?.find(
            ({ koodiUri }) => koodiUriWithoutVersion(value) === koodiUri
          );
          label = getKoodiNimiTranslation(koodi, userLanguage);
        }
        return { value, label };
      }),
    [selectedItems, data, userLanguage]
  );

  return (
    <FieldGroup title={title} {...props}>
      <Box mb={2}>
        <Field component={FormFieldSwitch} name={`${name}.kaytossa`}>
          {isKaytossaLabel}
        </Field>
      </Box>
      {isKaytossa && (
        <>
          <Box mb={3}>
            <Field
              component={FormFieldAsyncKoodistoSelect}
              name={`${name}.valinnat`}
              label={valinnatLabel}
              koodistoData={data}
              showAllOptions
              required
              isMulti
            />
          </Box>
          {selectedItemsWithLabels?.map(({ value, label }) => (
            <Box mb={3} key={value}>
              <SectionInnerCollapse header={label} key={value}>
                <Field
                  component={FormFieldEditor}
                  label={kuvausLabel}
                  name={`${name}.kuvaukset.${value}.${languageTab}`}
                />
              </SectionInnerCollapse>
            </Box>
          ))}
        </>
      )}
    </FieldGroup>
  );
};

export const LukiolinjatSection = ({ name }) => {
  const { t } = useTranslation();

  return (
    <>
      <LukiolinjaOsio
        name={`${name}.painotukset`}
        title={t('toteutuslomake.painotukset')}
        kuvausLabel={t('toteutuslomake.painotuksenKuvaus')}
        isKaytossaLabel={t('toteutuslomake.lukiollaOnPainotuksia')}
        valinnatLabel={t('toteutuslomake.valitsePainotukset')}
        koodisto="lukiopainotukset"
        {...getTestIdProps('painotukset')}
      />
      <Spacing marginBottom={8} />
      <LukiolinjaOsio
        name={`${name}.erityisetKoulutustehtavat`}
        title={t('toteutuslomake.erityisetKoulutustehtavat')}
        kuvausLabel={t('toteutuslomake.erityisenKoulutustehtavanKuvaus')}
        isKaytossaLabel={t(
          'toteutuslomake.lukiollaOnErityisiaKoulutustehtavia'
        )}
        valinnatLabel={t('toteutuslomake.valitseErityisetKoulutustehtavat')}
        koodisto="lukiolinjaterityinenkoulutustehtava"
        {...getTestIdProps('erityisetKoulutustehtavat')}
      />
    </>
  );
};
