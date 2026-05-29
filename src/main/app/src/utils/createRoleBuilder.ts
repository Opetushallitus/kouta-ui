import _ from 'lodash';

import { OPH_PAAKAYTTAJA_ROLE } from '#/src/constants';
import { OrganisaatioModel } from '#/src/types/domainTypes';

import getRoleOrganisaatioOid from './getRoleOrganisaatioOid';
import isOid from './isOid';

const READ_ROLES = ['READ', 'READ_UPDATE', 'CRUD'];
const UPDATE_ROLES = ['UPDATE', 'READ_UPDATE', 'CRUD'];
const CREATE_ROLES = ['CRUD'];

type RoleLookup = Record<string, Record<string, boolean>>;
type OrganisaatioOrOids =
  | OrganisaatioModel
  | Array<string>
  | string
  | undefined;
type CheckFn = (role: string, organisaatio: OrganisaatioOrOids) => RoleBuilder;
type GetCheckFn = (rb: RoleBuilder) => CheckFn;

type RoleBuilderOptions = {
  roles?: Array<string>;
  roleLookup?: RoleLookup;
  result?: boolean;
};

const getRoleName = (role: string): string | undefined => {
  if (!_.isString(role)) {
    return undefined;
  }

  const parts = role.split('_');

  return parts.filter(v => !isOid(v)).join('_');
};

const createRoleLookup = (roles: Array<string>): RoleLookup => {
  const lookup: RoleLookup = {};

  for (const role of roles) {
    const organisaatioOid = getRoleOrganisaatioOid(role);

    if (!organisaatioOid) {
      continue;
    }

    const roleName = getRoleName(role);

    if (!roleName) {
      continue;
    }

    _.set(lookup, [organisaatioOid, roleName], true);
  }

  return lookup;
};

const getParentAndSelfOids = (
  organisaatioOrOids: OrganisaatioOrOids
): Array<string> => {
  if (_.isString(organisaatioOrOids)) {
    return [organisaatioOrOids];
  }

  if (_.isArray(organisaatioOrOids)) {
    return organisaatioOrOids;
  }

  const parentOids = organisaatioOrOids?.parentOids ?? [];
  const organisaatioOid = organisaatioOrOids?.oid;
  const parentsAndSelf = _.isEmpty(parentOids)
    ? [organisaatioOid]
    : [...parentOids, organisaatioOid];

  return parentsAndSelf.filter((v): v is string => Boolean(v));
};

class RoleBuilder {
  currentResult: boolean;
  roleLookup: RoleLookup;

  constructor({
    roles = [],
    roleLookup,
    result = true,
  }: RoleBuilderOptions = {}) {
    this.currentResult = result;
    this.roleLookup = roleLookup ?? createRoleLookup(roles);
  }

  hasOneOfFn(
    getCheckFn: GetCheckFn,
    roles: Array<string>,
    organisaatio: OrganisaatioOrOids
  ): RoleBuilder {
    return roles.reduce((acc, curr) => {
      return acc.or(rb => getCheckFn(rb)(curr, organisaatio));
    }, this.clone(false));
  }

  hasAllFn(
    getCheckFn: GetCheckFn,
    roles: Array<string>,
    organisaatio: OrganisaatioOrOids
  ): RoleBuilder {
    return roles.reduce((acc, curr) => {
      return acc.and(rb => getCheckFn(rb)(curr, organisaatio));
    }, this.clone(true));
  }

  hasOrganisaatioRole(role: string, organisaatioOid: string): boolean {
    return Boolean(this.roleLookup?.[organisaatioOid]?.[role]);
  }

  hasRead(role: string, organisaatio: OrganisaatioOrOids): RoleBuilder {
    return this.clone(
      getParentAndSelfOids(organisaatio).some(oid => {
        return (
          this.hasOrganisaatioRole(OPH_PAAKAYTTAJA_ROLE, oid) ||
          READ_ROLES.some(r => this.hasOrganisaatioRole(`${role}_${r}`, oid))
        );
      })
    );
  }

  hasReadOneOf(
    roles: Array<string>,
    organisaatio: OrganisaatioOrOids
  ): RoleBuilder {
    return this.hasOneOfFn(
      rb =>
        (...args) =>
          rb.hasRead(...args),
      roles,
      organisaatio
    );
  }

  hasReadAll(
    roles: Array<string>,
    organisaatio: OrganisaatioOrOids
  ): RoleBuilder {
    return this.hasAllFn(
      rb =>
        (...args) =>
          rb.hasRead(...args),
      roles,
      organisaatio
    );
  }

  hasUpdate(role: string, organisaatio: OrganisaatioOrOids): RoleBuilder {
    return this.clone(
      getParentAndSelfOids(organisaatio).some(oid => {
        return (
          this.hasOrganisaatioRole(OPH_PAAKAYTTAJA_ROLE, oid) ||
          UPDATE_ROLES.some(r => this.hasOrganisaatioRole(`${role}_${r}`, oid))
        );
      })
    );
  }

  hasUpdateOneOf(
    roles: Array<string>,
    organisaatio: OrganisaatioOrOids
  ): RoleBuilder {
    return this.hasOneOfFn(
      rb =>
        (...args) =>
          rb.hasUpdate(...args),
      roles,
      organisaatio
    );
  }

  hasUpdateAll(
    roles: Array<string>,
    organisaatio: OrganisaatioOrOids
  ): RoleBuilder {
    return this.hasAllFn(
      rb =>
        (...args) =>
          rb.hasUpdate(...args),
      roles,
      organisaatio
    );
  }

  hasCreate(role: string, organisaatio: OrganisaatioOrOids): RoleBuilder {
    return this.clone(
      getParentAndSelfOids(organisaatio).some(oid => {
        return (
          this.hasOrganisaatioRole(OPH_PAAKAYTTAJA_ROLE, oid) ||
          CREATE_ROLES.some(r => this.hasOrganisaatioRole(`${role}_${r}`, oid))
        );
      })
    );
  }

  hasCreateOneOf(
    roles: Array<string>,
    organisaatio: OrganisaatioOrOids
  ): RoleBuilder {
    return this.hasOneOfFn(
      rb =>
        (...args) =>
          rb.hasCreate(...args),
      roles,
      organisaatio
    );
  }

  hasCreateAll(
    roles: Array<string>,
    organisaatio: OrganisaatioOrOids
  ): RoleBuilder {
    return this.hasAllFn(
      rb =>
        (...args) =>
          rb.hasCreate(...args),
      roles,
      organisaatio
    );
  }

  clone(result?: boolean): RoleBuilder {
    return new RoleBuilder({
      roleLookup: this.roleLookup,
      result,
    });
  }

  or(fn: (rb: RoleBuilder) => RoleBuilder): RoleBuilder {
    return this.clone(this.result() || fn(this.clone()).result());
  }

  and(fn: (rb: RoleBuilder) => RoleBuilder): RoleBuilder {
    return this.clone(this.result() && fn(this.clone()).result());
  }

  result(): boolean {
    return this.currentResult;
  }
}

const createRoleBuilder = (args?: RoleBuilderOptions): RoleBuilder =>
  new RoleBuilder(args);

export default createRoleBuilder;
