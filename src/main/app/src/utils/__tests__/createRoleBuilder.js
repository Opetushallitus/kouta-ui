import createRoleBuilder from '../createRoleBuilder';

const makeOrganisaatio = path => ({ parentOidPath: path.join('/') });

test('hasRead works correctly', () => {
  const rb1 = createRoleBuilder({
    roles: ['TEST_READ_1.1.1', 'TEST_READ_1.1.2'],
  });

  expect(rb1.hasRead('TEST', makeOrganisaatio(['1.1.1'])).result()).toBe(true);
  expect(rb1.hasRead('TEST', makeOrganisaatio(['1.1.3'])).result()).toBe(false);
});

test('hasReadOneOf works correctly', () => {
  const rb1 = createRoleBuilder({
    roles: ['TEST_READ_1.1.1', 'TEST_READ_1.1.2'],
  });

  expect(
    rb1.hasReadOneOf(['TEST', 'TEST2'], makeOrganisaatio(['1.1.1'])).result(),
  ).toBe(true);
  expect(
    rb1.hasReadOneOf(['TEST2', 'TEST3'], makeOrganisaatio(['1.1.3'])).result(),
  ).toBe(false);
});

test('hasReadAll works correctly', () => {
  const rb1 = createRoleBuilder({
    roles: ['TEST_READ_1.1.1', 'TEST2_READ_1.1.1'],
  });

  expect(
    rb1.hasReadAll(['TEST', 'TEST2'], makeOrganisaatio(['1.1.1'])).result(),
  ).toBe(true);
  expect(
    rb1.hasReadAll(['TEST2', 'TEST3'], makeOrganisaatio(['1.1.3'])).result(),
  ).toBe(false);
});

test('hasWrite works correctly', () => {
  const rb1 = createRoleBuilder({
    roles: ['TEST_WRITE_1.1.1', 'TEST_WRITE_1.1.2'],
  });

  expect(rb1.hasWrite('TEST', makeOrganisaatio(['1.1.1'])).result()).toBe(true);
  expect(rb1.hasWrite('TEST', makeOrganisaatio(['1.1.3'])).result()).toBe(
    false,
  );
});

test('hasWriteOneOf works correctly', () => {
  const rb1 = createRoleBuilder({
    roles: ['TEST_WRITE_1.1.1', 'TEST_WRITE_1.1.2'],
  });

  expect(
    rb1.hasWriteOneOf(['TEST', 'TEST2'], makeOrganisaatio(['1.1.1'])).result(),
  ).toBe(true);
  expect(
    rb1.hasWriteOneOf(['TEST2', 'TEST3'], makeOrganisaatio(['1.1.3'])).result(),
  ).toBe(false);
});

test('hasWriteAll works correctly', () => {
  const rb1 = createRoleBuilder({
    roles: ['TEST_WRITE_1.1.1', 'TEST2_WRITE_1.1.1'],
  });

  expect(
    rb1.hasWriteAll(['TEST', 'TEST2'], makeOrganisaatio(['1.1.1'])).result(),
  ).toBe(true);
  expect(
    rb1.hasWriteAll(['TEST2', 'TEST3'], makeOrganisaatio(['1.1.3'])).result(),
  ).toBe(false);
});

test('hasCrudOneOf works correctly', () => {
  const rb1 = createRoleBuilder({
    roles: ['TEST_CRUD_1.1.1', 'TEST_CRUD_1.1.2'],
  });

  expect(
    rb1.hasCrudOneOf(['TEST', 'TEST2'], makeOrganisaatio(['1.1.1'])).result(),
  ).toBe(true);
  expect(
    rb1.hasCrudOneOf(['TEST2', 'TEST3'], makeOrganisaatio(['1.1.3'])).result(),
  ).toBe(false);
});

test('hasCrudAll works correctly', () => {
  const rb1 = createRoleBuilder({
    roles: ['TEST_CRUD_1.1.1', 'TEST2_CRUD_1.1.1'],
  });

  expect(
    rb1.hasCrudAll(['TEST', 'TEST2'], makeOrganisaatio(['1.1.1'])).result(),
  ).toBe(true);
  expect(
    rb1.hasCrudAll(['TEST2', 'TEST3'], makeOrganisaatio(['1.1.3'])).result(),
  ).toBe(false);
});
