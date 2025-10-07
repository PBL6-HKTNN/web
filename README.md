# CodeMy Web

A modern React application built with TypeScript, Vite, and TanStack Router for learning and development purposes.

## 🚀 Features

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety and better developer experience
- **TanStack Router** - File-based routing with type-safe navigation
- **TanStack Query** - Powerful data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting and formatting
- **Husky + Commitlint** - Git hooks for code quality
- **Path Aliases** - Clean import statements

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components
│   ├── shared/         # Shared components
│   └── ui/            # UI components
├── hooks/              # Custom React hooks
│   ├── queries/       # Query-related hooks
│   └── use-persistance.ts
├── routes/             # File-based routes (TanStack Router)
│   ├── __root.tsx   # Root layout
│   ├── index.tsx      # Home page (/)
│   ├── about.tsx      # About page (/about)
│   ├── contact.tsx    # Contact page (/contact)
│   └── users/         # User-related routes
│       ├── index.tsx  # Users list (/users)
│       ├── $userId.tsx # User profile (/users/:userId)
│       └── route.tsx # /users layout file
├── services/           # API services and external integrations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   └── persistance.ts
├── contexts/           # React contexts
├── conf/               # Configuration files
├── router.tsx          # Router configuration
├── main.tsx           # Application entry point
└── App.tsx            # Main app component

docs/                   # Documentation
├── TANSTACK_FILEBASED_ROUTING.md
```

## 🛠️ Tech Stack

### Core Framework

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### Routing & Data

- **TanStack Router** - File-based routing
- **TanStack Query** - Data fetching and caching
- **Axios** - HTTP client

### Styling

- **Tailwind CSS** - Utility-first CSS

### Development Tools

- **ESLint** - Code linting
- **Husky** - Git hooks
- **Commitlint** - Commit message linting

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.18.3 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd codemy-web
```

2. Install dependencies

```bash
npm install
npm run prepare
```

3. Start the development server

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint

# Git Hooks (auto-setup)
npm run prepare      # Setup Husky hooks
```

## 🗂️ Routing

This project uses **TanStack Router** with file-based routing. Routes are automatically generated from files in the `src/routes/` directory.

### Route Examples

- `src/routes/index.tsx` → `/` (Home)
- `src/routes/about.tsx` → `/about`
- `src/routes/users/$userId.tsx` → `/users/:userId` (Dynamic route)

### Route Features

- **Type-safe navigation** - Full TypeScript support
- **Dynamic routes** - URL parameters with `$param` syntax
- **Nested routes** - Folder-based organization
- **Route loaders** - Data fetching before render
- **Route actions** - Form handling and mutations
- **Automatic code splitting** - Performance optimization

For detailed routing documentation, see [`docs/TANSTACK_FILEBASED_ROUTING.md`](./docs/TANSTACK_FILEBASED_ROUTING.md).

## 🎨 Styling

The project uses **Tailwind CSS** for styling with a utility-first approach.

### Key Classes Used

- Responsive design with `sm:`, `md:`, `lg:` prefixes
- Flexbox utilities: `flex`, `items-center`, `justify-center`
- Spacing: `p-8`, `m-4`, `space-x-4`
- Colors: `bg-indigo-500`, `text-gray-900`
- Shadows: `shadow-md`, `shadow-lg`

## 🔧 Development

### Code Quality

The project enforces code quality through:

- **ESLint** - Catches potential bugs and enforces style
- **TypeScript** - Strict type checking
- **Pre-commit hooks** - Automatic linting before commits
- **Commit message linting** - Conventional commit format

### Git Hooks & Commit Convention

This project uses [Husky](https://typicode.github.io/husky/) for Git hooks and [Commitlint](https://commitlint.js.org/) to enforce conventional commit messages.

#### Pre-commit Hook

- Runs ESLint on staged files before each commit

#### Commit Message Linting

- Enforces conventional commit format
- Supported commit types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`

#### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

#### Examples

```
feat: add user authentication
fix: resolve memory leak in component
docs: update API documentation
style: format code with prettier
refactor: simplify component logic
```

### Path Aliases

Clean import statements using path aliases:

```typescript
// Instead of relative paths
import Component from '../../../components/ui/Button'

// Use aliases
import Component from '@/components/ui/Button'
import { usePersistance } from '@/hooks/use-persistance'
import { apiClient } from '@/services/api'
```

Available aliases:

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@hooks/*` → `src/hooks/*`
- `@utils/*` → `src/utils/*`
- `@types/*` → `src/types/*`
- `@routes/*` → `src/routes/*`
- `@conf/*` → `src/conf/*`

## 📚 Documentation

- [TanStack Router Guide](./docs/TANSTACK_FILEBASED_ROUTING.md) - Complete routing documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Guidelines

Please follow conventional commit format. The pre-commit hooks will enforce this automatically.

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using React, TypeScript, and modern web technologies.
