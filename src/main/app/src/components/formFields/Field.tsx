import {
  Field as ReduxFormField,
  FieldArray as ReduxFormFieldArray,
  Fields as ReduxFormFields,
} from 'redux-form';

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
// Rekisteri ei vielä ohjaa mitään: providerin mounttaa vasta se commit, joka vaihtaa
// lomakekirjaston, joten toistaiseksi useFieldRegistration on no-op.
//
// eslint-sääntö no-restricted-imports estää redux-formin suoran tuonnin muualla; tämä tiedosto
// on sallittu poikkeus .eslintrc.js:n overrides-listalla.

// Kääreet tyypitetään alkuperäisiksi komponenteiksi (typeof ReduxFormField jne.), jotta
// kutsupaikkojen tyypit ja geneeriset parametrit säilyvät täsmälleen ennallaan. Ilman castia
// props-tyypiksi tulisi any, mikä hiljentäisi tarkistuksia 244 kutsupaikassa.

const FieldWithRegistration = (props: any) => {
  useFieldRegistration([props.name]);
  return <ReduxFormField {...props} />;
};

const FieldArrayWithRegistration = (props: any) => {
  useFieldRegistration([props.name]);
  return <ReduxFormFieldArray {...props} />;
};

// Monikkomuoto rekisteröi kaikki nimensä kerralla. Käytössä vain yhdessä paikassa
// (HakukohdeForm/LiitteetFields.tsx), mutta juuri siellä ohjataan lomakkeen mutkikkainta
// näytä/piilota-logiikkaa, joten sen jääminen rekisterin ulkopuolelle olisi pahin mahdollinen
// aukko.
const FieldsWithRegistration = (props: any) => {
  useFieldRegistration(props.names);
  return <ReduxFormFields {...props} />;
};

// Cast unknownin kautta, koska funktiokomponentti ei ole rakenteellisesti yhteensopiva
// luokkakomponentin konstruktorin kanssa. Kutsupaikkojen kannalta lopputulos on sama:
// props-tyypit ja geneeriset parametrit pysyvät ennallaan.
export const Field = FieldWithRegistration as unknown as typeof ReduxFormField;
export const FieldArray =
  FieldArrayWithRegistration as unknown as typeof ReduxFormFieldArray;
export const Fields =
  FieldsWithRegistration as unknown as typeof ReduxFormFields;

// export type on pakollinen, ei tyylivalinta: tsconfig.json asettaa isolatedModules: true,
// jolloin tyypin uudelleenvienti arvona on virhe.
export type { FieldArrayFieldsProps } from 'redux-form';
