import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import updateValintaperuste from '../../utils/kouta/updateValintaperuste';
import getValintaperusteByFormValues from '../../utils/getValintaperusteByFormValues';
import { ENTITY } from '../../constants';
import { useSaveValintaperuste } from '#/src/hooks/formSaveHooks';
import { FormFooter } from '#/src/components/FormPage';
import { useFormName } from '#/src/hooks/form';

const EditValintaperusteFooter = ({ valintaperuste, canUpdate }) => {
  const history = useHistory();

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
    [valintaperuste, history]
  );

  const formName = useFormName();
  const save = useSaveValintaperuste({ submit, formName });

  return (
    <FormFooter
      entity={ENTITY.VALINTAPERUSTE}
      save={save}
      canUpdate={canUpdate}
    />
  );
};

export default EditValintaperusteFooter;
