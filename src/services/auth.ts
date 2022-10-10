import { updateRole, updateUsername } from '@/slices/auth';
import { SystemUser } from '@/types/SystemUser';
import { baseApi } from './baseApi';

type WhoAmIResp = SystemUser;

type LoginResp = SystemUser;

type LoginArgs = {
  username: string;
  password: string;
  remember?: boolean;
};

type AllUsersResp = SystemUser[];

type CreateUserArgs = SystemUser & {
  password: string;
};

type DeleteUserArgs = Pick<SystemUser, 'username'>;

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    whoAmI: builder.query<WhoAmIResp, void>({
      query: () => ({
        url: '/whoami',
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUsername(data.username));
          dispatch(updateRole(data.role));
        } catch (e) {
          // Do nothing
        }
      },
    }),
    login: builder.mutation<LoginResp, LoginArgs>({
      query: (args) => ({
        url: '/login',
        method: 'POST',
        data: args,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUsername(data.username));
          dispatch(updateRole(data.role));
        } catch (e) {
          // Do nothing
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(updateUsername(null));
          dispatch(updateRole(null));
        } catch (e) {
          // Do nothing
        }
      },
    }),
    allUsers: builder.query<AllUsersResp, void>({
      query: () => ({
        url: '/all-users',
      }),
    }),
    createUser: builder.mutation<void, CreateUserArgs>({
      query: (args) => ({
        url: '/add-user',
        method: 'POST',
        data: args,
      }),
    }),
    deleteUser: builder.mutation<void, DeleteUserArgs>({
      query: (args) => ({
        url: '/delete-user',
        method: 'DELETE',
        params: args,
      }),
    }),
  }),
});

export const {
  useWhoAmIQuery,
  useLoginMutation,
  useLogoutMutation,
  useAllUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
} = authApi;
