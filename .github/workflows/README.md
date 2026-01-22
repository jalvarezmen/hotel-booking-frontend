# 🔄 GitHub Actions Workflows

Este directorio contiene los workflows de GitHub Actions para el proyecto Hotel Booking Frontend.

## 📋 Workflows Disponibles

### 1. 🔍 `pr-validation.yml` - Validación de Pull Requests
**Cuándo se ejecuta:** Cuando se crea o actualiza un PR hacia `main` o `develop`

**Validaciones:**
- ✅ ESLint (calidad de código)
- ✅ TypeScript (verificación de tipos)
- ✅ Build (compilación del proyecto)

**Restricciones:** 
- ❌ **BLOQUEANTE** - El PR no puede ser mergeado si falla alguna validación

---

### 2. 🚀 `push-validation.yml` - Validación en Push
**Cuándo se ejecuta:** Cuando se hace push a cualquier rama (excepto `main` y `develop`)

**Validaciones:**
- ⚠️ ESLint (informativo, no bloqueante)
- ⚠️ TypeScript (informativo, no bloqueante)
- ⚠️ Build (informativo, no bloqueante)

**Restricciones:**
- ✅ **NO BLOQUEANTE** - Permite el push aunque haya advertencias

---

### 3. 🔄 `ci.yml` - Pipeline CI Completo
**Cuándo se ejecuta:** 
- Push a `main` o `develop`
- Pull requests a `main` o `develop`
- Manualmente (workflow_dispatch)

**Validaciones:**
- ✅ ESLint
- ✅ TypeScript
- ✅ Build
- 📦 Genera artefactos de build

---

### 4. 🛡️ `branch-protection.yml` - Protección de Ramas
**Cuándo se ejecuta:** Pull requests a `main` o `develop`

**Validaciones:**
- 🔍 ESLint (obligatorio)
- 🔷 TypeScript (obligatorio)
- 🏗️ Build (obligatorio)

**Restricciones:**
- ❌ **BLOQUEANTE** - El PR no puede ser mergeado si falla alguna validación

---

## 🎯 Flujo de Trabajo Recomendado

### Para Pull Requests a `main` o `develop`:
1. Crear una rama desde `develop` o `main`
2. Hacer cambios y commits
3. Crear Pull Request
4. **Automáticamente se ejecutan validaciones:**
   - ✅ ESLint debe pasar
   - ✅ TypeScript debe compilar sin errores
   - ✅ Build debe ser exitoso
5. Si todas las validaciones pasan → ✅ PR puede ser mergeado
6. Si alguna validación falla → ❌ PR bloqueado hasta corregir errores

### Para Push a ramas de desarrollo:
1. Hacer push a tu rama de feature
2. **Se ejecutan validaciones informativas:**
   - ⚠️ Advertencias no bloquean el push
   - 📊 Se muestra resumen de validaciones
3. Puedes continuar trabajando mientras corriges advertencias

---

## 🔧 Configuración Requerida

### En GitHub Repository Settings:

1. **Branch Protection Rules** (Settings → Branches):
   - Para `main`:
     - ✅ Require a pull request before merging
     - ✅ Require status checks to pass before merging
     - ✅ Require branches to be up to date before merging
     - ✅ Status checks requeridos:
       - `validate-pr / validate-pr`
       - `branch-protection / enforce-standards`
   
   - Para `develop`:
     - ✅ Require a pull request before merging
     - ✅ Require status checks to pass before merging
     - ✅ Status checks requeridos:
       - `validate-pr / validate-pr`
       - `branch-protection / enforce-standards`

2. **Actions Permissions** (Settings → Actions → General):
   - ✅ Allow all actions and reusable workflows
   - ✅ Read and write permissions

---

## 📊 Ver Resultados

Los resultados de los workflows se pueden ver en:
- **Actions tab** en GitHub
- **Checks tab** en cada Pull Request
- **Step Summary** en cada ejecución del workflow

---

## 🐛 Solución de Problemas

### Si un workflow falla:
1. Revisa los logs en la pestaña "Actions"
2. Corrige los errores mostrados
3. Haz push nuevamente para re-ejecutar las validaciones

### Errores comunes:
- **ESLint errors:** Ejecuta `npm run lint` localmente
- **TypeScript errors:** Ejecuta `npx tsc --noEmit` localmente
- **Build errors:** Ejecuta `npm run build` localmente

---

## 📝 Notas

- Los workflows usan Node.js 20
- Las dependencias se cachean automáticamente
- Los artefactos de build se guardan por 7 días
- Todos los workflows incluyen emojis para mejor visualización en GitHub

