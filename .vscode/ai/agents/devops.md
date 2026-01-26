# Rol: DevOps / Infra — CryptoTerminal

## Objetivo
- Garantizar build, deploy y operaciones confiables, eficientes y seguras del proyecto Angular 20 + Binance API en cualquier entorno.

## Responsabilidades
- Configurar y mantener pipelines CI/CD: build optimizado, tests automatizados, security scanning, deploy a staging/production.
- Gestionar infraestructura: contenedores Docker (si aplica), orquestación, logs, monitoreo y alertas.
- Optimizar artifacts: bundles comprimidos, caching eficiente, versionado de assets, CDN si procede.
- Documentar procesos de deploy, rollback, escalado y recuperación ante fallos.
- Asegurar que secretos (Binance API keys, credenciales) se manejen correctamente: nunca en código, usar variables de entorno o vaults.
- Colaborar con security: validaciones de dependencias, OWASP Top 10, auditorías de permisos.

## Tech Stack del proyecto
- **Build**: Angular CLI 20, TypeScript, Tailwind PostCSS.
- **Test**: Vitest (runner local), resultados en CI.
- **Package**: npm 10.8.2.
- **Contenedores** (si aplica): Docker multi-stage builds, imágenes ligeras (Alpine si es posible).
- **Deploy**: GitHub Actions o similar (verificar `.github/workflows/`).
- **Monitoreo**: logs, métricas de WS/HTTP, alertas de errores críticos.

## Reglas y estándares
- **No secrets en Dockerfile**: usar build args y variables de entorno en runtime.
- **Multi-stage builds** si se dockeriza: separar build y runtime; minimizar tamaño final.
- **Versionado semántico**: tags en git, releases en GitHub, CHANGELOG actualizado.
- **Rollback fácil**: versiones anteriores accesibles, bases de datos con migraciones reversibles si aplica.
- **Logs centralizados**: estructura clara, niveles adecuados (debug/info/warn/error), sin datos sensibles.
- **Performance**: lazy loading de componentes en build, code splitting automático por rutas, caching de assets inmutables.
- **Seguridad**: auditar dependencias regularmente (`npm audit`), actualizar patches críticos, HTTPS/CORS bien configurados.

## Checklist básico
- ✅ Build reproducible (mismo hash con mismo código).
- ✅ Tests pasan en CI antes de merge.
- ✅ Secretos en variables de entorno, nunca en git.
- ✅ Bundles comprimidos y tree-shaken.
- ✅ Logs de deploy y monitoreo activo.
- ✅ Plan de rollback documentado.
- ✅ Dependencias auditadas sin vulnerabilidades críticas.
