import { useContext, useMemo, useCallback } from 'react';

import _ from 'lodash';
import { useSelector } from 'react-redux';
import { isDirty, isSubmitting, getFormSubmitErrors } from 'redux-form';
import formActions from 'redux-form/lib/actions';

import { ENTITY } from '#/src/constants';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useFormName } from '#/src/contexts/FormNameContext';
import { assert } from '#/src/utils';
import { getKielivalinta } from '#/src/utils/form/formConfigUtils';
import getHakuFormConfig from '#/src/utils/haku/getHakuFormConfig';
import getHakukohdeFormConfig from '#/src/utils/hakukohde/getHakukohdeFormConfig';
import getKoulutusFormConfig from '#/src/utils/koulutus/getKoulutusFormConfig';
import getSoraKuvausFormConfig from '#/src/utils/soraKuvaus/getSoraKuvausFormConfig';
import getToteutusFormConfig from '#/src/utils/toteutus/getToteutusFormConfig';
import getValintaperusteFormConfig from '#/src/utils/valintaperuste/getValintaperusteFormConfig';

import { useActions } from './useActions';

export const useForm = (formNameProp?: string) => {
  const formName = useFormName();

  return useSelector(state => _.get(state, `form.${formNameProp || formName}`));
};

export function useBoundFormActions() {
  const formName = useFormName();
  const boundFormActions = useMemo(
    () =>
      _.mapValues(formActions, action => (...args) =>
        action.apply(null, [formName, ...args])
      ),
    [formName]
  );
  return useActions(boundFormActions);
}

export function useIsDirty() {
  const formName = useFormName();
  return useSelector(isDirty(formName));
}
export function useIsSubmitting(formNameProp?: string) {
  const formName = useFormName();
  return useSelector(isSubmitting(formNameProp ?? formName));
}
export function useSubmitErrors(formNameProp) {
  const formName = useFormName();
  return useSelector(getFormSubmitErrors(formNameProp ?? formName));
}

export function useFieldValue<T = any>(name, formNameProp?: string): T {
  const contextFormName = useFormName();
  const formName = formNameProp || contextFormName;

  assert(formName != null);

  const selector = useCallback(
    state => _.get(state, `form.${formName}.values.${name}`),
    [formName, name]
  );

  return useSelector(selector);
}

const formConfigsGettersByEntity = {
  [ENTITY.KOULUTUS]: getKoulutusFormConfig,
  [ENTITY.TOTEUTUS]: getToteutusFormConfig,
  [ENTITY.HAKU]: getHakuFormConfig,
  [ENTITY.HAKUKOHDE]: getHakukohdeFormConfig,
  [ENTITY.VALINTAPERUSTE]: getValintaperusteFormConfig,
  [ENTITY.SORA_KUVAUS]: getSoraKuvausFormConfig,
};

export const getFormConfigByEntity = (entityName, koulutustyyppi) => {
  return formConfigsGettersByEntity[entityName](koulutustyyppi);
};

export const useEntityFormConfig = (entityName, koulutustyyppi = undefined) => {
  return useMemo(() => getFormConfigByEntity(entityName, koulutustyyppi), [
    entityName,
    koulutustyyppi,
  ]);
};

export const useFormConfig = () => {
  const contextConfig = useContext(FormConfigContext);

  return useMemo(() => {
    return {
      sections: {},
      ...(contextConfig || {}),
    };
  }, [contextConfig]);
};

export const useSelectedLanguages = () => {
  const formName = useFormName();
  return useSelector(state => getKielivalinta(state?.form?.[formName]?.values));
};
