import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import _ from 'lodash';

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
  // kerran: mikään ei estä renderöimästä samaa kenttää kahdesti, ja kirjasto pitää
  // kopiot synkassa automaattisesti. Tällä hetkellä yhtään tällaista paikkaa ei ole -
  // laskuri on siis varautumista, ei nykytilan kuvaus. Joukolla kahden kopion
  // ensimmäinen unmount poistaisi nimen kokonaan, jolloin yhä ruudulla oleva kenttä
  // päätyisi tallennusrunkoon nollana ja käyttäjä menettäisi arvon hiljaa.
  //
  // Laskurin on siis oltava oikein, ja siksi kannattaa tietää kumpaan suuntaan virhe
  // kaatuu. getValuesForSaving kirjoittaa ENSIN poistuneet nulliksi ja VASTA SITTEN
  // rekisteröityjen arvot, joten:
  //
  //   laskuri liian suuri  -> kenttä pysyy rekisteröitynä liian pitkään: piilotetun
  //                           kentän arvo jää tyhjentymättä backendissä
  //   laskuri liian pieni  -> kenttä putoaa nollaan liian aikaisin: NÄKYVÄN kentän
  //                           arvo nollataan
  //
  // Jälkimmäinen on se vaarallinen - ja myös se, jota on vaikea saada aikaan.
  // Alilaskenta vaatisi unregisterin ilman vastaavaa registeriä, ja koska
  // useFieldRegistration palauttaa siivouksensa samasta efektistä joka rekisteröi,
  // Reactin pitäisi ajaa siivous efektille jota ei koskaan ajettu. Järjestys on silti
  // valittu niin, että ylimääräinen rekisteröinti on turvallisempi kuin puuttuva.
  //
  // HUOM kirjoitusjärjestyksestä: se ei ole tässä laskurin takia eikä poistu tämän
  // myötä. getValuesForSaving typistää kielipäätteen MOLEMMILTA puolilta, joten
  // nimi.sv (poistunut) ja nimi.fi (rekisteröity) osuvat samaan polkuun nimi -
  // kieliversion poistaminen kirjoittaa siis nullin, jonka rekisteröityjen kierros
  // kirjoittaa takaisin. Se on järjestyksen varsinainen tehtävä.
  const counts = useRef<Record<string, number>>({});

  // Poistuneiden tyhjennys = nollien pudotus. Mountatut kentät jäävät ennalleen.
  //
  // Vastaa redux-formin INITIALIZEa, joka tyhjensi unregisteredFields-siivun. Rekisteri
  // ei näe actioneita, joten tyhjennys tehdään käsin, ja kutsupaikkoja on kaksi:
  // tallennus (useSaveForm) ja pohjan valinta (PohjaFormCollapse). Molemmissa kutsu
  // tapahtuu käyttäjän eleestä eikä uusien initialValuesien saapumisesta - eli eri
  // commitissa kuin se render, jossa lomake alustuu uudelleen ja pohjan vaihtumisen
  // aiheuttamat unmountit ajetaan. Sillä erolla on väliä: renderin aikana tehty
  // tyhjennys pitäisi ajaa juuri renderivaiheessa, koska React ajaa lasten siivoukset
  // ennen vanhemman efektiä, ja efektissä tyhjennys söisi samassa commitissa
  // tapahtuneen piilotuksen. Eleestä kutsuttuna tuota kilpailua ei ole.
  const clearUnregisteredFields = useCallback(() => {
    counts.current = _.pickBy(counts.current, count => count > 0);
  }, []);

  const registerFields = useCallback((names: Array<string>) => {
    names.forEach(name => {
      counts.current[name] = (counts.current[name] ?? 0) + 1;
    });
  }, []);

  const unregisterFields = useCallback((names: Array<string>) => {
    names.forEach(name => {
      // Avain JÄÄ nollana: juuri se kirjaa "oli näkyvissä, ei enää". Clamp nollaan,
      // jottei alilaskenta pääse negatiiviseksi ja piiloon.
      counts.current[name] = Math.max((counts.current[name] ?? 0) - 1, 0);
    });
  }, []);

  const getRegisteredFields = useCallback(
    () =>
      _.mapValues(
        _.pickBy(counts.current, count => count > 0),
        (_count, name) => ({ name })
      ),
    []
  );

  const getUnregisteredFields = useCallback(
    () =>
      _.mapValues(
        _.pickBy(counts.current, count => count === 0),
        (_count, name) => ({ name })
      ),
    []
  );

  const registry = useMemo(
    () => ({
      registerFields,
      unregisterFields,
      getRegisteredFields,
      getUnregisteredFields,
      clearUnregisteredFields,
    }),
    [
      registerFields,
      unregisterFields,
      getRegisteredFields,
      getUnregisteredFields,
      clearUnregisteredFields,
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
  // Tyhjät nimet pois. KoutaFieldProps tekee namesta tarkoituksella valinnaisen, koska
  // osa kutsupaikoista perii sen vanhemmalta - mutta jos se todella puuttuu, avaimeksi
  // tulisi tyhjä merkkijono ([undefined].join('\n') === ''), ja getValuesForSaving
  // kirjoittaisi set(saveableValues, '', null) eli {"": null} tallennusrunkoon.
  // Suodatus tekee siitä kentän joka vain ei rekisteröidy.
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
