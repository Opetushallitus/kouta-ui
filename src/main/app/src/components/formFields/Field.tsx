import React, { useCallback, useMemo, useRef } from 'react';

import { isFunction } from 'lodash';
import { Field as RffField, FieldProps } from 'react-final-form';
import { FieldArray as RffFieldArray } from 'react-final-form-arrays';

import { useFieldRegistration } from './FieldRegistry';

// Kaikki sovelluksen Field-/FieldArray-tuonnit kulkevat tästä. Wrapper rekisteröi
// kentät FieldRegistryyn (kouta tyhjentää piilotetun kentän datan, ja tieto "oli
// näkyvissä/piilotettu" tuli ennen redux-formin storesta - react-final-formissa vastaavaa
// ei ole) ja paikkaa hiljaisesti redux-formin yksityiskohdat, joita kirjastolla ei ole.
// Perustelu kunkin korjauksen vieressä: buildErrorAwareComponent, applyEmptyStringRule,
// identityParse, identityFormat. Kaksi muuta on korjattu muualla: arvon luku palauttaa
// muotoillun arvon (hooks/form.ts, useRawValue), ja blur ei muuta arvoa (UrlInput/
// NumberInput kutsuvat onChangea ennen onBluria).
//
// no-restricted-imports estää react-final-formin suoran tuonnin muualla; tämä tiedosto
// on sallittu poikkeus .eslintrc.js:ssä.

// Onko muutoksen uusi arvo tyhjä merkkijono?
const isEmptyStringChange = (eventOrValue: any) => {
  const target = eventOrValue?.target;

  if (target) {
    // Valintaruudut/radiot rajataan pois: niillä target.value ei ole kentän arvo.
    if (target.type === 'checkbox' || target.type === 'radio') {
      return false;
    }
    return target.value === '';
  }

  return eventOrValue === '';
};

// redux-formin sääntö tyhjentyvälle kentälle (CHANGE-reducer): tyhjä merkkijono POISTAA
// arvon jos kentällä ei ollut alkuarvoa, mutta jää tilaan jos alkuarvo oli. Erottaa
// "tyhjensin arvon" tilanteesta "en täyttänyt koskaan". identityParse hoitaa säännön
// jälkimmäisen puolen, tämä edellisen.
const applyEmptyStringRule = (input: any, meta: any, eventOrValue: any) => {
  if (meta?.initial === undefined && isEmptyStringChange(eventOrValue)) {
    input.onChange(undefined);
    return;
  }
  input.onChange(eventOrValue);
};

// onChangen identiteetin pitää pysyä samana: EditorChangePluginin efekti riippuu
// siitä, ja ImageInput joutuisi muuten kiertämään sen refillä. Arvot luetaan
// KUTSUHETKELLÄ refin takaa, ei suljeta sisään - muuten sulkeuma näkisi luontihetken
// vanhentuneen meta.initialin.
const useStableInputSemantics = (input: any, meta: any) => {
  const latest = useRef({ input, meta });
  latest.current = { input, meta };

  const onChange = useCallback((eventOrValue: any) => {
    const l = latest.current;
    applyEmptyStringRule(l.input, l.meta, eventOrValue);
  }, []);

  return { ...input, onChange };
};

// redux-form raportoi tallennusvirheet meta.errorissa (createComponent lukee sitä).
// react-final-formin kanava on meta.submitError; wrapper siirtää sen erroriin, jotta
// käyttäjälle näkyy MIKÄ kenttä pitää korjata. Kanava täyttyy koska useSaveFormin
// käsittelijä PALAUTTAA virheet.
//
// redux-form siivosi virheen ensimmäisellä näppäinpainalluksella; react-final-formissa
// submitError säilyy seuraavaan tallennukseen asti, siksi piilotus
// modifiedSinceLastSubmitin perusteella.
const buildErrorAwareComponent = (Component: any) => {
  const Wrapped = (innerProps: any) => {
    const meta = innerProps.meta;
    const input = useStableInputSemantics(innerProps.input, meta);
    const submitError = meta?.modifiedSinceLastSubmit
      ? undefined
      : meta?.submitError;

    return (
      <Component
        {...innerProps}
        input={input}
        meta={{
          ...meta,
          error: meta?.error ?? submitError,
        }}
      />
    );
  };

  return Wrapped;
};

// react-final-formin oletus-parse muuttaa tyhjän merkkijonon undefinediksi ja karsii
// tyhjentyneet vanhemmat pois arvoista ({nimi: {fi: ''}} -> {}). redux-formin parse oli
// identiteetti eikä tehnyt niin.
const identityParse = (value: any) => value;

// redux-formissa format={null} tarkoitti "ei muotoilua"; react-final-form kutsuu sitä
// aina eikä hyväksy nullia ("format is not a function"). Identiteetti päästää arvon
// (myös undefinedin) läpi koskemattomana. Ainoa kutsupaikka: ToteutusForm/
// OsaamisalatSection.tsx - undefined-arvoinen input voi siellä nostaa Reactin
// controlled/uncontrolled-varoituksen, mikä on odotettu seuraus.
const identityFormat = (value: any) => value;

const FieldWithRegistration = (props: any) => {
  useFieldRegistration([props.name]);

  const { component } = props;
  const rffProps: any = { parse: identityParse, ...props };
  if (rffProps.format === null) {
    rffProps.format = identityFormat;
  }

  // component="input" (merkkijono) ei saa kirjastolta metaa - wrapperille ei silloin
  // ole paikkaa eikä tarvetta.
  const isFunctionComponent = isFunction(component);
  const ErrorAwareComponent = useMemo(
    () => (isFunctionComponent ? buildErrorAwareComponent(component) : null),
    [isFunctionComponent, component]
  );

  if (!ErrorAwareComponent) {
    return <RffField {...rffProps} />;
  }

  return <RffField {...rffProps} component={ErrorAwareComponent} />;
};

// react-final-form-arrays ei tarjoa fields.get(index):iä, kuten redux-form; arvo on
// fields.value-taulukossa. Proxy, koska osa jäsenistä on gettereitä ja
// metodit pitää sitoa alkuperäiseen olioon.
const withReduxFormFieldsApi = (fields: any) => {
  // Nimetty, jotta map antaa iteraattorille PROXYN eikä paikkaamatonta targetia.
  const proxy: any = new Proxy(fields, {
    get(target, prop) {
      if (prop === 'get') {
        return (index: number) => target.value?.[index];
      }

      // redux-form antoi iteraattorille kolme argumenttia (name, index, fields),
      // react-final-form-arrays kaksi. Kolmas tuettu tyypissä, vaikkei yksikään kutsupaikka
      // vielä käytä sitä.
      if (prop === 'map') {
        return (iterator: (name: string, index: number, fields: any) => any) =>
          target.map((name: string, index: number) =>
            iterator(name, index, proxy)
          );
      }

      const value = target[prop];
      return isFunction(value) ? value.bind(target) : value;
    },
  });

  return proxy;
};

const buildFieldsApiComponent = (Component: any) => (innerProps: any) => (
  <Component
    {...innerProps}
    fields={withReduxFormFieldsApi(innerProps.fields)}
  />
);

const FieldArrayWithRegistration = (props: any) => {
  useFieldRegistration([props.name]);

  const { component: Component, ...rest } = props;

  const FieldsApiComponent = useMemo(
    () => buildFieldsApiComponent(Component),
    [Component]
  );

  return <RffFieldArray {...rest} component={FieldsApiComponent} />;
};

// Wrapperin omat proppityypit tukevat kahta asiaa, joita react-final-formin FieldProps
// ei hyväksy: format={null} (ks. identityFormat) ja puuttuva name (osa kutsupaikoista
// saa sen vanhemmalta, esim. DateTimeRange, ValitseEPerusteBox). Cast unknownin kautta,
// koska funktiokomponentti ei ole rakenteellisesti yhteensopiva luokkakomponentin
// konstruktorin kanssa.
type KoutaFieldProps = Omit<FieldProps<any, any>, 'name' | 'format'> & {
  name?: string;
  format?: ((value: any, name: string) => any) | null;
};

export const Field =
  FieldWithRegistration as unknown as React.FC<KoutaFieldProps>;

// FieldArrayn wrapper välittää vapaat lisäpropsit (language, t, readonlyAmount, ...)
// render-komponentille - tarkoituksella laveampi kuin kirjaston
// ComponentType<FieldArrayRenderProps>.
type KoutaFieldArrayProps = {
  name: string;
  component: React.ComponentType<any>;
  [key: string]: any;
};

export const FieldArray =
  FieldArrayWithRegistration as unknown as React.FC<KoutaFieldArrayProps>;

// fields-renderöintipropsin tyyppi tuli redux-formista; kuvataan tässä, koska
// withReduxFormFieldsApi paikkaa getin ja pinta on siksi redux-formin kaltainen.
export type FieldArrayFieldsProps<T> = {
  get: (index: number) => T;
  length: number;
  // Kolmas parametri on kutsupaikoilla käytössä (FieldArrayList).
  map: <R>(
    fn: (name: string, index: number, fields: FieldArrayFieldsProps<T>) => R
  ) => Array<R>;
  push: (value: T) => void;
  remove: (index: number) => void;
  insert: (index: number, value: T) => void;
  move: (from: number, to: number) => void;
  swap: (indexA: number, indexB: number) => void;
  value: Array<T>;
  name: string;
};
