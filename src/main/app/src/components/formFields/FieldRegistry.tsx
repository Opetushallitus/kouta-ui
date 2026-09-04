import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import _ from 'lodash';

// Lomakekohtainen rekisteri siitä, mitkä kentät ovat näkyvissä ja mitkä ovat olleet
// näkyvissä mutta eivät enää.
//
// Tämä ON nyt ainoa lähde sekä tallennettavan rungon näkyvyyssäännölle että
// validoinnille. Se korvasi redux-formilta luetun tiedon
// (state.form[lomake].registeredFields ja rootReducer.ts:n unregisteredFields-siivu,
// joka kuunteli redux-formin sisäisiä @@redux-form/*-actioneita); molemmat poistuivat
// redux-formin mukana, samoin niitä vasten ajettu varjovertailu.
//
// Yksi asia on tehty tarkoituksella eri tavalla kuin vanhassa:
// 1. Tila on refeissä eikä statessa. Footerit lukevat rekisterin vasta tallennushetkellä,
//    joten renderöintiin ei ole tarvetta koskea. Statessa jokainen kentän mount ja unmount
//    aiheuttaisi uudelleenrenderöinnin - kielivälilehden vaihdossa niitä on satoja.

export type FieldSet = Record<string, { name: string }>;

type FieldRegistry = {
  registerFields: (names: Array<string>) => void;
  unregisterFields: (names: Array<string>) => void;
  getRegisteredFields: () => FieldSet;
  getUnregisteredFields: () => FieldSet;
  reset: (nextInitialValues?: any) => void;
};

const FieldRegistryContext = createContext<FieldRegistry | null>(null);

FieldRegistryContext.displayName = 'FieldRegistryContext';

export const FieldRegistryProvider = ({
  initialValues,
  children,
}: {
  initialValues?: any;
  children: React.ReactNode;
}) => {
  // Montako kertaa kukin kenttä on tällä hetkellä mountattuna. Sama nimi voi olla
  // näkyvissä useammin kuin kerran, joten pelkkä joukko ei riitä.
  const counts = useRef<Record<string, number>>({});
  const unregistered = useRef<FieldSet>({});

  // Viimeisin arvo, jota vastaan saapuvia initialValues-propseja verrataan. Vastaa
  // redux-formin state.form[lomake].initial-arvoa, ei edellistä propsia - ks. alempi
  // useEffect.
  const initialRef = useRef(initialValues);

  const registerFields = useCallback((names: Array<string>) => {
    names.forEach(name => {
      counts.current[name] = (counts.current[name] ?? 0) + 1;
      delete unregistered.current[name];
    });
  }, []);

  const unregisterFields = useCallback((names: Array<string>) => {
    names.forEach(name => {
      const remaining = (counts.current[name] ?? 0) - 1;
      if (remaining > 0) {
        counts.current[name] = remaining;
      } else {
        delete counts.current[name];
      }
      // HUOM: lisätään aina, myös silloin kun sama kenttä on yhä näkyvissä muualla.
      // Näin tekee myös vanha reducer (rootReducer.ts:44-48). Se ei ole vahinko vaan
      // toimii, koska getValuesForSaving kirjoittaa rekisteröidyt kentät vasta
      // rekisteristä poistuneiden jälkeen, jolloin yhä näkyvä kenttä kirjoitetaan
      // takaisin. Ks. reunatapaus B9.
      unregistered.current[name] = { name };
    });
  }, []);

  const getRegisteredFields = useCallback(
    () => _.mapValues(counts.current, (_count, name) => ({ name })),
    []
  );

  const getUnregisteredFields = useCallback(
    () => ({ ...unregistered.current }),
    []
  );

  const reset = useCallback((nextInitialValues?: any) => {
    unregistered.current = {};
    if (!_.isUndefined(nextInitialValues)) {
      initialRef.current = nextInitialValues;
    }
  }, []);

  // ReduxForm asettaa enableReinitialize: true, joten redux-form alustaa lomakkeen
  // uudelleen aina kun initialValues eroaa SISÄLLÖLTÄÄN tallennetusta initial-arvosta -
  // ja INITIALIZE tyhjentää vanhan unregisteredFieldsin. Sama sääntö tässä.
  //
  // Vertailu tehdään tallennettua initialRefiä vastaan eikä edellistä propsia vastaan,
  // koska juuri niin redux-form tekee: tallennuksen jälkeen useSaveForm kutsuu
  // initialize(formName, currentValues), jolloin initial on jotain muuta kuin viimeksi
  // nähty propsi. Ks. reset(nextInitialValues).
  //
  // HUOM: tämä tehdään renderin aikana eikä efektissä, ja se on järjestyskysymys.
  // redux-form lähettää INITIALIZEn UNSAFE_componentWillReceiveProps:sta eli
  // renderivaiheessa (createReduxForm.js:556-557), ENNEN kuin lapsikomponenttien
  // unmount-siivoukset ajetaan: ensin tyhjennys, sitten lisäys. Efektissä järjestys
  // olisi päinvastainen, koska React ajaa lasten siivoukset ennen vanhemman efektiä.
  // Silloin samassa commitissa tapahtuva piilotus + initialValues-muutos jäisi
  // kirjaamatta, eikä piilotettua kenttää tyhjennettäisi backendissä.
  if (!_.isEqual(initialRef.current, initialValues)) {
    initialRef.current = initialValues;
    unregistered.current = {};
  }

  const registry = useMemo(
    () => ({
      registerFields,
      unregisterFields,
      getRegisteredFields,
      getUnregisteredFields,
      reset,
    }),
    [
      registerFields,
      unregisterFields,
      getRegisteredFields,
      getUnregisteredFields,
      reset,
    ]
  );

  return (
    <FieldRegistryContext.Provider value={registry}>
      {children}
    </FieldRegistryContext.Provider>
  );
};

// Palauttaa rekisterin tai null, jos komponenttia käytetään lomakkeen ulkopuolella.
// Nullin salliminen on tarkoituksellista: kenttäkomponentteja renderöidään myös
// testeissä ilman lomaketta, eikä rekisterin puuttuminen saa kaataa mitään.
export const useFieldRegistry = () => useContext(FieldRegistryContext);

// Ilmoittaa rekisterille, että nämä kentät ovat näkyvissä, ja unmountissa että eivät enää.
export const useFieldRegistration = (names: Array<string>) => {
  const registry = useFieldRegistry();

  // Nimet riippuvuutena merkkijonona, jottei uusi taulukko joka renderillä aiheuta
  // turhaa rekisteröinnin purkua ja uudelleenrekisteröintiä.
  // Erottimeksi rivinvaihto, jota kenttien nimissä (polkuja kuten
  // hakuajat.hakuajat[0].alkaa) ei voi esiintyä.
  const namesKey = names.join('\n');

  useEffect(() => {
    if (!registry) {
      return;
    }
    const fieldNames = namesKey.split('\n');
    registry.registerFields(fieldNames);
    return () => registry.unregisterFields(fieldNames);
  }, [registry, namesKey]);
};
