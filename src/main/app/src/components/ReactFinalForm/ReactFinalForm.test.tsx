import React, { useEffect, useState } from 'react';

import { act, render, waitFor } from '@testing-library/react';

import { Field, FieldArray } from '#/src/components/formFields/Field';
import { ReactFinalForm } from '#/src/components/ReactFinalForm';
import { useForm } from '#/src/hooks/form';

/**
 * Footerit lukevat kenttäjoukon VASTA tallennushetkellä, vaikka ne ottavat
 * form-olion talteen renderissä:
 *
 *   const form = useForm();                 // renderissä
 *   ...
 *   getValuesForSaving(values, form.registeredFields, ...)   // klikkauksessa
 *
 * Kenttärekisteri elää refeissä eikä FieldRegistryProvider renderöi uudelleen
 * kenttien mountatessa. Jos sovitin ottaisi joukosta tilannekuvan renderin aikana,
 * talteen otettu form jäisi tyhjäksi. Getterinä se evaluoituu lukuhetkellä.
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

  // Luetaan vasta nyt, mountin jälkeen - kuten tallennus tekee. waitForilla,
  // koska rekisteröinti tapahtuu efektissä eikä sen ajoitukseen renderin jälkeen
  // pidä nojata. Tuotannossa vastaava luku tapahtuu klikkauksesta, siis
  // väistämättä efektien jälkeen.
  //
  // Tämä ei heikennä erottelukykyä: tilannekuvaversiossa talteen otettu joukko on
  // jäätynyt tyhjäksi eikä täyty odottamallakaan.
  await waitFor(() => {
    expect(Object.keys(capturedForm.registeredFields).sort()).toEqual([
      'nimi.fi',
      'tila',
    ]);
  });
});

/**
 * FieldArray-kääre ei saa luoda uutta komponenttityyppiä joka renderillä.
 *
 * Kääre paikkaa fields.get(index):n, jota react-final-form-arrays ei tarjoa. Jos se
 * rakennetaan renderin sisällä, tyyppi on joka kerta uusi ja React purkaa koko
 * alipuun: jokainen taulukon lapsikenttä unmounttaa ja mounttaa uudelleen aina kun
 * taulukko renderöityy.
 *
 * Kaksi seurausta. Rekisterikirjanpito hakkaa turhaan - unregister -> register
 * jokaiselle lapsikentälle joka renderillä - eli juuri sitä mekanismia, jonka varassa
 * tallennuksen näkyvyyssääntö on. Ja fokus katoaa kesken kirjoittamisen, koska
 * näppäinpainallus muuttaa taulukon arvoa, mikä laukaisee renderin.
 *
 * Testi mittaa mounttien määrän, ei renderöintien: uudelleenrenderöinti on normaalia,
 * uudelleenmounttaus ei.
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

  // Ilman muistettua kääreä tämä on 3: yksi mount per vanhemman render.
  expect(leafMounts).toBe(1);
});
