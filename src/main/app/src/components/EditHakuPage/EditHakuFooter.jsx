import React, { useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import { getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
import Box from '../Box';
import getHakuByFormValues from '../../utils/getHakuByFormValues';
import updateHaku from '../../utils/kouta/updateHaku';
import useSaveForm from '../useSaveForm';
import validateHakuForm from '../../utils/validateHakuForm';
import useOrganisaatio from '../useOrganisaatio';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { HAKU_ROLE } from '../../constants';

const EditHakuFooter = ({ haku, history }) => {
  const { t } = useTranslation();
  const { organisaatio } = useOrganisaatio(haku.organisaatioOid);
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const canUpdate = useMemo(() => {
    return roleBuilder.hasUpdate(HAKU_ROLE, organisaatio);
  }, [organisaatio, roleBuilder]);

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateHaku({
        httpClient,
        apiUrls,
        haku: {
          ...haku,
          ...getHakuByFormValues(values),
        },
      });

      history.replace({
        state: {
          hakuUpdatedAt: Date.now(),
        },
      });
    },
    [haku, history],
  );

  const { save } = useSaveForm({
    form: 'editHakuForm',
    submit,
    validate: validateHakuForm,
  });

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        disabled={!canUpdate}
        onClick={save}
        title={!canUpdate ? t('hakulomake.eiMuokkausOikeutta') : undefined}
        {...getTestIdProps('tallennaHakuButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
    </Box>
  );
};

export default withRouter(EditHakuFooter);
