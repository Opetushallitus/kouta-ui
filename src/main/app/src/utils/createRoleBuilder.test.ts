import createRoleBuilder from './createRoleBuilder';

const makeOrganisaatio = (parentOids: Array<string>) => ({
  parentOids: parentOids,
});

test('hasRead works correctly', () => {
  const rb1 = createRoleBuilder({
    roles: ['TEST_READ_1.1.1', 'TEST_READ_1.1.2'],
  });

  expect(rb1.hasRead('TEST', makeOrganisaatio(['1.1.1'])).result()).toBe(true);
  expect(rb1.hasRead('TEST', makeOrganisaatio(['1.1.3'])).result()).toBe(false);
});

test('hasUpdate works correctly', () => {
  const rb1 = createRoleBuilder({
    roles: ['TEST_UPDATE_1.1.1', 'TEST_UPDATE_1.1.2'],
  });

  expect(rb1.hasUpdate('TEST', makeOrganisaatio(['1.1.1'])).result()).toBe(
    true
  );
  expect(rb1.hasUpdate('TEST', makeOrganisaatio(['1.1.3'])).result()).toBe(
    false
  );
});

test('hasCreate works correctly', () => {
  const rb1 = createRoleBuilder({
    roles: ['TEST_CRUD_1.1.1', 'TEST_CRUD_1.1.2'],
  });

  expect(rb1.hasCreate('TEST', makeOrganisaatio(['1.1.1'])).result()).toBe(
    true
  );
  expect(rb1.hasCreate('TEST', makeOrganisaatio(['1.1.3'])).result()).toBe(
    false
  );
});
