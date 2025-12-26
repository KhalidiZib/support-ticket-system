export const ROLE_ADMIN = "ADMIN";
export const ROLE_AGENT = "AGENT";
export const ROLE_CUSTOMER = "CUSTOMER";

export function hasRole(user, roles) {
  if (!user) return false;
  const list = Array.isArray(roles) ? roles : [roles];
  return list.includes(user.role);
}
