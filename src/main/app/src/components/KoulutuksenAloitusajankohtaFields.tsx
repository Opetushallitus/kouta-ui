import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { Box } from '#/src/components/virkailija';
import DateTimeRange from '#/src/components/DateTimeRange';
import {
  FormFieldRadioGroup,
  FormFieldYearSelect,
  FormFieldEditor,
} from '#/src/components/formFields';
import Spacing from '#/src/components/Spacing';
import { createStyledRadioSection } from '#/src/components/createStyledRadioSection';
import { Alkamiskausityyppi } from '#/src/constants';
import { getTestIdProps } from '#/src/utils';

const AlkamiskausiJaVuosiFields = ({ name }) => {
  const { options } = useKoodistoOptions({ koodisto: 'kausi' });
  const { t } = useTranslation();

  return (
    <Spacing>
      <Box flexGrow="1" p={1}>
        <Field
          name={`${name}.kausi`}
          component={FormFieldRadioGroup}
          label={t('yleiset.valitseAlkamiskausi')}
          options={options}
        />
      </Box>
      <Box flexGrow="1" p={1}>
        <Field
          name={`${name}.vuosi`}
          component={FormFieldYearSelect}
          placeholder={t('yleiset.valitseAlkamisvuosi')}
        />
      </Box>
    </Spacing>
  );
};

const TarkkaAlkamisaikaFields = ({ name }) => (
  <Spacing>
    <Box flexGrow="1" p={1}>
      <DateTimeRange
        startProps={{
          name: `${name}.tarkkaAlkaa`,
        }}
        endProps={{
          name: `${name}.tarkkaPaattyy`,
        }}
      />
    </Box>
  </Spacing>
);

const HenkilokohtaisenSuunnitelmanLisatiedot = ({ name, language }) => {
  const { t } = useTranslation();
  return (
    <Spacing>
      <Field
        name={`${name}.henkilokohtaisenSuunnitelmanLisatiedot.${language}`}
        component={FormFieldEditor}
        label={t('yleiset.lisatietoa')}
      />
    </Spacing>
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
}) => {
  return (
    <div {...getTestIdProps('AloitusajankohtaFields')}>
      <Field
        name={name}
        component={KoulutuksenAloitusajankohtaRadioGroup}
        section={section}
        language={language}
      />
    </div>
  );
};