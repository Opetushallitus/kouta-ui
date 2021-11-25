import {
  createHakukohdeForm,
  createHakukohdeFormAsOppilaitosUser,
} from './hakukohdeForm/createHakukohdeForm';
import { editHakukohdeForm } from './hakukohdeForm/editHakukohde';

describe('createHakukohde', createHakukohdeForm);
describe(
  'createHakukohdeAsOppilaitosUser',
  createHakukohdeFormAsOppilaitosUser
);
describe('editHakukohde', editHakukohdeForm);
