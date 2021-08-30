export const getPainotetutOppiaineetOptions = (
  options,
  kieliOptions,
  lukionKielivalikoima
) => {
  const lukionKielet = getKieletForOppiainevalikoima(
    lukionKielivalikoima,
    kieliOptions
  );

  const oppiaineetWithoutKielet = removeKieletFromKoodistoOppiaineet(options);
  return [...lukionKielet, ...oppiaineetWithoutKielet];
};

export const getKieletForOppiainevalikoima = (
  kielivalikoima,
  kieletFromKoodisto
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
        const kieliLabel = kieliPrefix
          ? `${kieliPrefix} ${foundKieli.label}`
          : foundKieli.label;
        kielivalikoimaWithNewLabels.push({
          ...foundKieli,
          label: kieliLabel,
        });
      }
    }
  }

  return kielivalikoimaWithNewLabels;
};

export const removeKieletFromKoodistoOppiaineet = oppiaineet => {
  return oppiaineet.filter(oppiaine => !oppiaine.label.match(/-kieli/));
};
