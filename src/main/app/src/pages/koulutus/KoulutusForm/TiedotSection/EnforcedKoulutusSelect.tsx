import { useTranslation } from 'react-i18next';

import AsyncKoodistoSelect from '#/src/components/AsyncKoodistoSelect';
import { FormControl } from '#/src/components/virkailija';
import useKoodisto from '#/src/hooks/useKoodisto';
import { formatKoodiLabelWithArvo } from '#/src/utils';

const EnforcedKoulutusSelect = props => {
  const { t } = useTranslation();
  const { data } = useKoodisto({
    koodisto: 'koulutus',
  });

  return (
    <FormControl label={t('yleiset.valitseKoulutus')} disabled={true}>
      <AsyncKoodistoSelect
        koodistoData={data}
        showAllOptions
        formatKoodiLabel={formatKoodiLabelWithArvo}
        {...props}
      />
    </FormControl>
  );
};

export default EnforcedKoulutusSelect;
