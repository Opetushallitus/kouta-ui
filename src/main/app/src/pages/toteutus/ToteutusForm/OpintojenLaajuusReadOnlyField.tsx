import FormControl from '@opetushallitus/virkailija-ui-components/FormControl';
import Input from '@opetushallitus/virkailija-ui-components/Input';
import { useTranslation } from 'react-i18next';

import useKoodi from '#/src/hooks/useKoodi';
import { getTestIdProps } from '#/src/utils';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';
import { getOpintojenLaajuusTranslation } from '#/src/utils/getOpintojenLaajuusTranslation';

export const OpintojenLaajuusReadOnlyField = ({
  laajuusKoodiUri,
  laajuusyksikkoKoodiUri,
  laajuusNumero,
  selectedLanguage,
}) => {
  const { t } = useTranslation();
  const { koodi: laajuusyksikko } = useKoodi(laajuusyksikkoKoodiUri);
  const laajuusyksikkoMetadata = laajuusyksikko?.metadata;
  const { koodi: laajuusKoodi } = useKoodi(laajuusKoodiUri);
  const laajuusKoodiMetadata = laajuusKoodi?.metadata;
  const theValue = laajuusKoodiUri
    ? getOpintojenLaajuusTranslation(
        laajuusKoodiMetadata,
        laajuusyksikkoMetadata,
        selectedLanguage
      ) || ''
    : `${laajuusNumero || ''} ${
        getKoodiNimiTranslation(laajuusyksikko, selectedLanguage) || ''
      }`;

  return (
    <FormControl label={t('toteutuslomake.laajuus')} disabled={true}>
      <Input value={theValue} {...getTestIdProps('laajuus')} />
    </FormControl>
  );
};