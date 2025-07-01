import { useTranslation } from 'react-i18next';

export const useMuokkaajaName = entity => {
  const { t } = useTranslation();

  const muokkaajaOid = entity?.muokkaaja;
  let muokkaajanNimi = entity?._enrichedData?.muokkaajanNimi
    ? entity?._enrichedData?.muokkaajanNimi
    : muokkaajaOid
      ? muokkaajaOid
      : null;

  if (entity?.metadata?.isMuokkaajaOphVirkailija) {
    muokkaajanNimi = `${muokkaajanNimi} (${t('yleiset.oph')})`;
  }

  return muokkaajanNimi;
};
