import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import useApiAsync from '#/src/components/useApiAsync';
import Spin from '#/src/components/Spin';
import getHakuByOid from '#/src/utils/kouta/getHakuByOid';
import Title from '#/src/components/Title';
import ReduxForm from '#/src/components/ReduxForm';
import getHakuFormConfig from '#/src/utils/getHakuFormConfig';
import getFormValuesByHaku from '#/src/utils/getFormValuesByHaku';
import HakuForm from '#/src/components/HakuForm';
import FormConfigContext from '#/src/components/FormConfigContext';
import { ENTITY } from '#/src/constants';
import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormSteps from '#/src/components/FormSteps';
import EditHakuFooter from './EditHakuFooter';

const config = getHakuFormConfig();

const EditHakuPage = props => {
  const {
    history,
    match: {
      params: { organisaatioOid, oid },
    },
    location: { state = {} },
  } = props;

  const { hakuUpdatedAt = null } = state;
  const watch = JSON.stringify([oid, hakuUpdatedAt]);

  const { data: haku = null } = useApiAsync({
    promiseFn: getHakuByOid,
    oid,
    watch,
  });

  const { t } = useTranslation();
  const initialValues = useMemo(() => {
    return haku && getFormValuesByHaku(haku);
  }, [haku]);

  const onAttachHakukohde = useCallback(
    ({ toteutusOid }) => {
      if (toteutusOid) {
        history.push(
          `/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/haku/${haku.oid}/hakukohde`
        );
      }
    },
    [history, organisaatioOid, haku]
  );

  return (
    <ReduxForm form="editHakuForm" initialValues={initialValues}>
      <Title>{t('sivuTitlet.haunMuokkaus')}</Title>
      <FormPage
        header={<EntityFormHeader entityType={ENTITY.HAKU} entity={haku} />}
        steps={<FormSteps activeStep={ENTITY.HAKU} />}
        footer={haku ? <EditHakuFooter haku={haku} /> : null}
      >
        <RelationInfoContainer>
          <OrganisaatioRelation organisaatioOid={organisaatioOid} />
        </RelationInfoContainer>
        {haku ? (
          <FormConfigContext.Provider value={config}>
            <HakuForm
              haku={haku}
              organisaatioOid={organisaatioOid}
              steps={false}
              initialValues={initialValues}
              onAttachHakukohde={onAttachHakukohde}
              canSelectBase={false}
            />
          </FormConfigContext.Provider>
        ) : (
          <Spin center />
        )}
      </FormPage>
    </ReduxForm>
  );
};

export default EditHakuPage;
