import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';
import { Box } from '#/src/components/virkailija';
import DateTimeRange from '#/src/components/DateTimeRange';
import {
  FormFieldRadioGroup,
  FormFieldYearSelect,
  FormFieldSwitch,
  FormFieldEditor,
} from '#/src/components/formFields';
import Spacing from '#/src/components/Spacing';
import { useFieldValue } from '#/src/hooks/form';
import { createStyledRadioSection } from '#/src/components/createStyledRadioSection';
import { Ajankohtatyyppi } from '#/src/constants';

const AlkamiskausiFields = ({ name }) => {
  const { options } = useKoodistoOptions({ koodisto: 'kausi' });
  const { t } = useTranslation();

  const tiedossaTarkkaAjankohta = useFieldValue(
    `${name}.tiedossaTarkkaAjankohta`
  );

  return (
    <Spacing {...getTestIdProps('KausiJaVuosiFields')}>
      <Box flexGrow="1" p={1}>
        <Field
          name={`${name}.kausi`}
          component={FormFieldRadioGroup}
          label={t('hakulomake.valitseAlkamiskausi')}
          options={options}
        />
      </Box>
      <Box flexGrow="1" p={1}>
        <Field
          name={`${name}.vuosi`}
          component={FormFieldYearSelect}
          placeholder={t('hakulomake.valitseAlkamisvuosi')}
        />
      </Box>
      <Box flexGrow="1" p={1}>
        <Field
          name={`${name}.tiedossaTarkkaAjankohta`}
          component={FormFieldSwitch}
        >
          {t('hakulomake.tiedossaTarkkaAjankohta')}
        </Field>
      </Box>
      {tiedossaTarkkaAjankohta && (
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
      )}
    </Spacing>
  );
};

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
    label: t => t('hakulomake.alkamiskausi'),
    value: Ajankohtatyyppi.ALKAMISKAUSI,
    FieldsComponent: AlkamiskausiFields,
  },
  {
    label: t => t('hakulomake.aloitusHenkilokohtaisenSuunnitelmanMukaisesti'),
    value: Ajankohtatyyppi.HENKILOKOHTAINEN_SUUNNITELMA,
    FieldsComponent: HenkilokohtaisenSuunnitelmanLisatiedot,
  },
]);

export const KoulutuksenAloitusajankohtaFields = ({
  name,
  section,
  language,
}) => {
  return (
    <Field
      name={name}
      component={KoulutuksenAloitusajankohtaRadioGroup}
      section={section}
      language={language}
    />
  );
};
