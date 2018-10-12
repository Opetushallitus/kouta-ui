import {LANGUAGE} from '../config/constants';

/*const jsonDataExample = {
  "data": [
    {
      "kuvaus": {
        "fi": "Sosiaali- ja terveysalan perustutkinnon suorittanut on lähihoitajaosaamiseen. Tutkinnon\nsuorittanut edistää asiakkaan...",
        "sv": "Den som har avlagt grundexamen inom social- och hälsovårdsbranschen blir närvårdare. Examen ger kompetens för...",
      }
    }
  ]
};
*/

export const extractKoulutuksenKuvaus = (jsonData) =>
    ((k) => k.data || [])(jsonData)
    .slice(0, 1)
    .map((entry) => entry.kuvaus && entry.kuvaus[LANGUAGE.toLowerCase()]).join('');
