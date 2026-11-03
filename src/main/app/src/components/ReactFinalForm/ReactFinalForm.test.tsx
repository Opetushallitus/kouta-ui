import React, { useCallback, useEffect, useState } from 'react';

import { act, render, waitFor } from '@testing-library/react';

import { Field, FieldArray } from '#/src/components/formFields/Field';
import { ReactFinalForm } from '#/src/components/ReactFinalForm';
import {
  useForm,
  useRegisterSubmitHandler,
  useSubmitForm,
} from '#/src/hooks/form';

/**
 * Footerit lukevat kenttäjoukon VASTA tallennushetkellä, vaikka ne ottavat form-olion
 * talteen renderissä. Kenttärekisteri elää refeissä eikä FieldRegistryProvider
 * renderöi uudelleen kenttien mountatessa, joten renderin aikainen tilannekuva jäisi
 * tyhjäksi. Getterinä joukko evaluoituu lukuhetkellä.
 */
test('registeredFields luetaan lukuhetkellä, ei renderin aikana', async () => {
  let capturedForm: any = null;

  const Probe = () => {
    const form = useForm();
    // Sama kuvio kuin footereissa: submit on useCallback, joka sulkee sisäänsä
    // form-olion siltä renderiltä jolloin se luotiin - ei uusimmalta. Otetaan
    // siis talteen NIMENOMAAN ensimmäinen, ei viimeisin.
    if (!capturedForm) {
      capturedForm = form;
    }
    return null;
  };

  render(
    <ReactFinalForm form="soraKuvaus" mode="edit" initialValues={{}}>
      <Probe />
      <Field name="nimi.fi" component="input" />
      <Field name="tila" component="input" />
    </ReactFinalForm>
  );

  // Luetaan vasta nyt, mountin jälkeen - kuten tallennus tekee. waitForilla, koska
  // rekisteröinti tapahtuu efektissä. Tilannekuvaversiossa talteen otettu joukko on
  // jäätynyt tyhjäksi eikä täyty odottamallakaan.
  await waitFor(() => {
    expect(Object.keys(capturedForm.registeredFields).sort()).toEqual([
      'nimi.fi',
      'tila',
    ]);
  });
});

const TyhjaKentta = () => null;

/**
 * FieldArray-wrapper ei saa luoda uutta komponenttityyppiä joka renderillä.
 *
 * Wrapper paikkaa fields.get(index):n, jota react-final-form-arrays ei tarjoa. Jos se
 * rakennetaan renderin sisällä, tyyppi on joka kerta uusi ja React purkaa koko
 * alipuun: lapsikentät unmounttaavat ja mounttaavat aina kun taulukko renderöityy.
 * Seurauksena rekisterikirjanpito hakkaa turhaan ja fokus katoaa kesken
 * kirjoittamisen.
 *
 * Testi mittaa mounttien määrän, ei renderöintien.
 */
test('FieldArray ei mounttaa lapsikenttiä uudelleen vanhemman renderöityessä', async () => {
  let leafMounts = 0;
  let rerenderParent: () => void = () => undefined;

  const Leaf = ({ input }: any) => {
    useEffect(() => {
      leafMounts += 1;
    }, []);
    return <input {...input} />;
  };

  const Rivit = ({ fields }: any) => (
    <>
      {fields.map((name: string) => (
        <Field key={name} name={`${name}.arvo`} component={Leaf} />
      ))}
    </>
  );

  const Harness = () => {
    const [, setTick] = useState(0);
    rerenderParent = () => setTick(t => t + 1);
    return <FieldArray name="rivit" component={Rivit} />;
  };

  render(
    <ReactFinalForm
      form="soraKuvaus"
      mode="edit"
      initialValues={{ rivit: [{ arvo: 'a' }] }}
    >
      <Harness />
    </ReactFinalForm>
  );

  await waitFor(() => {
    expect(leafMounts).toBe(1);
  });

  act(() => rerenderParent());
  act(() => rerenderParent());

  // Ilman muistettua wrapperia tämä on 3: yksi mount per vanhemman render.
  expect(leafMounts).toBe(1);
});

/**
 * fields.map antaa iteraattorille kolmantena argumenttina PAIKATUN olion.
 *
 * redux-form antoi kolmantena finalProps.fieldsin, jolla oli get.
 * react-final-form-arrays ei anna kolmatta argumenttia lainkaan, ja wrapper paikkaa
 * sen - mutta jos paikkaus antaa proxyn sijaan sen targetin, kolmas argumentti on
 * paikkaamaton olio ilman getiä. FieldArrayList välittää sen eteenpäin, ja
 * kutsupaikan tyyppi lupaa getin, joten kutsu läpäisisi tyyppitarkistuksen ja
 * heittäisi ajossa. Yksikään kutsupaikka ei lue sitä tänään, joten tämä testi on sen
 * ainoa vartija.
 */
test('fields.map antaa kolmantena argumenttina paikatun fields-olion', async () => {
  let kolmas: any = null;

  const Rivit = ({ fields }: any) => (
    <>
      {fields.map((name: string, index: number, f: any) => {
        kolmas = f;
        return (
          <Field key={name} name={`${name}.arvo`} component={TyhjaKentta} />
        );
      })}
    </>
  );

  render(
    <ReactFinalForm
      form="soraKuvaus"
      mode="edit"
      initialValues={{ rivit: [{ arvo: 'a' }] }}
    >
      <FieldArray name="rivit" component={Rivit} />
    </ReactFinalForm>
  );

  await waitFor(() => {
    expect(kolmas).not.toBeNull();
  });

  expect(kolmas.get(0)).toEqual({ arvo: 'a' });
});

/**
 * Taulukon oma tallennusvirhe näkyy FieldArrayn meta.errorissa.
 *
 * createErrorBuilder kirjoittaa taulukkovirheen redux-formin polkuun `${name}._error`.
 * final-form ei poimi sitä itse, joten ilman wrapperin siirtoa virhe katoaa hiljaa, eikä
 * käyttäjä näe miksi tallennus epäonnistui. Rivin lisäys piilottaa virheen.
 */
test('FieldArray näyttää taulukon tallennusvirheen kunnes taulukko muuttuu', async () => {
  let lastMeta: any = null;
  let lastFields: any = null;
  let submit: () => void = () => undefined;

  const Rivit = ({ fields, meta }: any) => {
    lastMeta = meta;
    lastFields = fields;
    return null;
  };

  const Tallennus = () => {
    submit = useSubmitForm();
    useRegisterSubmitHandler(
      useCallback(async () => ({ rivit: { _error: ['vähintään yksi'] } }), [])
    );
    return null;
  };

  render(
    <ReactFinalForm form="soraKuvaus" mode="edit" initialValues={{ rivit: [] }}>
      <Tallennus />
      <FieldArray name="rivit" component={Rivit} />
    </ReactFinalForm>
  );

  expect(lastMeta.error).toBeUndefined();

  await act(async () => submit());
  expect(lastMeta.error).toEqual(['vähintään yksi']);

  act(() => lastFields.push({ arvo: 'a' }));
  expect(lastMeta.error).toBeUndefined();
});

/**
 * Proxy sitoo metodit alkuperäiseen fields-olioon. Mutaattorit ovat metodeja, joten
 * väärä this rikkoisi ne kaikki kerralla.
 */
test('fields-proxyn mutaattorit muuttavat taulukkoa', async () => {
  let lastFields: any = null;

  const Rivit = ({ fields }: any) => {
    lastFields = fields;
    return null;
  };

  render(
    <ReactFinalForm
      form="soraKuvaus"
      mode="edit"
      initialValues={{ rivit: ['a', 'b'] }}
    >
      <FieldArray name="rivit" component={Rivit} />
    </ReactFinalForm>
  );

  act(() => lastFields.push('c'));
  expect(lastFields.value).toEqual(['a', 'b', 'c']);

  act(() => lastFields.swap(0, 2));
  expect(lastFields.value).toEqual(['c', 'b', 'a']);

  act(() => lastFields.remove(1));
  expect(lastFields.value).toEqual(['c', 'a']);
  expect(lastFields.get(1)).toBe('a');
  expect(lastFields.length).toBe(2);
});
