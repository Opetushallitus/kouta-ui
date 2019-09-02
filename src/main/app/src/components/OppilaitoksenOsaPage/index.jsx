import React from 'react';

import useOrganisaatio from '../useOrganisaatio';
import FormPage from '../FormPage';
import OppilaitoksenOsaPageForm from './OppilaitoksenOsaPageForm';
import OppilaitosFormSteps from '../OppilaitosFormSteps';
import OppilaitoksenOsaPageHeader from './OppilaitoksenOsaPageHeader';
import OppilaitoksenOsaPageFooter from './OppilaitoksenOsaPageFooter';
import useApiAsync from '../useApiAsync';
import getOppilaitoksenOsa from '../../utils/kouta/getOppilaitoksenOsa';
import Spin from '../Spin';
import Title from '../Title';
import useTranslation from '../useTranslation';

const Steps = () => <OppilaitosFormSteps activeStep="oppilaitoksenOsa" />;

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
    promiseFn: getOppilaitoksenOsa,
    organisaatioOid,
    watch: JSON.stringify([organisaatioOid, oppilaitoksenOsaUpdatedAt]),
  });

  const { t } = useTranslation();
  const oppilaitoksenOsaIsResolved = !!finishedAt;

  return (
    <>
      <Title>{t('sivuTitlet.oppilaitoksenOsa')}</Title>
      <FormPage
        steps={<Steps />}
        header={<OppilaitoksenOsaPageHeader organisaatio={organisaatio} />}
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
