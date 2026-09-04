// Tämän moduulin kautta kulkevat kaikki sovelluksen Field-, FieldArray- ja Fields-tuonnit.
// Tarkoitus on koota redux-formin kenttäkomponentit yhteen paikkaan ennen kuin lomakekirjasto
// vaihdetaan react-final-formiin. Vaihdon jälkeen kouta ei voi enää lukea redux-formin storesta,
// mitkä kentät ovat olleet näkyvissä (unregisteredFields), joten se tieto pitää kerätä itse.
// Keräys tehdään myöhemmin tässä moduulissa: kun jokainen kenttä kulkee tästä läpi, rekisteröinti
// voidaan hoitaa yhdessä paikassa ilman että kutsupaikkoja tarvitsee muuttaa uudestaan.
//
// Tässä vaiheessa moduuli on pelkkä uudelleenvienti: komponentit ovat samat oliot kuin ennenkin,
// joten ajonaikainen käyttäytyminen ei muutu lainkaan. Se on tarkoituksellista — muutoksen
// harmittomuus on todennettavissa sillä, ettei yksikään snapshot muutu.
//
// eslint-sääntö no-restricted-imports estää redux-formin suoran tuonnin muualla; tämä tiedosto
// on sallittu poikkeus .eslintrc.js:n overrides-listalla.
export { Field, FieldArray, Fields } from 'redux-form';

// export type on pakollinen, ei tyylivalinta: tsconfig.json asettaa isolatedModules: true,
// jolloin tyypin uudelleenvienti arvona on virhe.
export type { FieldArrayFieldsProps } from 'redux-form';
