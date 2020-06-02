import React from 'react';
import { useTranslation } from 'react-i18next';

import useOrganisaatio from '#/src/components/useOrganisaatio';
import FormPage from '#/src/components/FormPage';
import OppilaitosFormSteps from '#/src/components/OppilaitosFormSteps';
import OppilaitoksenOsaPageFooter from './OppilaitoksenOsaPageFooter';
import useApiAsync from '#/src/components/useApiAsync';
import getOppilaitoksenOsaByOid from '#/src/utils/kouta/getOppilaitoksenOsaByOid';
import Spin from '#/src/components/Spin';
import Title from '#/src/components/Title';
import EntityFormHeader from '#/src/components/EntityFormHeader';
import { ENTITY } from '#/src/constants';
import OppilaitoksenOsaPageForm from './OppilaitoksenOsaPageForm';

const OppilaitoksenOsaPage = ({
  match: {
    params: { organisaatioOid },
  },
  location: { state = {} },
}) => {
  const { organisaatio } = useOrganisaatio(organisaatioOid);
  const { oppilaitoksenOsaUpdatedAt } = state;

  const {
    data: oppilaitoksenOsa,
    isLoading: oppilaitoksenOsaIsLoading,
    finishedAt,
  } = useApiAsync({
    promiseFn: getOppilaitoksenOsaByOid,
    oid: organisaatioOid,
    silent: true,
    watch: JSON.stringify([organisaatioOid, oppilaitoksenOsaUpdatedAt]),
  });

  const { t } = useTranslation();
  const oppilaitoksenOsaIsResolved = !!finishedAt;

  return (
    <>
      <Title>{t('sivuTitlet.oppilaitoksenOsa')}</Title>
      <FormPage
        steps={<OppilaitosFormSteps activeStep={ENTITY.OPPILAITOKSEN_OSA} />}
        header={
          <EntityFormHeader
            entityType={ENTITY.OPPILAITOKSEN_OSA}
            entity={oppilaitoksenOsa}
          />
        }
        footer={
          <OppilaitoksenOsaPageFooter
            oppilaitoksenOsa={oppilaitoksenOsa}
            oppilaitoksenOsaIsLoading={oppilaitoksenOsaIsLoading}
            organisaatioOid={organisaatioOid}
          />
        }
      >
        {organisaatio && oppilaitoksenOsaIsResolved ? (
          <OppilaitoksenOsaPageForm
            organisaatio={organisaatio}
            oppilaitoksenOsa={oppilaitoksenOsa}
          />
        ) : (
          <Spin center />
        )}
      </FormPage>
    </>
  );
};

export default OppilaitoksenOsaPage;
