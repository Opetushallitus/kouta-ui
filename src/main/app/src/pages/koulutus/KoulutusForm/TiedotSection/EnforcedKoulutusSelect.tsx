import FormControl from '@opetushallitus/virkailija-ui-components/FormControl';
import { useTranslation } from 'react-i18next';

import AsyncKoodistoSelect from '#/src/components/AsyncKoodistoSelect';
import useKoodisto from '#/src/hooks/useKoodisto';

const EnforcedKoulutusSelect = props => {
  const { t } = useTranslation();
  const { data } = useKoodisto({
    koodisto: 'koulutus',
  });

  return (
    <FormControl label={t('yleiset.valitseKoulutus')} disabled={true}>
      <AsyncKoodistoSelect koodistoData={data} showAllOptions {...props} />
    </FormControl>
  );
};

export default EnforcedKoulutusSelect;
