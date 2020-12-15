import React, { useCallback } from 'react';
import getToteutusByFormValues from '#/src/utils/toteutus/getToteutusByFormValues';
import updateToteutus from '#/src/utils/toteutus/updateToteutus';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { useSaveToteutus } from '#/src/hooks/formSaveHooks';
import { FormFooter } from '#/src/components/FormPage';
import { useFormName } from '#/src/hooks/form';
import { ENTITY } from '#/src/constants';
import { queryCache } from 'react-query';
import { getTarjoajaOids } from '#/src/utils/getTarjoajaOids';

const EditToteutusFooter = ({
  toteutus,
  koulutustyyppi,
  organisaatioOid,
  koulutus,
  canUpdate,
}) => {
  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid);

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateToteutus({
        httpClient,
        apiUrls,
        toteutus: {
          ...toteutus,
          ...getToteutusByFormValues({ ...values, koulutustyyppi }),
          tarjoajat: getTarjoajaOids({
            hierarkia,
            existingTarjoajat: toteutus?.tarjoajat,
            newTarjoajat: values?.tarjoajat,
          }),
        },
      });

      queryCache.invalidateQueries(ENTITY.TOTEUTUS);
    },
    [hierarkia, toteutus, koulutustyyppi]
  );

  const formName = useFormName();

  const save = useSaveToteutus({ submit, koulutustyyppi, koulutus, formName });

  return (
    <FormFooter entity={ENTITY.TOTEUTUS} save={save} canUpdate={canUpdate} />
  );
};

export default EditToteutusFooter;
