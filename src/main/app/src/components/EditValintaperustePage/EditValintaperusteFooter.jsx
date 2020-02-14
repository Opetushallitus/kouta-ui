import React, { useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';

import Submit from '../Submit';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Box from '../Box';
import updateValintaperuste from '../../utils/kouta/updateValintaperuste';
import getValintaperusteByFormValues from '../../utils/getValintaperusteByFormValues';
import validateValintaperusteForm from '../../utils/validateValintaperusteForm';
import useSaveForm from '../useSaveForm';
import useOrganisaatio from '../useOrganisaatio';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { VALINTAPERUSTE_ROLE } from '../../constants';

const EditValintaperusteFooter = ({ valintaperuste, history }) => {
  const { t } = useTranslation();
  const { organisaatio } = useOrganisaatio(valintaperuste.organisaatioOid);
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const canUpdate = useMemo(() => {
    return roleBuilder.hasUpdate(VALINTAPERUSTE_ROLE, organisaatio);
  }, [organisaatio, roleBuilder]);

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateValintaperuste({
        httpClient,
        apiUrls,
        valintaperuste: {
          ...valintaperuste,
          ...getValintaperusteByFormValues(values),
        },
      });

      history.replace({
        state: {
          valintaperusteUpdatedAt: Date.now(),
        },
      });
    },
    [valintaperuste, history],
  );

  const { save } = useSaveForm({
    form: 'editValintaperusteForm',
    submit,
    validate: validateValintaperusteForm,
  });

  return (
    <Box display="flex" justifyContent="flex-end">
      <Submit
        onClick={save}
        disabled={!canUpdate}
        title={
          !canUpdate ? t('valintaperustelomake.eiMuokkausOikeutta') : undefined
        }
        {...getTestIdProps('tallennaValintaperusteButton')}
      >
        {t('yleiset.tallenna')}
      </Submit>
    </Box>
  );
};

export default withRouter(EditValintaperusteFooter);
