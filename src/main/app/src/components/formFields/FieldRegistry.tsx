import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { mapValues, pickBy } from 'lodash-es';

// Lomakekohtainen rekisteri siitä, mitkä kentät ovat näkyvissä ja mitkä on poistettu
// näkyvistä. Tallennusrunko rakennetaan tämän tiedon perusteella.
//
// Tila on refeissä eikä statessa: footerit lukevat tiedot vasta tallennushetkellä,
// joten lomakkeen uudelleenrenderöintiä ei tarvitse eikä haluta laukaista.

export type FieldSet = Record<string, { name: string }>;

type FieldRegistry = {
  registerFields: (names: Array<string>) => void;
  unregisterFields: (names: Array<string>) => void;
  getRegisteredFields: () => FieldSet;
  getUnregisteredFields: () => FieldSet;
  clearUnregisteredFields: () => void;
};

const FieldRegistryContext = createContext<FieldRegistry | null>(null);

FieldRegistryContext.displayName = 'FieldRegistryContext';

export const FieldRegistryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Yksi kartta: kentän nimi -> montako kertaa se on tällä hetkellä mountattuna.
  //
  //   avain puuttuu   ei ole koskaan ollut näkyvissä
  //   arvo > 0        näkyvissä nyt            -> registeredFields
  //   arvo === 0      oli näkyvissä, ei enää   -> unregisteredFields
  //
  // Laskuri eikä pelkkä joukko, koska sama nimi VOI olla mountattuna useammin kuin
  // kerran. Joukolla kahden kopion ensimmäinen unmount poistaisi nimen kokonaan,
  // jolloin yhä ruudulla oleva kenttä päätyisi tallennusrunkoon nollana.
  //
  // Virheen suunta ratkaisee: getValuesForSaving kirjoittaa ENSIN poistuneet nulliksi
  // ja VASTA SITTEN rekisteröityjen arvot, joten
  //
  //   laskuri liian suuri  -> piilotetun kentän arvo jää tyhjentymättä backendissä
  //   laskuri liian pieni  -> NÄKYVÄN kentän arvo nollataan
  //
  // Jälkimmäinen on vaarallinen, joten ylimääräinen rekisteröinti on turvallisempi
  // kuin puuttuva.
  //
  // HUOM kirjoitusjärjestyksestä: se ei ole tässä laskurin takia. getValuesForSaving
  // typistää kielipäätteen MOLEMMILTA puolilta, joten nimi.sv (poistunut) ja nimi.fi
  // (rekisteröity) osuvat samaan polkuun nimi - kieliversion poisto kirjoittaa nullin,
  // jonka rekisteröityjen kierros kirjoittaa takaisin.
  const counts = useRef<Record<string, number>>({});

  // Rekisteri rakennetaan kerran laiskalla alustimella: kaikki metodit sulkeutuvat
  // vain counts-refin ylle, joten niiden identiteetti ei koskaan tarvitse muuttua.
  // useState:n laiska muoto takaa tämän rakenteellisesti, eikä varaa erikseen
  // useCallbackia jokaiselle metodille tai useMemoa koko oliolle.
  const [registry] = useState<FieldRegistry>(() => {
    const selectFields = (matches: (count: number) => boolean): FieldSet =>
      mapValues(pickBy(counts.current, matches), (_count, name) => ({
        name,
      }));

    return {
      registerFields: names => {
        names.forEach(name => {
          counts.current[name] = (counts.current[name] ?? 0) + 1;
        });
      },

      unregisterFields: names => {
        names.forEach(name => {
          // Avain JÄÄ nollana: juuri se kirjaa "oli näkyvissä, ei enää". Clamp
          // nollaan, jottei alilaskenta pääse negatiiviseksi ja piiloon.
          counts.current[name] = Math.max((counts.current[name] ?? 0) - 1, 0);
        });
      },

      getRegisteredFields: () => selectFields(count => count > 0),

      getUnregisteredFields: () => selectFields(count => count === 0),

      // Poistuneiden tyhjennys = nollien pudotus. Mountatut kentät jäävät ennalleen.
      //
      // Vastaa redux-formin INITIALIZEa, joka tyhjensi unregisteredFields-siivun.
      // Kutsupaikkoja on kaksi: tallennus (useSaveForm) ja pohjan valinta
      // (PohjaFormCollapse). Molemmissa kutsu tulee käyttäjän eleestä eikä uusien
      // initialValuesien saapumisesta - eli eri commitissa kuin se render, jossa
      // lomake alustuu uudelleen. Efektissä ajettuna tyhjennys söisi samassa
      // commitissa tapahtuneen piilotuksen, koska React ajaa lasten siivoukset
      // ennen vanhemman efektiä.
      clearUnregisteredFields: () => {
        counts.current = pickBy(counts.current, count => count > 0);
      },
    };
  });

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
  // turhaa rekisteröinnin purkua ja uudelleenrekisteröintiä. Erottimeksi rivinvaihto,
  // jota kenttien nimissä (polkuja kuten hakuajat.hakuajat[0].alkaa) ei voi esiintyä.
  //
  // Tyhjät nimet pois: name on tarkoituksella valinnainen, koska osa kutsupaikoista
  // perii sen vanhemmalta - mutta jos se todella puuttuu, avaimeksi tulisi tyhjä
  // merkkijono ja getValuesForSaving kirjoittaisi {"": null} tallennusrunkoon.
  const namesKey = names.filter(Boolean).join('\n');

  useEffect(() => {
    if (!registry || !namesKey) {
      return;
    }
    const fieldNames = namesKey.split('\n');
    registry.registerFields(fieldNames);
    return () => registry.unregisterFields(fieldNames);
  }, [registry, namesKey]);
};
