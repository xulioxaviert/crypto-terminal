## Plan: Persistencia de datos para Financial Dashboard

TL;DR - Recomendación: usar Supabase (Postgres gratuito) como primera opción para un proyecto de estudio: ofrece Auth, Postgres relacional, API REST/Realtime y es fácil de integrar con Angular. Alternativas válidas: Firebase (Firestore), SQLite + Prisma (local) para aprender backend completo.

**Steps**
1. Elegir enfoque (gestionado vs local). *depends on respuestas del usuario*
2. Diseñar esquema de datos relacional (tablas: users, wallets, balances, assets, transactions, orders, watchlist, audit_logs).
3. Configurar Auth y seguridad (RLS si usas Postgres/Supabase). *parallel con step 4*
4. Implementar API backend mínimo (endpoints REST o usar PostgREST/Supabase auto-API). *parallel with step 3*
5. Implementar integraciones frontend: servicios Angular, typing, pruebas unitarias y mocks.
6. Añadir sincronización en tiempo real (realtime subscriptions o websockets) para precios y órdenes.
7. Verificación y pruebas: pruebas unitarias, e2e básicas, y checks de seguridad (no almacenar tokens en localStorage).

**Relevant files / places to modify**
- `src/app/features/dashboard/service/market.service.ts` — integrar fetch de balances y sincronización.
- `src/app/core/store/app.store.service.ts` — persistir user preferences y watchlist sincronizados con backend.
- `src/app/features/dashboard/components/markets/` — usar endpoints para acciones como `onTrade()`.

**Verification**
1. Crear un proyecto Supabase (gratis) y comprobar endpoints: Auth + REST sobre tablas.
2. Implementar flujo de registro/login desde Angular y verificar sesión HttpOnly (si usas custom backend) o token seguro con Supabase client.
3. Simular depósitos/withdrawals y registrar transacciones en `transactions`.
4. Validar que el frontend muestra balances correctos y que el sparkline/price updates no rompe la integridad.

**Decisions / Assumptions**
- El proyecto es para estudio; no se requieren certificaciones PCI o cumplimiento legal para dinero real.
- Se asume uso de datos simulados para operaciones de trading (no ejecución real en Binance).
- Preferencia del usuario: gratuito y fácil de desplegar.

**Further Considerations / Questions**
1. Autenticación: ¿quieres registro/login multiusuario o solo datos locales de ejemplo? (Recomendado: sí, para aprender Auth)
2. ¿Prefieres un servicio gestionado (Supabase/Firebase) o montar un backend propio con SQLite + Prisma para aprender más del backend?


Si confirmas las dos preguntas, convierto este plan en una lista de tareas detallada y empiezo la implementación sugerida.
