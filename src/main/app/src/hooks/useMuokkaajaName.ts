import { useTranslation } from 'react-i18next';

export const useMuokkaajaName = entity => {
  const { t } = useTranslation();

  let muokkaajanNimi = entity?._enrichedData?.muokkaajanNimi;

  if (entity?.metadata?.isMuokkaajaOphVirkailija) {
    muokkaajanNimi = `${muokkaajanNimi} (${t('yleiset.oph')})`;
  }

  return muokkaajanNimi;
};
