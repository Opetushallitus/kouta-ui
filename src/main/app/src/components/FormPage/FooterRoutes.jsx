import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { isValid } from 'redux-form';

import { submit as submitKoulutusForm } from '../../state/koulutusForm';
import { JULKAISUTILA } from '../../constants';
import Footer from './Footer';

const koulutusFormIsValid = isValid('koulutusForm');

const KoulutusFooter = connect(
  state => ({
    valid: koulutusFormIsValid(state),
  }),
  dispatch => ({
    onSave: () => {
      dispatch(submitKoulutusForm({ tila: JULKAISUTILA.TALLENNETTU }));
    },
    onSaveAndPublish: () => {
      dispatch(submitKoulutusForm({ tila: JULKAISUTILA.JULKAISTU }));
    },
  }),
)(Footer);

const FooterRoutes = () => (
  <Switch>
    <Route path="/koulutus" component={KoulutusFooter} />
  </Switch>
);

export default FooterRoutes;
