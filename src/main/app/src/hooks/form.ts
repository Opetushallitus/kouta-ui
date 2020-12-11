import { useContext, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { isDirty, isSubmitting } from 'redux-form';
import formActions from 'redux-form/lib/actions';
import FormNameContext from '#/src/contexts/FormNameContext';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useActions } from './useActions';
import { assert } from '#/src/utils';
import { ENTITY } from '#/src/constants';
import getKoulutusFormConfig from '#/src/utils/koulutus/getKoulutusFormConfig';
import getToteutusFormConfig from '#/src/utils/toteutus/getToteutusFormConfig';
import getHakukohdeFormConfig from '#/src/utils/hakukohde/getHakukohdeFormConfig';
import getHakuFormConfig from '#/src/utils/haku/getHakuFormConfig';
import getValintaperusteFormConfig from '#/src/utils/valintaperuste/getValintaperusteFormConfig';
import getSoraKuvausFormConfig from '#/src/utils/soraKuvaus/getSoraKuvausFormConfig';
import getOppilaitosFormConfig from '#/src/utils/oppilaitos/getOppilaitosFormConfig';
import getOppilaitoksenOsaFormConfig from '#/src/utils/oppilaitoksenOsa/getOppilaitoksenOsaFormConfig';
import { getKielivalinta } from '#/src/utils/form/formConfigUtils';

export const useFormName = () => useContext(FormNameContext);

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
export function useIsSubmitting() {
  const formName = useFormName();
  return useSelector(isSubmitting(formName));
}

export function useFieldValue<T = any>(name, formNameProp?: string): T {
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
