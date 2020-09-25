import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';
import {
  createFormFieldComponent,
  FormFieldKoulutustyyppiSelect,
  selectMapProps,
} from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import KoulutusalaSelect from '#/src/components/KoulutusalaSelect';
import KoulutusField from '#/src/components/KoulutusField';
import { useFieldValue } from '#/src/hooks/form';

const KoulutusalaFieldComponent = createFormFieldComponent(
  KoulutusalaSelect,
  selectMapProps
);

export const KoulutustyyppiSection = ({ name, language }) => {
  const { t } = useTranslation();
  const koulutustyyppi = useFieldValue(name);

  return (
    <Box display="flex" flexDirection="column" maxWidth="900px">
      <Field
        name={name}
        component={FormFieldKoulutustyyppiSelect}
        label={t('yleiset.valitseKoulutustyyppi')}
      />
      <Box display="flex" mt={4}>
        <Box flex="1 1 50%" mr={2}>
          <Field
            name={'koulutusala'}
            component={KoulutusalaFieldComponent}
            label={t('soraKuvauslomake.valitseKoulutusala')}
          />
        </Box>
        <Box flex="1 1 50%">
          <KoulutusField
            name="koulutukset"
            koulutustyyppi={koulutustyyppi}
            language={language}
            isMulti={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default KoulutustyyppiSection;
