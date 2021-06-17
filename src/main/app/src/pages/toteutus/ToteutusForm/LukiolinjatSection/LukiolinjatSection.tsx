import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import FieldGroup from '#/src/components/FieldGroup';
import { FormFieldEditor, FormFieldSwitch } from '#/src/components/formFields';
import { KoodistoCollapseList } from '#/src/components/KoodistoCollapseList';
import Spacing from '#/src/components/Spacing';
import { Box } from '#/src/components/virkailija';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import { useFieldValue } from '#/src/hooks/form';
import { useKoodisto } from '#/src/hooks/useKoodisto';
import { getTestIdProps } from '#/src/utils';

const LukiolinjaKuvaus = ({ name, itemProps, index }) => {
  const languageTab = useLanguageTab();

  return (
    <Field
      component={FormFieldEditor}
      label={itemProps?.kuvausLabel}
      name={`${name}.kuvaukset[${index}].${languageTab}`}
    />
  );
};

const LukiolinjaOsio = ({
  name,
  title,
  isKaytossaLabel,
  valinnatLabel,
  kuvausLabel,
  koodisto,
  ...props
}) => {
  const isKaytossa = useFieldValue(`${name}.kaytossa`);
  const { data } = useKoodisto({ koodisto });

  return (
    <FieldGroup title={title} {...props}>
      <Box mb={2}>
        <Field component={FormFieldSwitch} name={`${name}.kaytossa`}>
          {isKaytossaLabel}
        </Field>
      </Box>
      {isKaytossa && (
        <>
          <KoodistoCollapseList
            koodistoData={data}
            name={name}
            itemProps={{ kuvausLabel }}
            selectLabel={valinnatLabel}
            CollapseContent={LukiolinjaKuvaus}
          />
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
