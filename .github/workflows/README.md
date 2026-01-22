# 🔄 GitHub Actions Workflows

Este directorio contiene los workflows de GitHub Actions para el proyecto Hotel Booking Frontend.

## 🚀 Workflow Principal

### `ci-cd.yml` - Pipeline CI/CD Único ⭐
**Este es el workflow principal que se ejecuta automáticamente.**

**Cuándo se ejecuta:**
- ✅ Push a cualquier rama
- ✅ Pull Requests a `main` o `develop`

**Validaciones:**
- 📦 Instalación de dependencias (con manejo inteligente de package-lock.json)
- 🔍 ESLint (calidad de código)
- 🔷 TypeScript (verificación de tipos)
- 🏗️ Build (compilación del proyecto)
- 📦 Genera artefactos de build

**Restricciones:**
- ❌ **BLOQUEANTE** para PRs a `main`/`develop` - Todas las validaciones deben pasar
- ⚠️ **INFORMATIVO** para push a otras ramas - Muestra advertencias pero no bloquea

**Características especiales:**
- 🔧 Manejo inteligente de `package-lock.json` desincronizado
- 📊 Resúmenes detallados con emojis en GitHub Actions
- 🎯 Pasos numerados y claramente definidos
- ✅ Estados visuales claros (✅ Pasó / ❌ Falló)

---


## 🎯 Flujo de Trabajo

### Para Pull Requests a `main` o `develop`:
1. Crear una rama desde `develop` o `main`
2. Hacer cambios y commits
3. Crear Pull Request
4. **Automáticamente se ejecuta `ci-cd.yml`:**
   - 📦 Instala dependencias (maneja package-lock.json automáticamente)
   - ✅ ESLint debe pasar
   - ✅ TypeScript debe compilar sin errores
   - ✅ Build debe ser exitoso
5. Si todas las validaciones pasan → ✅ PR puede ser mergeado
6. Si alguna validación falla → ❌ PR bloqueado hasta corregir errores

### Para Push a ramas de desarrollo:
1. Hacer push a tu rama de feature
2. **Se ejecuta `ci-cd.yml` con validaciones informativas:**
   - ⚠️ Advertencias no bloquean el push
   - 📊 Se muestra resumen detallado de validaciones
3. Puedes continuar trabajando mientras corriges advertencias

### Para Push a `main` o `develop`:
- ⚠️ **Todas las validaciones son bloqueantes**
- El push fallará si hay errores

---

## 🔧 Configuración Requerida

### En GitHub Repository Settings:

1. **Branch Protection Rules** (Settings → Branches):
   - Para `main`:
     - ✅ Require a pull request before merging
     - ✅ Require status checks to pass before merging
     - ✅ Require branches to be up to date before merging
     - ✅ Status checks requeridos:
       - `Control de Calidad / quality-check`
   
   - Para `develop`:
     - ✅ Require a pull request before merging
     - ✅ Require status checks to pass before merging
     - ✅ Status checks requeridos:
       - `Control de Calidad / quality-check`

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

