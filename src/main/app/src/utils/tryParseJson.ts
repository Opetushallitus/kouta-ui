const tryParseJson = (userdata, defaultValue = null) => {
  try {
    let userroles: Array<string> = [];

    userdata.organisaatiot.forEach(organisaatio => {
      organisaatio.kayttooikeudet.forEach(kayttooikeus => {
        let newuserrole = 'APP_' + kayttooikeus.palvelu;
        if (userroles.indexOf(newuserrole) === -1) {
          userroles.push(newuserrole);
        }
        newuserrole += '_' + kayttooikeus.oikeus;
        if (userroles.indexOf(newuserrole) === -1) {
          userroles.push(newuserrole);
        }
        newuserrole += '_' + organisaatio.organisaatioOid;
        if (userroles.indexOf(newuserrole) === -1) {
          userroles.push(newuserrole);
        }
      });
    });

    return userroles;
  } catch (e) {
    return defaultValue;
  }
};

export default tryParseJson;
