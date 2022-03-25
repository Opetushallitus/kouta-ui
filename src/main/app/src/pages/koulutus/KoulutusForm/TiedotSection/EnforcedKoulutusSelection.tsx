import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldAsyncKoodistoSelect } from '#/src/components/formFields';
import useKoodi from '#/src/hooks/useKoodi';
import { formatKoodiLabelWithArvo } from '#/src/utils';

const EnforcedKoulutusSelection = props => {
  const { t } = useTranslation();
  const { name, koulutusKoodiUri } = props;

  const koulutusKoodi = useKoodi(koulutusKoodiUri);

  return (
    <Field
      name={name}
      isLoading={false}
      component={FormFieldAsyncKoodistoSelect}
      koodistoData={[koulutusKoodi]}
      label={t('yleiset.valitseKoulutus')}
      showAllOptions={false}
      isMulti={false}
      formatKoodiLabel={formatKoodiLabelWithArvo}
      {...props}
      disabled
    />
  );
};

export default EnforcedKoulutusSelection;
