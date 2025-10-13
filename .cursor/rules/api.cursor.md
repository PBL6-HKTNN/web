## Backend services

Backend calling service is the classic part in every web project. Follow the creation and implement flow:

1. Type defining: Define the req and res type first
2. Implement service: creating or implement func on existing service if related at `@services`, functional approaching and use `@utils/api.ts` for api client
3. Hook implementation for state handling: use `@tanstack/react-query` for creating service calling hooks using service
   + Ex: api hook for user: `user-hooks.ts`
     + example hooks: `useFetchUsers`, `useEditUser`,..., then perform non-default export for hooks file
