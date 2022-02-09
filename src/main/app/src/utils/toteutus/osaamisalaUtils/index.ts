import _fp from 'lodash/fp';

export const getOsaamisalatWithError = (
  selectedOsaamisalat,
  osaamisalatFromEPeruste
) => {
  return _fp.map(({ koodiUri }) => koodiUri)(
    _fp.filter(selectedOsaamisala => {
      return !_fp.find(
        eperusteOsaamisala =>
          selectedOsaamisala.koodiUri === eperusteOsaamisala.uri
      )(osaamisalatFromEPeruste);
    })(selectedOsaamisalat)
  );
};

export const getSelectedOsaamisalatFromEPeruste = (
  selectedOsaamisalat,
  osaamisalatFromEPeruste
) => {
  return _fp.filter(selectedOsaamisala => {
    return _fp.find(
      eperusteOsaamisala =>
        selectedOsaamisala.koodiUri === eperusteOsaamisala.uri
    )(osaamisalatFromEPeruste);
  })(selectedOsaamisalat);
};
