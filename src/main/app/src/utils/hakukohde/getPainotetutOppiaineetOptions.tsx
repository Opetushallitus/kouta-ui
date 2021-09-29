import _ from 'lodash';

export const getPainotetutOppiaineetOptions = (
  oppiaineetOptions,
  kieliOptions,
  lukionKielivalikoima
) => {
  const lukionKielet = getKieletForOppiainevalikoima(
    lukionKielivalikoima,
    kieliOptions,
    oppiaineetOptions
  );

  const oppiaineetWithoutKielet =
    removeKieletFromKoodistoOppiaineet(oppiaineetOptions);
  return [...lukionKielet, ...oppiaineetWithoutKielet];
};

export const getKieletForOppiainevalikoima = (
  lukionKielivalikoima,
  kieletFromKoodisto,
  oppiaineetOptions
) => {
  const kielivalikoimaWithNewLabels = [];

  _.forEach(lukionKielivalikoima, (kieletInKieliTaso, kieliTaso) => {
    for (const kieli of kieletInKieliTaso) {
      const foundKieli = kieletFromKoodisto.find(koodistoKieli => {
        return kieli === koodistoKieli.value;
      });

      const kieliPrefix = kieliTaso.match(/^[A-C]\d/g); // E.g. A1, B3...

      if (foundKieli && kieliPrefix) {
        const kieliLabel = `${kieliPrefix} ${foundKieli.label}`; // E.g. "A1 englanti"
        const oppiaine = oppiaineetOptions.find(oppiaine => {
          const re = new RegExp(`\\w+_${kieliPrefix[0].toLowerCase()}`, 'g');
          // E.g. "oppiaineetyleissivistava_a1"
          return oppiaine.value.match(re);
        });

        if (oppiaine) {
          kielivalikoimaWithNewLabels.push({
            value: concatKoodiUris(oppiaine.value, foundKieli.value),
            koodiUrit: {
              oppiaine: oppiaine.value,
              kieli: foundKieli.value,
            },
            label: kieliLabel,
          });
        }
      }
    }
  });

  return kielivalikoimaWithNewLabels;
};

export const removeKieletFromKoodistoOppiaineet = oppiaineet => {
  return oppiaineet
    .filter(oppiaine => !oppiaine.label.match(/^[A-Z]\d-/))
    .map(oppiaine => {
      return {
        ...oppiaine,
        value: concatKoodiUris(oppiaine.value),
        koodiUrit: {
          oppiaine: oppiaine.value,
        },
      };
    });
};

export const concatKoodiUris = (oppiaine, kieli) => {
  return kieli ? `${oppiaine}/${kieli}` : `${oppiaine}`;
};
