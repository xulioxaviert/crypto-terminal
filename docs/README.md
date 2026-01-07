# 📚 Documentación de CryptoTerminal

Bienvenido a la documentación completa del proyecto **CryptoTerminal**, una aplicación de trading de criptomonedas construida con Angular 20.

## 📖 Índice de Contenidos

1. [Visión General del Proyecto](./01-project-overview.md)
2. [Arquitectura y Patrones](./02-architecture.md)
3. [Angular 20 vs Angular Legacy](./03-angular-20-vs-legacy.md)
4. [Servicios y Estado](./04-services-and-state.md)
5. [Componentes](./05-components.md)
6. [Modelos y Tipos](./06-models-and-types.md)
7. [Routing y Navegación](./07-routing.md)
8. [Integración con Binance API](./08-binance-integration.md)
9. [Estilos y UI (Tailwind CSS)](./09-styles-and-ui.md)
10. [Testing](./10-testing.md)
11. [Configuración y Build](./11-configuration.md)
12. [Guía de Desarrollo](./12-development-guide.md)

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Ejecutar tests
npm test

# Build de producción
npm run build
```

## 🔗 Enlaces Útiles

- [Binance API Setup](../BINANCE_API_SETUP.md)
- [Copilot Instructions](../copilot-instructions.md)
- [Angular Documentation](https://angular.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎯 Características Destacadas

### ✨ Tecnología de Vanguardia
- **Angular 20**: Última versión con Zoneless architecture
- **TypeScript 5.9**: Tipado estricto y features modernas
- **Signals**: Sistema reactivo nativo de Angular
- **Vitest**: Testing ultrarrápido

### 🎨 UI Moderna
- **Tailwind CSS**: Utility-first CSS framework
- **Dark Theme**: Diseño oscuro con efectos neon
- **Responsive**: Adaptable a todos los dispositivos
- **Animaciones**: Transiciones suaves y profesionales

### 📊 Datos en Tiempo Real
- **WebSocket**: Conexión continua con Binance
- **Auto-reconnect**: Reconexión automática en caso de error
- **Throttling**: Optimización de actualizaciones (100ms)
- **Type-safe**: Modelos TypeScript para todos los datos

## 📝 Convenciones del Proyecto

### Estructura de Archivos
```
feature/
├── components/           # Componentes UI
├── models/              # Interfaces y tipos
├── service/             # Servicios de dominio
└── feature.component.ts # Componente contenedor
```

### Nomenclatura
- **Componentes**: `kebab-case.component.ts`
- **Servicios**: `kebab-case.service.ts`
- **Modelos**: `kebab-case.model.ts`
- **Clases/Interfaces**: `PascalCase`
- **Variables/Funciones**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`

## 🤝 Contribuir

1. Fork el repositorio
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [MIT License](../LICENSE).

## 📧 Contacto

Para preguntas, sugerencias o reportar problemas, por favor abre un issue en el repositorio.

---

**Nota**: Esta documentación está actualizada al 7 de enero de 2026 y refleja la versión actual del proyecto con Angular 20.
