const tryParseJson = (userdata, defaultValue = null) => {
  try {
    let userroles: Array<string> = [];

    const roles: Set<string> = new Set();
    userdata.organisaatiot.forEach(({ organisaatioOid, kayttooikeudet }) => {
      kayttooikeudet.forEach(({ palvelu, oikeus }) => {
        roles.add(`APP_${palvelu}`);
        roles.add(`APP_${palvelu}_${oikeus}`);
        roles.add(`APP_${palvelu}_${oikeus}_${organisaatioOid}`);
      });
    });

    return Array.from(roles);
    });

    return userroles;
  } catch (e) {
    return defaultValue;
  }
};

export default tryParseJson;
