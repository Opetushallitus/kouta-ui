import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import Submit from '../Submit';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '../../utils';
import Box from '../Box';
import updateValintaperuste from '../../utils/kouta/updateValintaperuste';
import getValintaperusteByFormValues from '../../utils/getValintaperusteByFormValues';
import useOrganisaatio from '../useOrganisaatio';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { VALINTAPERUSTE_ROLE } from '../../constants';
import { useSaveValintaperuste } from '#/src/hooks/formSaveHooks';

const EditValintaperusteFooter = ({ valintaperuste }) => {
  const history = useHistory();
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

  const save = useSaveValintaperuste(submit);

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

export default EditValintaperusteFooter;
