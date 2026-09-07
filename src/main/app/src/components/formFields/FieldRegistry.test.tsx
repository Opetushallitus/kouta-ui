import { render } from '@testing-library/react';

import {
  FieldRegistryProvider,
  useFieldRegistration,
  useFieldRegistry,
} from './FieldRegistry';

/**
 * Kenttärekisterin testit.
 *
 * Rekisterin on toistettava täsmälleen se, mitä redux-form ja sen rinnalla ajettu
 * unregisteredFields-siivu tekivät - myös siltä osin kuin se näyttää bugilta.
 * Nämä testit lukitsevat säännöt, jotta poikkeama huomataan tässä eikä vasta
 * selaintesteissä runkosnapshotin muutoksena.
 *
 * | redux-form       | rekisteri                                     |
 * |------------------|-----------------------------------------------|
 * | REGISTER_FIELD   | poista unregisteredistä, kasvata laskuria     |
 * | UNREGISTER_FIELD | lisää unregisteredin AINA, pienennä laskuria  |
 * | INITIALIZE       | clearUnregisteredFields() kutsupaikasta       |
 * | DESTROY          | provider unmounttautuu                        |
 *
 * INITIALIZEa vastaavaa tyhjennystä ei päätellä initialValuesista vaan se kutsutaan
 * niistä kahdesta paikasta, joissa lomake alustetaan uudelleen: tallennuksesta
 * (useSaveForm) ja pohjan valinnasta (PohjaFormCollapse).
 */

type Registry = ReturnType<typeof useFieldRegistry>;

let registry: Registry = null;

const Probe = () => {
  registry = useFieldRegistry();
  return null;
};

// Yksittäinen kenttä, kuten <Field name="...">.
const Field = ({ name }: { name: string }) => {
  useFieldRegistration([name]);
  return null;
};

// Useita nimiä kerralla rekisteröivä komponentti.
const Fields = ({ names }: { names: Array<string> }) => {
  useFieldRegistration(names);
  return null;
};

// Lomake, jonka näkyvät kentät annetaan propsina. Kentän poistaminen listalta
// unmounttaa sen - juuri kuten lomakkeella kenttää piilotettaessa.
const Harness = ({ fields = [] }: { fields?: Array<string> }) => (
  <FieldRegistryProvider>
    <Probe />
    {fields.map((name, index) => (
      <Field key={index} name={name} />
    ))}
  </FieldRegistryProvider>
);

const registered = () => Object.keys(registry!.getRegisteredFields()).sort();
const unregistered = () =>
  Object.keys(registry!.getUnregisteredFields()).sort();

beforeEach(() => {
  registry = null;
});

describe('FieldRegistry', () => {
  test('a mounted field is registered', () => {
    render(<Harness fields={['nimi.fi']} />);

    expect(registered()).toEqual(['nimi.fi']);
    expect(unregistered()).toEqual([]);
  });

  test('a multi-name registration registers every name', () => {
    render(
      <FieldRegistryProvider>
        <Probe />
        <Fields names={['liitteet.tyyppi', 'liitteet.toimitustapa']} />
      </FieldRegistryProvider>
    );

    expect(registered()).toEqual(['liitteet.toimitustapa', 'liitteet.tyyppi']);
  });

  test('an unmounted field moves from registered to unregistered', () => {
    const { rerender } = render(<Harness fields={['nimi.fi', 'kuvaus.fi']} />);
    expect(registered()).toEqual(['kuvaus.fi', 'nimi.fi']);

    rerender(<Harness fields={['nimi.fi']} />);

    expect(registered()).toEqual(['nimi.fi']);
    expect(unregistered()).toEqual(['kuvaus.fi']);
  });

  test('remounting a field removes it from unregistered', () => {
    const { rerender } = render(<Harness fields={['nimi.fi']} />);
    rerender(<Harness fields={[]} />);
    expect(unregistered()).toEqual(['nimi.fi']);

    rerender(<Harness fields={['nimi.fi']} />);

    expect(registered()).toEqual(['nimi.fi']);
    expect(unregistered()).toEqual([]);
  });

  test('the whole form unmounting leaves nothing registered', () => {
    const { unmount } = render(<Harness fields={['nimi.fi', 'kuvaus.fi']} />);
    const reg = registry!;

    unmount();

    expect(Object.keys(reg.getRegisteredFields())).toEqual([]);
  });

  // Rekisteröity TAI poistunut, ei koskaan molempia. redux-form lisäsi nimen
  // unregisteredFieldsiin ehdoitta, joten kaksoismountatun kentän toinen unmount
  // jätti nimen kumpaankin joukkoon; se ei rikkonut tallennusrunkoa, koska
  // rekisteröidyt kirjoitetaan poistuneiden jälkeen, mutta se oli silti tilaa jossa
  // "näkyvissä" ja "poistettu näkyvistä" olivat yhtä aikaa totta.
  //
  // Yhden laskurin myötä sellaista tilaa ei ole: kun toinen kopio unmounttautuu,
  // laskuri on yhä 1 eikä nimi näy poistuneissa lainkaan.
  test('a field is either registered or unregistered, never both', () => {
    const { rerender } = render(<Harness fields={['nimi.fi', 'nimi.fi']} />);
    expect(registered()).toEqual(['nimi.fi']);
    expect(unregistered()).toEqual([]);

    rerender(<Harness fields={['nimi.fi']} />);

    expect(registered()).toEqual(['nimi.fi']);
    expect(unregistered()).toEqual([]);

    rerender(<Harness fields={[]} />);

    expect(registered()).toEqual([]);
    expect(unregistered()).toEqual(['nimi.fi']);
  });

  test('clearUnregisteredFields leaves mounted fields registered', () => {
    const { rerender } = render(<Harness fields={['nimi.fi', 'kuvaus.fi']} />);
    rerender(<Harness fields={['nimi.fi']} />);
    expect(unregistered()).toEqual(['kuvaus.fi']);

    registry!.clearUnregisteredFields();

    expect(unregistered()).toEqual([]);
    expect(registered()).toEqual(['nimi.fi']);
  });

  // namesKey pitää huolen siitä, ettei uusi mutta sisällöltään sama nimitaulukko
  // aiheuta rekisteröinnin purkua ja uudelleenrekisteröintiä. Ilman sitä kenttä
  // kirjattaisiin poistuneeksi joka renderillä.
  test('a fresh but equal names array does not re-register the fields', () => {
    const Tree = () => (
      <FieldRegistryProvider>
        <Probe />
        <Fields names={['liitteet.tyyppi', 'liitteet.toimitustapa']} />
      </FieldRegistryProvider>
    );

    const { rerender } = render(<Tree />);
    rerender(<Tree />);

    expect(registered()).toEqual(['liitteet.toimitustapa', 'liitteet.tyyppi']);
    expect(unregistered()).toEqual([]);
  });

  // Uudelleenalustuksen järjestys: tyhjennys tulee eleestä, eli eri commitista kuin se
  // render, jossa uudet arvot saapuvat ja niiden piilottamat kentät unmounttautuvat.
  // Tyhjennys ei siis voi syödä samaan alustukseen kuuluvaa piilotusta - kuten kävisi,
  // jos tyhjennys ajettaisiin efektissä (React ajaa lasten siivoukset ennen vanhemman
  // efektiä).
  test('fields hidden after a clear are still recorded as unregistered', () => {
    const { rerender } = render(<Harness fields={['nimi.fi', 'kuvaus.fi']} />);
    rerender(<Harness fields={['nimi.fi']} />);
    expect(unregistered()).toEqual(['kuvaus.fi']);

    // Pohjan valinta: vanhan lomakkeen piilotukset pudotetaan.
    registry!.clearUnregisteredFields();
    expect(unregistered()).toEqual([]);

    // Kopio saapuu, ja uusi lomake piilottaa toisen kentän.
    rerender(<Harness fields={[]} />);

    expect(unregistered()).toEqual(['nimi.fi']);
  });
});
