import { create } from "zustand";

export interface Operation {
    name: string;
}

export interface Feature {
    featureName: string;
    operations: Operation[];
}

export interface Role {
    id: string;
    roleCode: string;
    roleName: string;
    roleDescription: string;
    features: Feature[];
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    mobileNumber: string;
    token: string;
    roles: Role[];
}

export interface UserStore {
    user: User | null;
    isAuthenticated: boolean;

    setUser: (data: User) => void;
    logout: () => void;

    hasRole: (roleCode: string) => boolean;
    hasFeature: (featureName: string) => boolean;
    hasOperation: (featureName: string, operationName: string) => boolean;
}

export const useUserStore = create<UserStore>((set, get) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) =>
        set({
            user,
            isAuthenticated: true,
        }),

    logout: () =>
        set({
            user: null,
            isAuthenticated: false,
        }),

    hasRole: (roleCode) => {
        const user = get().user;
        return user?.roles?.some((role) => role.roleCode === roleCode) ?? false;
    },

    hasFeature: (featureName) => {
        const user = get().user;

        return (
            user?.roles?.some((role) =>
                role.features?.some((feature) => feature.featureName === featureName)
            ) ?? false
        );
    },

    hasOperation: (featureName, operationName) => {
        const user = get().user;

        return (
            user?.roles?.some((role) =>
                role.features?.some(
                    (f) =>
                        f.featureName === featureName &&
                        f.operations?.some((op) => op.name === operationName)
                )
            ) ?? false
        );
    },
}));

/*
HOW TO USE THIS STORE (Documentation):

1.Set user after login
  import { useUserStore } from "@/store/user.store";
  const response = await loginApi();
  useUserStore.getState().setUser(response.data);

2.Get logged-in user
  const user = useUserStore((s) => s.user);

3.Check if authenticated
  const isAuth = useUserStore((s) => s.isAuthenticated);

4.Logout user
  useUserStore.getState().logout();

5.Check ROLE
  const isAdmin = useUserStore((s) => s.hasRole("SUPER_ADMIN"));
  if (isAdmin) {
    console.log("User is Super Admin");
  }

6.Check FEATURE
  const canAccessInventory = useUserStore((s) =>
    s.hasFeature("INVENTORY")
  );

7.Check OPERATION
  const canCreateItem = useUserStore((s) =>
    s.hasOperation("INVENTORY", "CREATE")
  );
*/
