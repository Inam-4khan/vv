# Vizu Monorepo

![CI Status](https://github.com/vizu-app/vizu/actions/workflows/ci.yml/badge.svg)
![Android CI Status](https://github.com/vizu-app/vizu/actions/workflows/android-ci.yml/badge.svg)

Vizu is a spatial social platform delivering real-time connection feeds, AR vista interactions, persona management, and encrypted Hush whispers.

---

## ⚙️ Prerequisites & Setup

- **Node.js**: Node 20+ required.
- **Package Manager**: Use **npm** (`npm install`). **Do not use bun or yarn**. CI runs `npm ci` strictly with `package-lock.json`.

---

## 🚀 Continuous Integration (CI)

This monorepo utilizes GitHub Actions for continuous integration across both Web and Android platforms:

### 1. Web CI (`.github/workflows/ci.yml`)
- **Triggers**: On `push` and `pull_request` to `main` when files in `src/`, `components/`, or configuration files change.
- **Environment**: `ubuntu-latest` with Node.js 20.
- **Tasks**:
  1. Checkouts codebase.
  2. Sets up Node.js 20 with dependency caching.
  3. Installs dependencies using `npm ci`.
  4. Runs `npm run build` (Vite production build).
  5. Runs unit tests using Vitest (`npm test`).

### 2. Android CI (`.github/workflows/android-ci.yml`)
- **Triggers**: On `push` and `pull_request` to `main` when files in `android/` change.
- **Environment**: `ubuntu-latest` with JDK 17 & Gradle caching.
- **Tasks**:
  1. Checkouts codebase.
  2. Sets up JDK 17 (Temurin distribution) with Gradle build cache.
  3. Executes `./gradlew lint` for code quality checks.
  4. Executes `./gradlew assembleDebug` to compile debug APK binaries.

---

## 🛠️ Local Development & Testing Commands

### Web Platform
```bash
# Install dependencies (Node 20+, npm only)
npm install

# Run development server
npm run dev

# Run unit tests (Vitest)
npm test

# Build for production
npm run build
```

### Android Platform
```bash
cd android

# Run lint checks
./gradlew lint

# Run unit tests
./gradlew test

# Build debug APK
./gradlew assembleDebug
```
