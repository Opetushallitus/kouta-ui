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
  kielivalikoima,
  kieletFromKoodisto,
  oppiaineetOptions
) => {
  const kielivalikoimaWithNewLabels = [];

  for (const kieli in kielivalikoima) {
    const kielet = kielivalikoima[kieli];

    for (const k of kielet) {
      const foundKieli = kieletFromKoodisto.find(koodistoKieli => {
        return k === koodistoKieli.value;
      });

      const kieliPrefix = kieli.match(/^[A-Z]\d/g);

      if (foundKieli && kieliPrefix) {
        const kieliLabel = `${kieliPrefix} ${foundKieli.label}`;
        const oppiaine = oppiaineetOptions.find(oppiaine => {
          const re = new RegExp(`\\w+_${kieliPrefix[0].toLowerCase()}`, 'g');
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
  }

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
  if (kieli) {
    return `${oppiaine}/${kieli}`;
  } else {
    return `${oppiaine}`;
  }
};
