import React, { useCallback, useRef } from 'react';

import _ from 'lodash';
import { Field as RffField, FieldProps } from 'react-final-form';
import { FieldArray as RffFieldArray } from 'react-final-form-arrays';

import { useFieldRegistration } from './FieldRegistry';

// Tämän moduulin kautta kulkevat kaikki sovelluksen Field- ja FieldArray-tuonnit.
// Wrapper tekee kaksi asiaa: ilmoittaa jokaisen kentän FieldRegistrylle mountissa ja
// unmountissa, ja toistaa ne redux-formin yksityiskohdat, joita react-final-formissa
// ei ole.
//
// Rekisteröinti: kouta tyhjentää dataa backendistä piilottamalla kentän, ja tieto
// "oli näkyvissä, ei enää" luettiin ennen redux-formin storesta (unregisteredFields).
// react-final-formissa vastaavaa ei ole, joten se kerätään täällä.
//
// Kirjastoerot, jotka wrapper toistaa. Jokainen on hiljainen: mikään ei kaadu, runko
// vain muuttuu. Perustelu on kunkin korjauksen vieressä - getErrorAwareComponent,
// memoizeComponentWrapper, applyEmptyStringRule, identityParse, identityFormat.
//
// Kaksi eroa on korjattu muualla: arvon luku palauttaa muotoillun arvon eikä raakaa
// (hooks/form.ts, useRawValue), ja blur ei voi muuttaa arvoa (UrlInput ja NumberInput
// kutsuvat onChangea ennen onBluria).
//
// eslint-sääntö no-restricted-imports estää react-final-formin suoran tuonnin muualla;
// tämä tiedosto on sallittu poikkeus .eslintrc.js:n overrides-listalla.

// Pysyvä komponentti-identiteetti. Renderin sisällä luotu wrapper olisi joka renderillä
// uusi komponenttityyppi, jolloin React purkaa ja mounttaa koko alipuun uudelleen:
// fokus katoaa kesken kirjoittamisen ja rekisteri saa unregister -> register joka
// renderillä. Kaikki muuttuva tieto luetaan wrapperin SISÄLLÄ, ei suljeta sen ylle.
// Cache on rajattu: kutsupaikoissa component on aina tunniste, ei inline-funktio.
const memoizeComponentWrapper = (build: (Component: any) => any) => {
  const cache = new Map<any, any>();

  return (Component: any) => {
    const cached = cache.get(Component);
    if (cached) {
      return cached;
    }

    const Wrapped = build(Component);
    cache.set(Component, Wrapped);
    return Wrapped;
  };
};

// Tunnistaa muutoksen, jonka uusi arvo on tyhjä merkkijono. Valintaruudut ja
// radiot rajataan pois: niillä target.value ei ole kentän arvo lainkaan.
const isEmptyStringChange = (eventOrValue: any) => {
  const target = eventOrValue?.target;

  if (target) {
    if (target.type === 'checkbox' || target.type === 'radio') {
      return false;
    }
    return target.value === '';
  }

  return eventOrValue === '';
};

// redux-formin sääntö tyhjentyvälle kentälle, sen reducerista (createReducer.js,
// CHANGE):
//
//   if (initial === undefined && payload === '' || payload === undefined) {
//     result = deleteInWithCleanUp(result, "values." + field);
//   }
//
// Tyhjä merkkijono siis POISTAA arvon, jos kentällä ei ole alkuarvoa, mutta jää tilaan
// jos alkuarvo on. Ero erottaa "tyhjensin tallennetun arvon" tilanteesta "en täyttänyt
// tätä koskaan". identityParse toistaa säännön jälkimmäisen puolen, tämä edellisen.
const applyEmptyStringRule = (input: any, meta: any, eventOrValue: any) => {
  if (meta?.initial === undefined && isEmptyStringChange(eventOrValue)) {
    input.onChange(undefined);
    return;
  }
  input.onChange(eventOrValue);
};

// Pysyvä identiteetti onChangelle. Kutsupaikat olettavat sitä: Lexicalin
// EditorChangePlugin purkaisi ja rekisteröisi update-listenerin joka renderillä
// (onChange on sen efektin riippuvuus), ja ImageInput joutuisi kiertämään oman
// riippuvuuslistansa refillä.
//
// Sääntö luetaan KUTSUHETKELLÄ refin takaa: sulkeuma näkisi sen renderin
// meta.initialin jolla se luotiin, ja vanhentunut alkuarvo on tässä sama asia kuin
// väärä arvo lomakkeeseen.
const useStableInputSemantics = (input: any, meta: any) => {
  const latest = useRef({ input, meta });
  latest.current = { input, meta };

  const onChange = useCallback((eventOrValue: any) => {
    const l = latest.current;
    applyEmptyStringRule(l.input, l.meta, eventOrValue);
  }, []);

  return { ...input, onChange };
};

// Tallennusvalidoinnin virheet kentälle.
//
// redux-form raportoi ne kentän meta.errorissa, ja createComponent
// (formFields/utils.tsx) lukee juuri sitä. react-final-formin kanava on
// meta.submitError. Wrapper siirtää sen meta.erroriin - ilman siirtoa tallennus estyy
// oikein, mutta käyttäjälle ei kerrota MITÄ kenttää korjata. Kanava täyttyy vain
// koska useSaveFormin käsittelijä PALAUTTAA virheet (ReactFinalForm/index.tsx).
//
// redux-formin CHANGE-reducer siivosi virheen ensimmäisellä näppäinpainalluksella.
// react-final-formissa submitError säilyy seuraavaan tallennukseen asti, joten se
// piilotetaan kirjaston oman meta.modifiedSinceLastSubmit-lipun perusteella.
const getErrorAwareComponent = memoizeComponentWrapper((Component: any) => {
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
});

// react-final-formin oletus-parse muuttaa tyhjän merkkijonon undefinediksi, minkä
// jälkeen kirjasto karsii tyhjentyneet vanhemmat pois arvoista: {nimi: {fi: ''}}
// muuttuu tyhjäksi olioksi. redux-formin oma parse on identiteetti, ja tyhjä
// merkkijono säilyi. Kutsupaikka voittaa, jos se antaa oman parsen.
const identityParse = (value: any) => value;

// redux-formissa format={null} tarkoittaa "ei muotoilua". react-final-form kutsuu
// formattia aina kun se ei ole undefined, joten null kaataa renderin ("format is not
// a function"). Identiteetti päästää arvon läpi koskemattomana, myös undefinedin -
// kirjaston oletusmuotoilu muuttaisi sen tyhjäksi merkkijonoksi. Kutsupaikka on
// ToteutusForm/OsaamisalatSection.tsx, jossa undefined-arvoinen input voi nostaa
// Reactin controlled/uncontrolled-varoituksen; se on odotettu seuraus.
const identityFormat = (value: any) => value;

const FieldWithRegistration = (props: any) => {
  useFieldRegistration([props.name]);

  const { component } = props;
  const rffProps: any = { parse: identityParse, ...props };
  if (rffProps.format === null) {
    rffProps.format = identityFormat;
  }

  // Merkkijonokomponentille (esim. component="input") kirjasto ei anna metaa
  // lainkaan, joten wrapperille ei ole paikkaa eikä tarvetta.
  if (!_.isFunction(component)) {
    return <RffField {...rffProps} />;
  }

  return (
    <RffField {...rffProps} component={getErrorAwareComponent(component)} />
  );
};

// react-final-form-arrays ei tarjoa fields.get(index):iä, redux-form tarjoaa. Arvo on
// fields.value-taulukossa. Ero näkyisi jaetuissa komponenteissa, jotka saavat fieldsin
// renderöintipropsina (SisaltoFields, ToteutusForm/EntityFields).
//
// Proxy eikä levitys, koska fieldsin jäsenistä osa on gettereitä ja metodit pitää
// sitoa alkuperäiseen olioon.
const withReduxFormFieldsApi = (fields: any) => {
  // Proxy nimetään, jotta map voi antaa iteraattorille PROXYN eikä targetia, joka on
  // paikkaamaton react-final-form-arraysin olio ilman getiä.
  const proxy: any = new Proxy(fields, {
    get(target, prop) {
      if (prop === 'get') {
        return (index: number) => target.value?.[index];
      }

      // redux-form antoi iteraattorille KOLME argumenttia (name, index, fields),
      // react-final-form-arrays antaa kaksi. FieldArrayList purkaa kolmannen ja
      // välittää sen eteenpäin; yksikään kutsupaikka ei vielä lue sitä, mutta tyyppi
      // lupaa sen.
      if (prop === 'map') {
        return (iterator: (name: string, index: number, fields: any) => any) =>
          target.map((name: string, index: number) =>
            iterator(name, index, proxy)
          );
      }

      const value = target[prop];
      return _.isFunction(value) ? value.bind(target) : value;
    },
  });

  return proxy;
};

const getFieldsApiComponent = memoizeComponentWrapper(
  (Component: any) => (innerProps: any) => (
    <Component
      {...innerProps}
      fields={withReduxFormFieldsApi(innerProps.fields)}
    />
  )
);

const FieldArrayWithRegistration = (props: any) => {
  useFieldRegistration([props.name]);

  const { component: Component, ...rest } = props;

  return (
    <RffFieldArray {...rest} component={getFieldsApiComponent(Component)} />
  );
};

// Wrapperin OMAT proppityypit, ei kirjaston sellaisenaan eikä any. Wrapper tukee
// tarkoituksella kahta asiaa, jotka react-final-formin FieldProps hylkää:
//
//   format={null}  redux-formin "ei muotoilua", ks. identityFormat.
//   name puuttuu   osa kutsupaikoista saa nimen vanhemmalta (esim. DateTimeRange,
//                  ValitseEPerusteBox), joten name ei voi olla pakollinen.
//
// Vapaat lisäpropsit menevät läpi jo kirjaston tyypissä ([key: string]: any), joten
// tarkistus kohdistuu kirjaston tuntemiin konfiguraatioavaimiin. Cast unknownin kautta,
// koska funktiokomponentti ei ole rakenteellisesti yhteensopiva luokkakomponentin
// konstruktorin kanssa.
type KoutaFieldProps = Omit<FieldProps<any, any>, 'name' | 'format'> & {
  name?: string;
  format?: ((value: any, name: string) => any) | null;
};

export const Field =
  FieldWithRegistration as unknown as React.FC<KoutaFieldProps>;

// FieldArrayn wrapper välittää vapaat lisäpropsit (language, t, readonlyAmount, ...)
// render-komponentille, jonka propsit eivät siksi ole kirjaston
// ComponentType<FieldArrayRenderProps>. Se on tarkoituksellinen sopimus.
type KoutaFieldArrayProps = {
  name: string;
  component: React.ComponentType<any>;
  [key: string]: any;
};

export const FieldArray =
  FieldArrayWithRegistration as unknown as React.FC<KoutaFieldArrayProps>;

// fields-renderöintipropsin tyyppi. Tuli aiemmin redux-formista; nyt se kuvataan tässä,
// koska withReduxFormFieldsApi paikkaa getin ja pinta on siksi redux-formin kaltainen
// eikä kirjaston oma.
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
