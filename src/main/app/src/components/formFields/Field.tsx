import React from 'react';

import _ from 'lodash';
import { Field as RffField, FieldProps } from 'react-final-form';
import { FieldArray as RffFieldArray } from 'react-final-form-arrays';

import { useSubmitErrors } from '#/src/hooks/form';

import { useFieldRegistration } from './FieldRegistry';

// Tämän moduulin kautta kulkevat kaikki sovelluksen Field-, FieldArray- ja Fields-tuonnit.
// Kääre ilmoittaa jokaisen kentän FieldRegistrylle mountissa ja unmountissa, ja renderöi
// sitten redux-formin oman komponentin sellaisenaan.
//
// Miksi näin: lomakekirjaston vaihdon jälkeen kouta ei voi enää lukea redux-formin storesta,
// mitkä kentät ovat olleet näkyvissä (unregisteredFields), koska tieto kerätään tällä hetkellä
// kuuntelemalla redux-formin sisäisiä @@redux-form/*-actioneita. Kun jokainen kenttä kulkee
// tämän moduulin läpi, sama tieto saadaan kerättyä ilman kirjaston sisäisiä rajapintoja.
//
// Rekisteri EI vielä ohjaa tallennusta. Se pyörii vanhan rinnalla ja tuloksia verrataan
// tallennettaessa; vasta kun vertailu on ollut yksimielinen, tallennus siirretään sen varaan.
//
// eslint-sääntö no-restricted-imports estää redux-formin suoran tuonnin muualla; tämä tiedosto
// on sallittu poikkeus .eslintrc.js:n overrides-listalla.

// Kääreet tyypitetään alkuperäisiksi komponenteiksi (typeof ReduxFormField jne.), jotta
// kutsupaikkojen tyypit ja geneeriset parametrit säilyvät täsmälleen ennallaan. Ilman castia
// props-tyypiksi tulisi any, mikä hiljentäisi tarkistuksia 244 kutsupaikassa.

// Kumpi kirjaston komponentti renderöidään, ratkeaa sovittimesta. Se on ainoa kohta,
// jossa kirjasto on eksplisiittisesti näkyvissä - kaikki muu on sovittimen takana.
// Haarautuminen on turvallista tehdä näin, koska kyse ei ole hookeista vaan
// renderöitävästä komponentista.
// Tallennusvalidoinnin virheet kentälle.
//
// redux-form raportoi ne kentän meta.errorissa, ja createComponent
// (formFields/utils.tsx:26) lukee juuri sitä. react-final-formin vastaava kanava on
// meta.submitError - mutta se ei täyty koskaan, koska kouta ei tallenna kirjaston
// handleSubmitin kautta vaan footerista. Virheet elävät sovittimen omassa tilassa,
// josta ne saa useSubmitErrorsilla.
//
// Ilman tätä siirretyillä lomakkeilla tallennus estyy oikein, mutta käyttäjälle ei
// kerrota MITÄ kenttää korjata. Mitattu A/B samalla testilla: redux-formilla
// kentän virhe näkyy, react-final-formilla ei.
//
// Haku on _.get(submitErrors, name), sama kuin ErrorPlaceholderissa - eli
// redux-formin semantiikka.
//
// PYSYVÄ KOMPONENTTI-IDENTITEETTI. Koskee kumpaakin alla olevaa kääreä.
//
// Renderin sisällä luotu kääre olisi joka renderillä uusi komponenttityyppi, jolloin
// React purkaa ja mounttaa koko alipuun uudelleen. Kentälle se tarkoittaa fokuksen
// menetystä kesken kirjoittamisen ja turhaa rekisterikirjanpitoa: unregister ->
// register jokaiselle lapsikentälle joka renderillä. Rekisteri on juuri se mekanismi,
// jonka varassa tallennuksen näkyvyyssääntö on, joten sen turha hakkaaminen on
// pahempaa kuin pelkkä suorituskykyhaitta.
//
// Siksi kääre rakennetaan kerran Componentia kohti ja muistetaan. Kaikki kääreen
// tarvitsema muuttuva tieto luetaan kääreen SISÄLLÄ (hookilla tai propseista), ei
// suljeta sen ylle - muuten muistettu kääre näkisi vanhentunutta tietoa.
//
// Cache on rajattu erillisten kenttäkomponenttien määrään: kutsupaikoissa component
// on aina tavallinen tunniste, ei inline-funktio.
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

// redux-formin sääntö tyhjentyvälle kentälle, sanatarkasti sen reducerista
// (redux-form/lib/createReducer.js, CHANGE):
//
//   if (initial === undefined && payload === '' || payload === undefined) {
//     result = deleteInWithCleanUp(result, "values." + field);
//   }
//
// Eli tyhjä merkkijono POISTAA arvon, jos kentällä ei ole alkuarvoa - mutta jos
// alkuarvo on, tyhjä merkkijono jää tilaan. Ero on merkityksellinen: se erottaa
// "tyhjensin tallennetun arvon" tilanteesta "en täyttänyt tätä koskaan", ja vain
// edellisessä rungossa pitää lähteä tyhjä merkkijono.
//
// Identiteetti-parse yksin toisti vain jälkimmäisen puolen. Mitattu vastaavuus-
// testillä: ilman tätä sääntöä alkuarvoton tyhjennetty kenttä tuottaa
// react-final-formilla {fi: ''} ja redux-formilla {}.
//
//
// TOINEN SÄÄNTÖ, BLUR ASETTAA ARVON. redux-formin BLUR-reducer kirjoittaa
// tapahtuman arvon kentän arvoksi, eli blur voi MUUTTAA arvoa.
// react-final-formissa onBlur ei lue arvoa lainkaan - se vain merkitsee kentän
// kosketetuksi - ja arvo päivittyy yksinomaan onChangen kautta.
//
// Ero ei ole teoreettinen: UrlInput (components/UrlInput/index.tsx) lisää
// puuttuvan http://-etuliitteen kirjoittamalla e.target.valueen ja kutsumalla
// sitten onBluria. Siirretyllä lomakkeella etuliite katosi hiljaa. Mitattu
// Oppilaitoksen runkosnapshotilla: "http://www.verkkosivu.fi" muuttui muotoon
// "www.verkkosivu.fi".
//
// Siksi blurissa verrataan tapahtuman arvoa kentän nykyiseen ja tehdään tarvittaessa
// onChange ennen onBluria.
//
// Select-kentät eivät saa tätä käsittelijää, ja se on tarkoitus: selectMapProps
// (formFields/index.tsx) nollaa onBlurin input-levityksen jälkeen. Ks. sen kommentti -
// siellä on selitys sille miksi rivien järjestys on merkityksellinen.
const withReduxFormInputSemantics = (input: any, meta: any) => {
  const changeTo = (value: any) => {
    if (meta?.initial === undefined && value === '') {
      input.onChange(undefined);
      return;
    }
    input.onChange(value);
  };

  return {
    ...input,
    onChange: (eventOrValue: any) => {
      if (meta?.initial === undefined && isEmptyStringChange(eventOrValue)) {
        input.onChange(undefined);
        return;
      }
      input.onChange(eventOrValue);
    },
    onBlur: (event: any) => {
      const target = event?.target;

      if (
        target &&
        target.type !== 'checkbox' &&
        target.type !== 'radio' &&
        target.value !== input.value
      ) {
        changeTo(target.value);
      }

      input.onBlur(event);
    },
  };
};

const getErrorAwareComponent = memoizeComponentWrapper((Component: any) => {
  const Wrapped = (innerProps: any) => {
    const submitErrors = useSubmitErrors();
    const submitError = _.get(submitErrors, innerProps?.input?.name);

    return (
      <Component
        {...innerProps}
        input={withReduxFormInputSemantics(innerProps.input, innerProps.meta)}
        meta={{
          ...innerProps.meta,
          error: innerProps.meta?.error ?? submitError,
        }}
      />
    );
  };

  return Wrapped;
});

// Tyhjennetyn kentän arvo.
//
// react-final-formin oletus-parse muuttaa tyhjän merkkijonon undefinediksi, minkä
// jälkeen kirjasto karsii tyhjentyneet vanhemmat pois arvoista. redux-form säilyttää
// tyhjän merkkijonon. Mitattu A/B samalla kentällä ja samoilla initialValueilla:
//
//   redux-form        {"tiedot":{"nimi":{"fi":""}}}
//   react-final-form  {}
//
// Ero päätyy tallennettavaan runkoon: kentän tyhjentäminen lähettäisi siirretyllä
// lomakkeella puuttuvan avaimen siinä missa ennen lähti tyhja merkkijono. Mikään
// aiempi testi ei huomannut tätä, koska yksikään testi ei tyhjennä kenttää - sama
// sokea piste kuin fillissä näppäinpainallusten kanssa.
//
// Identiteetti-parse palauttaa redux-formin semantiikan. Kutsupaikka voittaa, jos se
// antaa oman parsen (levitys propseista tulee tarkoituksella jälkeen).
//
// Oletus on TARKOITUKSELLA globaali: se annetaan siirretyn polun kaikille kentille,
// ei vain sille jossa ero havaittiin. Kyse ei ole uudesta linjauksesta vaan
// redux-formin oletuksen palauttamisesta - redux-formin oma parse on identiteetti -
// joten globaali sovellus on nimenomaan se, mikä pitää käyttäytymisen ennallaan.
// Kohdennettu korjaus jättäisi kaikki muut kentät eri semantiikalle.
const identityParse = (value: any) => value;

// redux-formissa format={null} tarkoittaa "ei muotoilua". react-final-form kutsuu
// formattia aina kun se ei ole undefined, joten null KAATAA renderin:
// "TypeError: format is not a function". Kutsupaikka on
// ToteutusForm/OsaamisalatSection.tsx:203 - lomakkeella jota ei ole vielä siirretty,
// joten tämä olisi kaatunut vasta siirrossa.
//
// Identiteettifunktio on sama asia kuin redux-formin "ei muotoilua": arvo menee läpi
// koskemattomana. Kirjaston oma oletusmuotoilu muuttaisi undefinedin tyhjäksi
// merkkijonoksi, mitä format={null} nimenomaan estää.
//
// HUOM Toteutuksen siirtoon: juuri siksi undefined menee tästä läpi, ja se voi nostaa
// Reactin controlled/uncontrolled-varoituksen OsaamisalatSection.tsx:203:ssa, koska
// redux-form sieti siellä undefined-arvoista inputtia. Varoitus on odotettu seuraus
// vastaavuuden säilyttämisestä, ei regressio - jos sen haluaa pois, korjaus kuuluu
// kutsupaikkaan eikä tänne.
const identityFormat = (value: any) => value;

const FieldWithRegistration = (props: any) => {
  useFieldRegistration([props.name]);

  const { component } = props;
  const rffProps: any = { parse: identityParse, ...props };
  if (rffProps.format === null) {
    rffProps.format = identityFormat;
  }

  // Merkkijonokomponentille (esim. component="input") kirjasto ei anna metaa
  // lainkaan, joten kääreelle ei ole paikkaa eikä tarvetta.
  if (!_.isFunction(component)) {
    return <RffField {...rffProps} />;
  }

  return (
    <RffField {...rffProps} component={getErrorAwareComponent(component)} />
  );
};

// react-final-form-arrays ei tarjoa fields.get(index):iä, redux-form tarjoaa. Arvo on
// siellä fields.value-taulukossa. Ero näkyisi jaetuissa komponenteissa, jotka saavat
// fieldsin renderöintipropsina - SisaltoFields ja ToteutusForm/EntityFields käyttävät
// getiä - joten se paikataan tässä eikä kutsupaikoissa. Sama ratkaisu kuin hookeilla:
// yksi sovituskohta, ei muutoksia kutsupaikkoihin.
//
// Proxy eikä levitys, koska fieldsin jäsenistä osa on gettereitä ja metodit pitää
// sitoa alkuperäiseen olioon.
const withReduxFormFieldsApi = (fields: any) =>
  new Proxy(fields, {
    get(target, prop) {
      if (prop === 'get') {
        return (index: number) => target.value?.[index];
      }
      const value = target[prop];
      return _.isFunction(value) ? value.bind(target) : value;
    },
  });

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

// react-final-formissa EI OLE monikkomuotoa Fields, joten se rakennetaan tässä.
//
// Sopimus, joka on TOISTETTAVA tarkasti: redux-form ei anna litteää karttaa
// kokonaisilla pisteellisillä nimillä, vaan olion joka NOUDATTAA POLKURAKENNETTA.
// Kutsupaikka lukee arvon näin (HakukohdeForm/LiitteetFields.tsx:241):
//
//   _.get(props, [baseName, 'yhteinenToimitusaika', 'input', 'value'])
//
// Väärän muotoinen props ei kaatuisi vaan lukisi hiljaa undefinedin, mikä
// tarkoittaisi "ei yhteistä toimitusaikaa" - eli oletusarvoista käyttäytymistä
// väärällä perusteella. Siksi muoto kootaan _.setillä nimestä, jolloin se on
// rakenteeltaan oikea konstruktiolta, ja vastaavuustesti vertaa sitä
// redux-formin antamaan.
//
// Nimet renderöidään SISÄKKÄISINÄ Field-komponentteina eikä silmukassa hookeilla,
// koska names on propsi: silmukka rikkoisi hookien järjestyssäännön heti kun
// nimien määrä muuttuu renderien välillä.
const FieldsShim = ({ names, component: Component, ...rest }: any) => {
  const renderName = (index: number, acc: any): any => {
    if (index >= names.length) {
      return <Component {...rest} {...acc} />;
    }

    const name = names[index];

    return (
      <RffField key={name} name={name}>
        {({ input, meta }: any) =>
          renderName(index + 1, _.set(_.cloneDeep(acc), name, { input, meta }))
        }
      </RffField>
    );
  };

  return renderName(0, {});
};

// Monikkomuoto rekisteröi kaikki nimensä kerralla. Käytössä vain yhdessä paikassa
// (HakukohdeForm/LiitteetFields.tsx), mutta juuri siellä ohjataan lomakkeen mutkikkainta
// näytä/piilota-logiikkaa, joten sen jääminen rekisterin ulkopuolelle olisi pahin mahdollinen
// aukko.
const FieldsWithRegistration = (props: any) => {
  useFieldRegistration(props.names);

  return <FieldsShim {...props} />;
};

// Cast unknownin kautta, koska funktiokomponentti ei ole rakenteellisesti yhteensopiva
// luokkakomponentin konstruktorin kanssa. Kutsupaikkojen kannalta lopputulos on sama:
// props-tyypit ja geneeriset parametrit pysyvät ennallaan.
//
// Tyypit osoittavat nyt react-final-formin komponentteihin, ei redux-formin. EI anyyn:
// se hiljentäisi tarkistukset kaikissa kutsupaikoissa, mikä oli alkuperäisen castin
// koko tarkoitus estää.
// KÄÄREEN OMAT PROPPITYYPIT, ei kirjaston sellaisenaan.
//
// Kääre tukee tarkoituksella kahta asiaa, jotka react-final-formin FieldProps
// hylkää - ja molemmat ovat oikeita kutsupaikkoja:
//
//   format={null}  redux-formin "ei muotoilua". Kääre kääntää sen
//                  identiteettimuotoiluksi, koska kirjasto kutsuisi nullia
//                  funktiona. Kutsupaikka: OsaamisalatSection.tsx:203.
//   name puuttuu   osa kutsupaikoista saa nimen vanhemmalta (esim.
//                  DateTimeRange, ValitseEPerusteBox), joten name ei voi olla
//                  pakollinen.
//
// Näin tarkistukset SÄILYVÄT: any koko komponentille hiljentäisi kaiken 244
// kutsupaikassa, mikä oli alkuperäisen castin koko tarkoitus estää. Tämä tyyppi
// tarkistaa kaikki muut propit normaalisti ja päästää läpi vain ne kaksi
// poikkeamaa, jotka kääre todella toteuttaa.
type KoutaFieldProps = Omit<FieldProps<any, any>, 'name' | 'format'> & {
  name?: string;
  format?: ((value: any, name: string) => any) | null;
};

export const Field =
  FieldWithRegistration as unknown as React.FC<KoutaFieldProps>;
// FieldArrayn kääre välittää vapaat lisäpropsit (language, t, readonlyAmount, ...)
// render-komponentille, jonka propsit eivät siksi ole kirjaston
// ComponentType<FieldArrayRenderProps>. Kutsupaikkoja on kymmenkunta
// (ScheduleSection, YhteyshenkilotFields, KokeetTaiLisanaytotFields, ...), ja
// lisäpropsien välittäminen on kääreen tarkoituksellinen sopimus.
type KoutaFieldArrayProps = {
  name: string;
  component: React.ComponentType<any>;
  [key: string]: any;
};

export const FieldArray =
  FieldArrayWithRegistration as unknown as React.FC<KoutaFieldArrayProps>;

// Fields (monikko) ei ole kirjaston komponentti vaan tämän moduulin korvike, joten
// sille ei ole valmista tyyppiä.
export const Fields = FieldsWithRegistration as React.FC<{
  names: Array<string>;
  component: React.ComponentType<any>;
  [key: string]: any;
}>;

// fields-renderöintipropsin tyyppi. Tuli aiemmin redux-formista; nyt se kuvataan
// tässä, koska juuri tämä moduuli määrittää sen muodon: withReduxFormFieldsApi
// paikkaa getin, jota react-final-form-arrays ei tarjoa, joten pinta on
// redux-formin kaltainen eikä kirjaston oma.
export type FieldArrayFieldsProps<T> = {
  get: (index: number) => T;
  getAll: () => Array<T>;
  length: number;
  // Kolmas parametri on kutsupaikoilla käytössä (FieldArrayList/index.tsx:64).
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
