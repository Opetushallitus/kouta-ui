import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { createStyledRadioSection } from '#/src/components/createStyledRadioSection';
import DateTimeRange from '#/src/components/DateTimeRange';
import {
  FormFieldRadioGroup,
  FormFieldYearSelect,
  FormFieldEditor,
} from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { Alkamiskausityyppi } from '#/src/constants';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

const AlkamiskausiJaVuosiFields = ({ name, kausiRequired }) => {
  const { options } = useKoodistoOptions({ koodisto: 'kausi' });
  const { t } = useTranslation();

  return (
    <Box>
      <Box flexGrow="1" p={1}>
        <Field
          name={`${name}.kausi`}
          component={FormFieldRadioGroup}
          label={t('yleiset.valitseAlkamiskausi')}
          options={options}
          required={kausiRequired}
        />
      </Box>
      <Box flexGrow="1" p={1}>
        <Field
          name={`${name}.vuosi`}
          component={FormFieldYearSelect}
          placeholder={t('yleiset.valitseAlkamisvuosi')}
        />
      </Box>
    </Box>
  );
};

const TarkkaAlkamisaikaFields = ({ name }) => (
  <Box>
    <Box flexGrow="1" p={1}>
      <DateTimeRange
        startProps={{
          name: `${name}.tarkkaAlkaa`,
          required: true,
        }}
        endProps={{
          name: `${name}.tarkkaPaattyy`,
        }}
      />
    </Box>
  </Box>
);

const HenkilokohtaisenSuunnitelmanLisatiedot = ({ name, language }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <Field
        name={`${name}.henkilokohtaisenSuunnitelmanLisatiedot.${language}`}
        component={FormFieldEditor}
        label={t('yleiset.lisatietoa')}
      />
    </Box>
  );
};

const KoulutuksenAloitusajankohtaRadioGroup = createStyledRadioSection([
  {
    label: t => t('yleiset.alkamiskausiJaVuosi'),
    value: Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI,
    FieldsComponent: AlkamiskausiJaVuosiFields,
  },
  {
    label: t => t('yleiset.tarkkaAlkamisajankohta'),
    value: Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA,
    FieldsComponent: TarkkaAlkamisaikaFields,
  },
  {
    label: t => t('yleiset.aloitusHenkilokohtaisenSuunnitelmanMukaisesti'),
    value: Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA,
    FieldsComponent: HenkilokohtaisenSuunnitelmanLisatiedot,
  },
]);

export const KoulutuksenAloitusajankohtaFields = ({
  name,
  section,
  language,
  kausiRequired = true,
}: {
  name: string;
  section: string;
  language: LanguageCode;
  kausiRequired?: boolean;
}) => {
  return (
    <div {...getTestIdProps('AloitusajankohtaFields')}>
      <Field
        name={name}
        component={KoulutuksenAloitusajankohtaRadioGroup}
        section={section}
        language={language}
        fieldsComponentProps={{ kausiRequired }}
      />
    </div>
  );
};
