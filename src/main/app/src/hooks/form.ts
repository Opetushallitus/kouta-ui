import { useContext, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { isDirty, isSubmitting } from 'redux-form';
import formActions from 'redux-form/lib/actions';
import FormNameContext from '#/src/components/FormNameContext';
import FormConfigContext from '#/src/components/FormConfigContext';
import { useActions } from './redux';
import { assert } from '#/src/utils';
import { ENTITY } from '#/src/constants';
import getKoulutusFormConfig from '#/src/utils/getKoulutusFormConfig';
import getToteutusFormConfig from '#/src/utils/getToteutusFormConfig';
import getHakukohdeFormConfig from '#/src/utils/getHakukohdeFormConfig';
import getHakuFormConfig from '#/src/utils/getHakuFormConfig';
import getValintaperusteFormConfig from '#/src/utils/getValintaperusteFormConfig';
import getSoraKuvausFormConfig from '#/src/utils/getSoraKuvausFormConfig';
import getOppilaitosFormConfig from '#/src/utils/getOppilaitosFormConfig';
import getOppilaitoksenOsaFormConfig from '#/src/utils/getOppilaitoksenOsaFormConfig';

export const useFormName = () => useContext(FormNameContext);

export const useForm = () => {
  const formName = useFormName();
  return useSelector(state => _.get(state, `form.${formName}`));
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
  console.log(formName);
  return useSelector(isDirty(formName));
}
export function useIsSubmitting() {
  const formName = useFormName();
  return useSelector(isSubmitting(formName));
}

export function useFieldValue(name, formNameProp?: string) {
  const contextFormName = useContext(FormNameContext);
  const formName = formNameProp || contextFormName;

  assert(formName != null);

  const selector = useCallback(
    state => _.get(state, `form.${formName || contextFormName}.values.${name}`),
    [contextFormName, formName, name]
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
  [ENTITY.OPPILAITOS]: getOppilaitosFormConfig,
  [ENTITY.OPPILAITOKSEN_OSA]: getOppilaitoksenOsaFormConfig,
};

const getFormConfigByEntity = (entityName, options) => {
  return formConfigsGettersByEntity[entityName](...options);
};

export const useEntityFormConfig = (entityName, ...options) => {
  return useMemo(() => getFormConfigByEntity(entityName, options), [
    entityName,
    options,
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
