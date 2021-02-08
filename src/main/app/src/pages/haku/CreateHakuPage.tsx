import React, { useMemo } from 'react';

import queryString from 'query-string';
import { useTranslation } from 'react-i18next';

import FormHeader from '#/src/components/FormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { POHJAVALINTA, ENTITY, FormMode } from '#/src/constants';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import useSelectBase from '#/src/hooks/useSelectBase';
import { getFormValuesByHaku } from '#/src/utils/haku/getFormValuesByHaku';
import { useHakuByOid } from '#/src/utils/haku/getHakuByOid';
import getHakuFormConfig from '#/src/utils/haku/getHakuFormConfig';

import { HakuFooter } from './HakuFooter';
import HakuForm, { initialValues } from './HakuForm';

const config = getHakuFormConfig();

const getCopyValues = hakuOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: hakuOid },
  },
});

const getInitialValues = haku => {
  return haku
    ? { ...getCopyValues(haku.oid), ...getFormValuesByHaku(haku) }
    : initialValues;
};

const CreateHakuPage = props => {
  const {
    match: {
      params: { organisaatioOid },
    },
    location: { search },
    history,
  } = props;

  const { kopioHakuOid } = queryString.parse(search);
  const { t } = useTranslation();
  const selectBase = useSelectBase(history, { kopioParam: 'kopioHakuOid' });

  const { data } = useHakuByOid(kopioHakuOid, {
    enabled: kopioHakuOid,
  });

  const initialValues = useMemo(() => {
    return getInitialValues(data);
  }, [data]);

  return (
    <ReduxForm form="hakuForm" initialValues={initialValues}>
      <Title>{t('sivuTitlet.uusiHaku')}</Title>
      <FormPage
        header={<FormHeader>{t('yleiset.haku')}</FormHeader>}
        steps={<FormSteps activeStep={ENTITY.HAKU} />}
        footer={
          <HakuFooter
            formMode={FormMode.CREATE}
            organisaatioOid={organisaatioOid}
          />
        }
      >
        <RelationInfoContainer>
          <OrganisaatioRelation organisaatioOid={organisaatioOid} />
        </RelationInfoContainer>
        <FormConfigContext.Provider value={config}>
          <HakuForm
            steps
            organisaatioOid={organisaatioOid}
            onSelectBase={selectBase}
            showArkistoituTilaOption={false}
          />
        </FormConfigContext.Provider>
      </FormPage>
    </ReduxForm>
  );
};

export default CreateHakuPage;
