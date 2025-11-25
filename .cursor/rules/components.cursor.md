## Components

**File structure**

- `@components/layout`: for page layout components defining (nav, sidebar,...)
- `@components/ui`: primitive components using shadcn library
- `@components/shared`: components that are used across the modules, pages
- `@components/<module>`: defined components for specific module (ex: `@components/user` for user module)

**Components creation rules**

Each component creation will follow these rules:

- Component will be created under the format:
  + `component-name/index.tsx`: Render file
  + `component-name/hooks.tsx`: For logic, state and handler, then import it from render file
- If number of states and handlers is under 3, you can write directly in `component-name/index.tsx`
