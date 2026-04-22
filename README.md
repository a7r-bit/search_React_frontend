# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

Куда что класть
src/components/ui

Базовые переиспользуемые кирпичики без бизнес-логики.
Примеры: Button, Input, Card, Modal, Badge, PageContainer.
src/components/layout

Каркас страницы/приложения.
Примеры: AppShell, Header, Sidebar, Footer, PageLayout.
src/components/features

Доменные/страничные блоки с контекстом фичи.
Примеры: HomeHero, SearchFilters, ProductList, ProfileSummary.
src/routes

Роут-модули React Router: страница + loader/action/error boundary.
Пример: home-route.tsx использует компоненты из features/layout/ui.
src/store

Redux slices, selectors, listener middleware (клиентское состояние).
src/api

API слой: client.ts, base-api.ts, generated/*, model/* (Zod схемы).
src/hooks

Общие кастомные хуки (не endpoint-хуки RTK Query).
Примеры: useTheme, useDebounce, useIsMobile.
src/lib

Утилиты/хелперы без React.
Примеры: форматтеры, валидаторы, date-fns helpers.
src/types

Общие типы, которые не относятся к API генерации.
src/app

Склейка приложения: провайдеры, store setup, глобальная инициализация.
Как мыслить при “дизайн-проекте страницы”
Страница (route): в src/routes
Каркас страницы: в src/components/layout
Секции страницы (hero, filters, results): в src/components/features
Мелкие универсальные элементы: в src/components/ui
Данные: src/api + src/store
Тема/глобальные стили: src/index.css + src/hooks/use-theme.tsx
