export type UserRole = {
  id: string;
  roleCode: string;
  roleName: string;
  roleDescription?: string;
};

export type UserDTO = {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  roles: UserRole[];
};

