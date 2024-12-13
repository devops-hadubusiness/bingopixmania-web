# Techs Stack:
  - This document describes the project structure, patterns, all main packages and yours respective essential and configuration files. Please follow the instructions.

## React + Vite
  - Essential files: 
    - package.json
    - vite.config.ts
    - tsconfig.json
    - tsconfig.app.json
    - tsconfig.node.json
    - .prettierrc
    - eslint.config.js
    - .gitignore
    - /src/vite-env.d.ts

## TailwindCSS
  - Essential files:
    - tailwind.config.ts
    - postcss.config.js

## Shadcn/UI
  - Essential files:
    - components.json

## Add-ons (for development and code patterns/cleaning purposes): 
  - eslint: config file on **~/config/eslint.config.js**
  - prettier: config file on **~/config/.prettierrc**
  - .env (**required**): on **~/env**
  - **OBS**: if you have some linter/formatter extension, please check **~/extensions** folder


## Running on Localhost:
**OBS**: make sure your terminal is on project root folder
- development/localhost: yarn dev
- ...More on **package.json** file

**Docker** (optional):
- Comming soon

## Deployment:
**OBS**: please read the **INFRA.md** file
1. make sure your **.env** target file is on project's root folder
2. configure/check the credentials inside **~/scripts/deploy-[STAGE].sh** target file
3. run `yarn deploy:[STAGE]`

## Folders Structure:
- ~/
    - /dist (**dynamic**)
    - /env
        - .env.dev
        - .env.example (raw file without values, only keys)
        - .env.hml
        - .env.prod
    - /node_modules
    - /public (referenced by relative path **/**)
        - /fonts
        - /icons
        - /images
        - ...
    - /scripts
        - deploy-[STAGE].sh
        - ...
    - /src (referenced by alias, defaults to **@/**, but please check the **vite.config.ts** file)
        - /auth
        - /components
        - /constants
        - /contexts
        - /entities
        - /hooks
        - /lib
        - /pages
        - /store
        - /styles
        - /types
        - /utils
        - App.tsx
        - index.css
        - main.tsx
        - vite-env.d.ts

## Useful Links:
- Figma: https://www.figma.com/design/YKHDy1sj96DYS3R5v6BGNh/Bingo-Pix-Mania
- Trello: https://trello.com/b/kCZcllqK/bingo
