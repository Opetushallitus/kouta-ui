import { render } from '@testing-library/react';

import {
  FieldRegistryProvider,
  useFieldRegistration,
  useFieldRegistry,
} from './FieldRegistry';

/**
 * Kenttärekisterin testit.
 *
 * Rekisterin on toistettava täsmälleen se, mitä redux-form ja rootReducer.ts:n
 * unregisteredFields-siivu tekivät - myös siltä osin kuin se näyttää bugilta.
 * Nämä testit lukitsevat säännöt, jotta poikkeama huomataan tässä eikä vasta
 * selaintesteissä runkosnapshotin muutoksena.
 *
 * | redux-form       | rekisteri                                     |
 * |------------------|-----------------------------------------------|
 * | REGISTER_FIELD   | poista unregisteredistä, kasvata laskuria     |
 * | UNREGISTER_FIELD | lisää unregisteredin AINA, pienennä laskuria  |
 * | INITIALIZE       | tyhjennä unregistered                         |
 * | DESTROY          | tyhjennä unregistered                         |
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

// Monikkomuoto, kuten <Fields names={[...]}>.
const Fields = ({ names }: { names: Array<string> }) => {
  useFieldRegistration(names);
  return null;
};

// Lomake, jonka näkyvät kentät annetaan propsina. Kentän poistaminen listalta
// unmounttaa sen - juuri kuten lomakkeella kenttää piilotettaessa.
const Harness = ({
  fields = [],
  initialValues,
}: {
  fields?: Array<string>;
  initialValues?: any;
}) => (
  <FieldRegistryProvider initialValues={initialValues}>
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

  // Vastaa vanhan reducerin riviä rootReducer.ts:44-48, joka lisää nimen
  // unregisteredFieldsiin ehdoitta. Tämä NÄYTTÄÄ bugilta, mutta se ei ole: kenttä
  // on yhä rekisteröitynä, ja getValuesForSaving kirjoittaa rekisteröidyt kentät
  // vasta poistuneiden jälkeen, jolloin arvo palautuu. Ks. reunatapaus B9.
  test('unregistering is unconditional even when a duplicate is still mounted', () => {
    const { rerender } = render(<Harness fields={['nimi.fi', 'nimi.fi']} />);
    expect(registered()).toEqual(['nimi.fi']);

    rerender(<Harness fields={['nimi.fi']} />);

    expect(registered()).toEqual(['nimi.fi']);
    expect(unregistered()).toEqual(['nimi.fi']);
  });

  test('reset clears unregistered but leaves mounted fields registered', () => {
    const { rerender } = render(<Harness fields={['nimi.fi', 'kuvaus.fi']} />);
    rerender(<Harness fields={['nimi.fi']} />);
    expect(unregistered()).toEqual(['kuvaus.fi']);

    registry!.reset();

    expect(unregistered()).toEqual([]);
    expect(registered()).toEqual(['nimi.fi']);
  });

  // enableReinitialize: redux-form alustaa lomakkeen uudelleen, kun initialValues
  // eroaa sisällöltään, ja INITIALIZE tyhjentää unregisteredFieldsin.
  test('changing initialValues by content clears unregistered', () => {
    const { rerender } = render(
      <Harness fields={['nimi.fi', 'kuvaus.fi']} initialValues={{ a: 1 }} />
    );
    rerender(<Harness fields={['nimi.fi']} initialValues={{ a: 1 }} />);
    expect(unregistered()).toEqual(['kuvaus.fi']);

    rerender(<Harness fields={['nimi.fi']} initialValues={{ a: 2 }} />);

    expect(unregistered()).toEqual([]);
  });

  test('a deep-equal initialValues object does not clear unregistered', () => {
    const { rerender } = render(
      <Harness fields={['nimi.fi', 'kuvaus.fi']} initialValues={{ a: 1 }} />
    );
    rerender(<Harness fields={['nimi.fi']} initialValues={{ a: 1 }} />);
    expect(unregistered()).toEqual(['kuvaus.fi']);

    // Uusi olio, sama sisältö. redux-form vertaa sisältöä, ei identiteettiä.
    rerender(<Harness fields={['nimi.fi']} initialValues={{ a: 1 }} />);

    expect(unregistered()).toEqual(['kuvaus.fi']);
  });

  // redux-form lähettää INITIALIZEn UNSAFE_componentWillReceiveProps:sta eli
  // RENDERIVAIHEESSA (createReduxForm.js:556-557), ennen kuin lapsikomponenttien
  // unmount-siivoukset ajetaan. Järjestys on siis: tyhjennä, sitten lisää.
  //
  // Efektissä tehtynä järjestys olisi päinvastainen, koska React ajaa lasten
  // siivoukset ennen vanhemman efektiä: lisää, sitten tyhjennä - ja piilotus katoaisi.
  // Tämä testi lukitsee redux-formin järjestyksen.
  test('hiding a field and changing initialValues in one render keeps the hidden field', () => {
    const { rerender } = render(
      <Harness fields={['nimi.fi', 'kuvaus.fi']} initialValues={{ a: 1 }} />
    );

    // Sama renderi sekä piilottaa kentän että muuttaa initialValuesin sisältöä.
    rerender(<Harness fields={['nimi.fi']} initialValues={{ a: 2 }} />);

    expect(unregistered()).toEqual(['kuvaus.fi']);
  });

  // namesKey pitää huolen siitä, ettei uusi mutta sisällöltään sama nimitaulukko
  // aiheuta rekisteröinnin purkua ja uudelleenrekisteröintiä. Ilman sitä <Fields>
  // kirjaisi nimensä poistuneiksi joka renderillä.
  test('a fresh but equal names array does not re-register Fields', () => {
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

  // Tallennuksen jälkeen useSaveForm kutsuu initialize(formName, currentValues),
  // jolloin redux-formin initial on jotain muuta kuin viimeksi nähty propsi.
  // reset(nextInitialValues) siirtää saman vertailukohdan myös rekisterille.
  test('reset takes a new baseline, so the matching prop update does not clear', () => {
    const { rerender } = render(
      <Harness fields={['nimi.fi']} initialValues={{ a: 1 }} />
    );

    // Tallennus: rekisteri nollataan ja vertailukohdaksi tulee tallennettu arvo.
    registry!.reset({ a: 2 });

    // Sama rerender sekä piilottaa kentän että päivittää propsin tallennettuun
    // arvoon. React ajaa siivoukset ennen efektejä, joten ilman uutta
    // vertailukohtaa tyhjennys tapahtuisi piilotuksen JÄLKEEN ja söisi sen.
    rerender(<Harness fields={[]} initialValues={{ a: 2 }} />);

    expect(unregistered()).toEqual(['nimi.fi']);
  });
});
