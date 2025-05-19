> Detalla en esta sección los prompts principales utilizados durante la creación del proyecto, que justifiquen el uso de asistentes de código en todas las fases del ciclo de vida del desarrollo. Esperamos un máximo de 3 por sección, principalmente los de creación inicial o  los de corrección o adición de funcionalidades que consideres más relevantes.
Puedes añadir adicionalmente la conversación completa como link o archivo adjunto si así lo consideras


## Índice

1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)

---

## 1. Descripción general del producto

**Prompt 1:**
```
Actúa como Product Manager con experiencia en sistemas de salud digital y software veterinario. Basándote en el contexto del proyecto VetAI Connect, genera un PRD detallado que incluya:

1. Visión y objetivo: Define claramente el propósito del sistema y el problema que resuelve
2. Análisis detallado del público objetivo: Veterinarios (por tamaño de clínica, especialidad), dueños de mascotas (segmentados por tipo de mascota, frecuencia de visitas)
3. Propuesta de valor única: Enfatiza el diferenciador de la IA para pre-diagnósticos
4. User journeys completos para cada perfil de usuario
5. Requisitos funcionales organizados por módulos:
   - Sistema de usuarios y autenticación (detallar roles, permisos, información de perfil)
   - Gestión de mascotas (atributos, historial, alertas)
   - Sistema de citas (calendario, notificaciones, recordatorios)
   - Historiales clínicos (estructura, campos médicos específicos, acceso)
   - Módulo de IA (tipos de diagnósticos, integración, presentación de resultados)
6. Requisitos no funcionales con métricas concretas:
   - Rendimiento (tiempos de respuesta máximos por operación)
   - Seguridad (protocolos específicos para datos médicos)
   - Usabilidad (estándares de UX para cada perfil)
   - Disponibilidad (SLA objetivo)
7. Limitaciones técnicas y de negocio considerando el tiempo de desarrollo de 30 horas
8. Métricas de éxito con KPIs cuantificables para evaluación
9. Roadmap con priorización MoSCoW (Must have, Should have, Could have, Won't have)

El PRD debe ser detallado pero realista para el alcance de 30 horas de desarrollo, priorizando claramente lo esencial y diferenciando las características para MVP vs futuras iteraciones.
```

**Prompt 2:**
```
Como diseñador de experiencia de usuario especializado en aplicaciones médicas y veterinarias, desarrolla el diseño de interfaces y flujos de usuario completos para VetAI Connect. Incluye:

1. Principios de diseño generales para la aplicación, considerando su naturaleza médica
2. Mapa del sitio completo con jerarquía de páginas y navegación
3. User flows detallados con diagrama secuencial para:
   - Registro e inicio de sesión (cliente y veterinario)
   - Creación y gestión de perfil de mascota
   - Flujo completo de reserva de cita (desde búsqueda hasta confirmación)
   - Proceso de pre-diagnóstico con IA (carga de imágenes, visualización)
   - Consulta de historiales clínicos y seguimiento
   - Panel de control para veterinarios

4. Wireframes de alta fidelidad para las pantallas principales:
   - Dashboard principal (cliente y veterinario)
   - Perfil de mascota (vista cliente y veterinario)
   - Formulario de cita y calendario
   - Interfaz de carga y visualización de imágenes para IA
   - Visualización de resultados del pre-diagnóstico
   - Historiales médicos y timeline

5. Sistema de diseño con:
   - Paleta de colores justificada (considerando psicología del color para entornos médicos)
   - Tipografía y escala
   - Componentes UI reutilizables (botones, campos, tarjetas, modales)
   - Estados interactivos y microinteracciones
   - Versiones responsive (móvil, tablet, escritorio)

6. Consideraciones de accesibilidad WCAG 2.1 nivel AA para todos los flujos principales

Proporciona mockups visuales para las 5 pantallas más críticas del sistema que muestren claramente la experiencia del usuario final, considerando tanto funcionalidad como estética apropiada para una aplicación médica profesional pero amigable.
```

**Prompt 3:**
```
Como especialista en requisitos legales y éticos para sistemas de salud con IA, desarrolla un análisis detallado y directrices específicas para VetAI Connect, incluyendo:

1. Marco legal aplicable a servicios veterinarios digitales:
   - Regulaciones específicas por región (EU, US, LATAM)
   - Requisitos de licencias veterinarias para telemedicina
   - Cumplimiento de GDPR/CCPA para datos de usuarios y mascotas

2. Análisis de riesgos y responsabilidad legal:
   - Matriz de riesgos para diagnósticos asistidos por IA
   - Limitaciones de responsabilidad y casos de excepción
   - Protocolos para reportar falsos diagnósticos o errores del sistema

3. Disclaimers necesarios:
   - Textos específicos para diferentes secciones (pre-diagnóstico, consejos médicos)
   - Jerarquía visual y ubicación de avisos legales
   - Frecuencia de presentación (por sesión, por acción)

4. Consentimientos informados:
   - Template completo para procesamiento de datos personales
   - Consentimiento específico para uso de IA en diagnósticos
   - Proceso de revocación de consentimientos

5. Política de privacidad especializada:
   - Secciones específicas para datos médicos veterinarios
   - Tratamiento de imágenes de diagnóstico
   - Compartición de datos con veterinarios y terceros

6. Cumplimiento ético para IA en medicina veterinaria:
   - Directrices de transparencia algorítmica
   - Evitar sesgos en diagnósticos
   - Protocolo de supervisión humana

7. Términos de servicio específicos para la plataforma:
   - Limitaciones del servicio
   - Política de pagos (si aplica)
   - Proceso de resolución de disputas

Proporciona, además de las directrices, los textos legales completos listos para implementar en las secciones críticas del sistema, especialmente para el componente de pre-diagnóstico con IA.
```

**Prompt 4:**
```
Como estratega de monetización y crecimiento para startups de healthtech, desarrolla un plan de negocio y estrategia de monetización para VetAI Connect, incluyendo:

1. Análisis de mercado:
   - Tamaño del mercado veterinario digital (TAM, SAM, SOM)
   - Análisis competitivo de soluciones existentes
   - Oportunidades de diferenciación con IA

2. Modelos de monetización viables:
   - Estructura de precios para clínicas veterinarias (subscription vs. pay-per-use)
   - Opciones freemium para dueños de mascotas
   - Servicios premium adicionales
   - Posibles colaboraciones con aseguradoras veterinarias

3. Estrategia de adquisición de usuarios:
   - Plan de marketing digital específico para captar clínicas
   - Estrategia para atraer dueños de mascotas
   - Programa de referidos y growth loops

4. Métricas clave de negocio:
   - KPIs de crecimiento y retención
   - Indicadores financieros a monitorear
   - Customer acquisition cost (CAC) y lifetime value (LTV) esperados

5. Roadmap de funcionalidades monetizables:
   - Priorización basada en potencial de ingresos vs. esfuerzo
   - Funcionalidades premium para veterinarios
   - Servicios de valor añadido para dueños de mascotas

6. Estrategia de partnership:
   - Colaboraciones con proveedores de alimentos/medicamentos
   - Integraciones con aseguradoras
   - Alianzas con fabricantes de dispositivos para mascotas

El plan debe ser realista para una startup temprana, con opciones para comenzar con un modelo básico viable e ir evolucionando a medida que crezca la base de usuarios.
```

---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**

**Prompt 1:**
```
Como arquitecto de software senior especializado en sistemas web modernos con microservicios, diseña la arquitectura completa para VetAI Connect utilizando VueJS, NestJS y PostgreSQL. Tu propuesta debe incluir:

1. Diagrama de arquitectura integral mostrando:
   - Capas de la aplicación claramente separadas (presentación, lógica de negocio, datos)
   - Componentes principales y sus responsabilidades
   - Patrones de comunicación entre componentes (REST, WebSocket, mensajería)
   - Integraciones con servicios externos (IA, almacenamiento)
   - Mecanismos de autenticación y seguridad

2. Justificación técnica detallada de decisiones arquitectónicas:
   - Por qué VueJS como frontend (comparado con React/Angular)
   - Ventajas de NestJS para esta solución específica
   - Decisiones sobre estado (stateful vs stateless)
   - Estrategia de caché para optimizar rendimiento

3. Diagrama de flujo de datos detallado para procesos críticos:
   - Flujo de autenticación y autorización
   - Proceso completo de pre-diagnóstico con IA (desde carga hasta presentación)
   - Gestión y persistencia de historiales médicos

4. Consideraciones específicas para:
   - Escalabilidad horizontal y vertical
   - Tolerancia a fallos y alta disponibilidad
   - Observabilidad (logging, monitoring, tracing)
   - Mantenibilidad y extensibilidad futura
   - CI/CD y estrategia de despliegue

5. Comparativa de las alternativas arquitectónicas consideradas y razones para la elección final

Usa notación C4 o diagramas UML estándar con explicaciones detalladas. La arquitectura debe ser pragmática y optimizada para desarrollo rápido (30 horas) sin comprometer la calidad ni crear deuda técnica innecesaria.
```

**Prompt 2:**
```
Como experto en integración de sistemas de IA en aplicaciones médicas, diseña la arquitectura específica para el componente de pre-diagnóstico veterinario de VetAI Connect. Tu diseño debe incluir:

1. Evaluación comparativa de APIs de terceros para análisis de imágenes veterinarias:
   - Tabla comparativa con al menos 3 opciones (Google Cloud Vision, Azure Computer Vision, Amazon Rekognition, APIs especializadas veterinarias)
   - Criterios de evaluación: precisión para condiciones veterinarias, costos, límites de API, facilidad de integración, documentación
   - Recomendación final justificada

2. Arquitectura detallada del componente de IA:
   - Diagrama de componentes para el servicio de diagnóstico
   - Estrategia de preprocessing de imágenes (redimensionamiento, normalización)
   - Sistema de colas para procesamiento asíncrono
   - Mecanismos de retry y circuit breaker para comunicación con APIs externas
   - Estrategia de caché para reducir llamadas a la API

3. Flujo completo end-to-end con diagramas secuenciales:
   - Pre-procesamiento de imágenes (validación, transformación)
   - Envío y comunicación con la API externa
   - Procesamiento y transformación de resultados
   - Almacenamiento de diagnósticos y relación con historiales
   - Presentación de resultados al usuario final

4. Estrategia para mejorar precisión y mitigar limitaciones:
   - Enfoque de múltiples clasificadores si es necesario
   - Umbral de confianza configurable para diagnósticos
   - Sistema de feedback para mejorar modelos (si aplica)
   - Supervisión humana (rol del veterinario en la validación)

5. Consideraciones técnicas específicas:
   - Manejo eficiente de imágenes de alta resolución
   - Protocolos de seguridad para datos sensibles
   - Estrategia de versionado para adaptarse a cambios en las APIs
   - Diseño para testing y validación (mocks, test fixtures)

Proporciona ejemplos de código o pseudocódigo para partes críticas de la implementación, especialmente para la integración con la API seleccionada y el procesamiento de resultados.
```

**Prompt 3:**
```
Como arquitecto de seguridad certificado (CISSP) especializado en aplicaciones médicas y sistemas con IA, desarrolla una estrategia de seguridad integral para VetAI Connect. Tu propuesta debe incluir:

1. Análisis de amenazas y modelo de riesgo:
   - STRIDE completo (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege)
   - Threat modeling específico para aplicaciones veterinarias con IA
   - Clasificación de datos según sensibilidad y requisitos de protección

2. Diseño detallado del sistema de autenticación y autorización:
   - Implementación JWT con token de acceso y refresh token
   - Estrategia de rotación y revocación de tokens
   - Diseño de permisos granulares basados en roles (RBAC) para:
     * Administradores de clínica
     * Veterinarios (con variantes según jerarquía)
     * Asistentes veterinarios (acceso limitado)
     * Clientes (acceso a sus mascotas y datos específicos)
   - Diagrama de flujo de autenticación multifactor (si aplica)

3. Protección contra vulnerabilidades específicas con implementación concreta:
   - Mitigación de OWASP Top 10 con ejemplos de código para NestJS
   - Configuración de encabezados de seguridad HTTP
   - Prevención de ataques XSS, CSRF, inyección SQL
   - Implementación de rate limiting y protección contra brute force

4. Seguridad de datos:
   - Estrategia de cifrado (en tránsito y en reposo)
   - Anonimización/seudonimización de datos para análisis
   - Manejo seguro de imágenes médicas y diagnósticos
   - Política de backup y recuperación segura

5. Sistema de auditoría y monitoreo de seguridad:
   - Eventos críticos a registrar
   - Estructura de logs de seguridad
   - Detección de anomalías y alertas
   - Plan de respuesta a incidentes

6. Consideraciones de seguridad específicas para la integración con IA:
   - Protección de datos enviados a servicios externos
   - Validación de inputs/outputs para prevenir ataques de adversarial ML
   - Monitoreo de calidad de diagnósticos para detectar manipulaciones

Proporciona configuraciones concretas, políticas, y ejemplos de código donde sea relevante, asegurando que todo pueda implementarse dentro del marco de 30 horas sin comprometer la seguridad fundamental.
```

**Prompt 4:**
```
Como arquitecto DevSecOps especializado en aplicaciones reguladas y de salud, diseña una estrategia completa de CI/CD, infraestructura y monitoreo para VetAI Connect. Tu propuesta debe incluir:

1. Infraestructura como código (IaC) completa:
   - Configuración Terraform o CDK para provisionar todos los recursos necesarios
   - Arquitectura cloud optimizada para costos (preferentemente AWS o Azure)
   - Topología de red con consideraciones de seguridad
   - Configuración de servicios gestionados vs. self-hosted

2. Pipeline CI/CD detallado:
   - Configuración GitHub Actions completa para frontend y backend
   - Estrategia de branching (GitFlow o similar)
   - Automatización de pruebas (unitarias, integración, e2e)
   - Análisis estático de código y seguridad (SAST, SCA)
   - Estrategia de despliegue (blue-green, canary)

3. Containerización y orquestación:
   - Dockerfiles optimizados para frontend y backend
   - Docker Compose para desarrollo local
   - Configuración Kubernetes para producción (opcional según escala)
   - Estrategia de secret management

4. Monitoreo y observabilidad:
   - Stack de monitoreo completo (métricas, logs, trazas)
   - Dashboards para indicadores clave (latencia, errores, uso)
   - Alertas y notificaciones para incidentes
   - Monitoreo específico para servicios de IA (latencia, precisión)

5. Seguridad operacional:
   - Escaneo continuo de vulnerabilidades
   - Gestión de dependencias y actualizaciones
   - Backup y disaster recovery
   - Cumplimiento con requisitos regulatorios

6. Estrategia de escalado:
   - Configuración de auto-scaling
   - Optimización de rendimiento y costos
   - Gestión de bases de datos (pooling, replicación)

Proporciona los archivos de configuración necesarios (GitHub workflows, Terraform, Dockerfiles) y diagramas de arquitectura cloud que permitan implementar la infraestructura de forma rápida pero robusta.
```

### **2.2. Descripción de componentes principales:**

**Prompt 1:**
```
Como arquitecto de frontend especializado en VueJS y aplicaciones médicas, diseña la arquitectura detallada del frontend para VetAI Connect. Tu propuesta debe incluir:

1. Arquitectura completa de componentes frontend:
   - Estructura organizativa siguiendo patrones Vue recomendados (Vue 3 + Composition API)
   - Diagrama de jerarquía de componentes con responsabilidades claras
   - Estrategia de componentización (atómicos, moleculares, organismos)
   - Sistema de módulos y lazy loading para optimización

2. Gestión de estado integral:
   - Comparativa justificada de soluciones (Vuex vs Pinia)
   - Estructura de stores con namespaces
   - Estrategia para persistent state
   - Manejo de estado global vs local
   - Consideraciones de rendimiento y patrón para entidades complejas

3. Sistema de enrutamiento y navegación:
   - Estructura de rutas con lazy loading
   - Middleware de navegación (autenticación, autorización)
   - Meta-información para SEO y analytics
   - Manejo de transiciones entre vistas
   - Estrategia para preservación de estado entre navegaciones

4. Estrategia para formularios y validación:
   - Biblioteca recomendada para validaciones complejas
   - Componentes reutilizables para tipos comunes de campos
   - Manejo de errores y feedback visual
   - Estrategia para formularios multi-paso (registros, citas)

5. Comunicación con backend:
   - Arquitectura de servicios API
   - Manejo de tokens y autenticación en peticiones
   - Estrategia de caché y optimización
   - Manejo de errores y reconexiones
   - Patrón para cancelación de peticiones

6. Interfaces críticas (proporciona wireframes y componentes):
   - Dashboard para veterinarios
   - Vista de historial médico
   - Sistema de carga y visualización para diagnóstico IA
   - Calendario de citas interactivo

Incluye ejemplos de código para patrones críticos y servicios core, junto con recomendaciones de bibliotecas específicas para resolver cada necesidad (UI components, formularios, visualización de datos médicos, etc.).
```

**Prompt 2:**
```
Como arquitecto de backend especializado en NestJS y sistemas médicos, diseña la arquitectura detallada del backend para VetAI Connect. Tu propuesta debe incluir:

1. Diseño modular completo:
   - Estructura detallada de módulos y su propósito
   - Diagrama de dependencias entre módulos
   - Principios SOLID aplicados a la arquitectura
   - Estrategia para desarrollo incremental

2. Diseño de controladores y rutas:
   - Estructura de endpoints RESTful
   - Versioning de API
   - Documentación automática con Swagger/OpenAPI
   - Manejo de parámetros y validación

3. Arquitectura de servicios:
   - Separación de responsabilidades (services, repositories)
   - Inyección de dependencias avanzada
   - Transaccionalidad y manejo de errores
   - Servicios compartidos vs específicos

4. Middleware y interceptores:
   - Autenticación y autorización (Guards, estrategias)
   - Logging y tracing
   - Transformación de respuestas
   - Caching y optimización de rendimiento

5. Acceso a datos:
   - Patrones de repositorio y ORM (TypeORM configuración)
   - Migraciones y seeds
   - Consultas optimizadas y eager/lazy loading
   - Transacciones y aislamiento
   - Indexación y rendimiento

6. Integración con servicios externos:
   - Diseño del módulo de diagnóstico IA
   - Estrategia para almacenamiento de imágenes (S3/equivalente)
   - Integración con servicios de email/notificaciones
   - Circuit breakers y manejo de fallos

7. Procesamiento asíncrono:
   - Implementación de colas de tareas (Bull/Redis)
   - Workers para tareas intensivas
   - Manejo de resultados asincrónicos

Proporciona ejemplos de código para los patrones arquitectónicos clave, configuraciones base, y recomendaciones específicas de bibliotecas para cada necesidad (validación, seguridad, colas, etc.).
```

**Prompt 3:**
```
Como arquitecto de bases de datos especializados en PostgreSQL para aplicaciones médicas, diseña la estrategia completa de datos para VetAI Connect. Tu propuesta debe incluir:

1. Diseño de sistema de persistencia:
   - Configuración optimizada de PostgreSQL para el contexto específico
   - Consideraciones de rendimiento, escalabilidad y mantenimiento
   - Estrategia de conexión y pooling
   - Backup, replicación y recuperación ante desastres

2. Estrategia de migración y cambios de esquema:
   - Herramienta recomendada y enfoque (TypeORM migrations, Flyway, etc.)
   - Plan para migraciones seguras sin downtime
   - Versionado de esquema y rollbacks
   - Seeds y datos de prueba

3. Optimización avanzada para consultas críticas:
   - Estrategia de indexación para consultas frecuentes
   - Particionamiento para tablas grandes (historiales)
   - Uso de tipos JSON/JSONB para datos flexibles
   - Views y materialized views para reporting
   - Query optimization para consultas complejas (explain analyze)

4. Estrategia para datos sensibles:
   - Encriptación a nivel de columna para información confidencial
   - Anonimización y pseudonimización para reporting
   - Auditoría de cambios en datos sensibles
   - Políticas de retención y eliminación

5. Solución para almacenamiento y referencia de imágenes:
   - Comparativa de opciones (BD vs object storage)
   - Estrategia para metadatos vs blob storage
   - Optimización para imágenes de diagnóstico
   - Versionado y seguimiento de cambios en imágenes médicas

6. Estrategia para historiales médicos:
   - Modelo para representar evolución en tiempo
   - Consultas eficientes sobre historiales extensos
   - Archivado y acceso a datos históricos
   - Rendimiento de consultas temporales

Proporciona scripts SQL de ejemplo para estructuras de tablas críticas, índices recomendados, consultas optimizadas para casos de uso específicos, y configuraciones de PostgreSQL para maximizar rendimiento.
```

**Prompt 4:**
```
Como especialista fullstack en aplicaciones de salud, desarrolla una guía detallada de integración y comunicación entre todos los componentes del sistema VetAI Connect. Tu propuesta debe incluir:

1. Diseño del contrato de API entre frontend y backend:
   - Estándares para endpoints (nomenclatura, estructura)
   - Formato de peticiones y respuestas (estándar JSON API)
   - Estrategia de versionado y compatibilidad
   - Manejo de errores y códigos de estado

2. Autenticación y autorización end-to-end:
   - Flujo completo de autenticación (login, refresh, logout)
   - Almacenamiento seguro de tokens en frontend
   - Validación de permisos en backend
   - Session management y timeout

3. Estrategia para datos en tiempo real:
   - Evaluación de opciones (polling, webhooks, WebSockets, SSE)
   - Diseño para notificaciones y alertas
   - Actualización de estado en tiempo real para citas
   - Performance y consideraciones de escalabilidad

4. Pipeline de imágenes diagnósticas:
   - Flujo completo desde captura hasta procesamiento
   - Optimización de imágenes en frontend
   - Validación y sanitización
   - Almacenamiento eficiente y seguro
   - Recuperación y visualización optimizada

5. Testing de integración:
   - Estrategia para probar comunicación entre componentes
   - Mocking de servicios externos
   - E2E testing para flujos críticos
   - CI/CD para validación continua de integraciones

6. Monitoreo de comunicación:
   - Logging centralizado de interacciones
   - Tracing distribuido para seguimiento de peticiones
   - Métricas para latencia y errores en comunicaciones
   - Alertas para fallos de integración

Proporciona ejemplos concretos de implementación para cada aspecto, incluyendo código tanto del lado del frontend como del backend que demuestre los patrones recomendados de comunicación.
```

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**

**Prompt 1:**
```
Como arquitecto fullstack experto en organización de proyectos web modernos, diseña la estructura de ficheros completa y organización de código para VetAI Connect, tanto para el frontend (VueJS) como para el backend (NestJS). Tu propuesta debe incluir:

1. Estructura de directorios completa para el frontend:
   - Organización por funcionalidad vs. tipo de archivo
   - Enfoque para componentes compartidos vs. específicos
   - Estructura para assets (imágenes, fuentes, iconos)
   - Organización de estilos (CSS/SCSS)
   - Estructura para pruebas y mocks
   - Organización de configuraciones (dev/prod/test)
   - Modelo para internacionalización

2. Estructura de directorios completa para el backend:
   - Organización modular con separación clara de dominios
   - Estructura para controladores, servicios, entidades, DTOs
   - Ubicación de middlewares, guards e interceptores
   - Configuración por entorno (dev/prod/test)
   - Estructura para migraciones y seeds
   - Ubicación de tests unitarios/integración

3. Estructura de carpetas compartidas (si aplica):
   - Tipos/interfaces compartidos entre backend y frontend
   - Constantes y enumeraciones comunes
   - Utilidades compartidas

4. Organización del monorepo o múltiples repositorios:
   - Análisis de ventajas/desventajas para este proyecto
   - Recomendación justificada con configuración
   - Tooling necesario (lerna, nx, turborepo)

5. Configuración y gestión de dependencias:
   - Estrategia para gestión de dependencias
   - Compartición de librerías comunes
   - Versionado y actualización

6. Estándares de codificación y enforcement:
   - Herramientas de linting y formateo
   - Configuración para asegurar consistencia
   - Git hooks para validación pre-commit

Proporciona un diagrama visual de la estructura de carpetas recomendada y ejemplos de configuración para las herramientas sugeridas (linting, testing, etc.), considerando las mejores prácticas actuales para aplicaciones Vue 3 con Composition API y NestJS con arquitectura modular.
```

**Prompt 2:**
```
Como desarrollador líder de frontend especializado en VueJS y patrones de diseño modernos, establece las mejores prácticas y estándares detallados de codificación para el frontend de VetAI Connect. Tu propuesta debe incluir:

1. Guía completa de estructura de componentes:
   - Implementación de Atomic Design (átomos, moléculas, organismos, templates, páginas)
   - Organización de archivos por componente
   - Nomenclatura y convenciones para componentes
   - Estrategia para componentes síncronos vs asíncronos
   - Patrones para composición vs herencia

2. Guía detallada para Composition API:
   - Uso de setup() vs <script setup>
   - Patrones para composables (hooks) reutilizables
   - Manejo de referencias, computed, watch
   - Ciclo de vida y side effects
   - Inyección y providencia de dependencias

3. Estrategia de estilos avanzada:
   - Sistema de diseño con variables CSS/SCSS
   - Enfoque para CSS (Scoped, CSS Modules, Tailwind)
   - Estructura para temas y customización
   - Estrategia responsive y mobile-first
   - Optimización de CSS y rendimiento

4. Implementación de internacionalización:
   - Bibliotecas recomendadas
   - Estructura para traducciones
   - Manejo de formatos (fechas, números, moneda)
   - Dynamic language switching

5. Estrategias de rendimiento:
   - Optimización de imágenes y assets
   - Code-splitting y lazy loading
   - Virtual scrolling para listas grandes
   - Memorización y caché de componentes
   - Tree-shaking y bundle optimization

6. Testing unitario y de componentes:
   - Configuración de Vitest/Jest
   - Estrategia para mocking
   - Testing de componentes con Vue Test Utils
   - Coverage mínimo y áreas críticas

7. Patrones avanzados específicos para la aplicación:
   - Manejo de formularios médicos complejos
   - Visualización de datos médicos temporales
   - Estrategia para componentes de calendario y agenda
   - Patrón para Upload de imágenes diagnósticas

Proporciona ejemplos concretos de código para cada sección, incluyendo snippets que muestren la implementación recomendada para componentes críticos de la aplicación.
```

**Prompt 3:**
```
Como desarrollador líder de backend especializado en NestJS y arquitecturas escalables, establece las mejores prácticas y estándares detallados de codificación para el backend de VetAI Connect. Tu propuesta debe incluir:

1. Guía exhaustiva para diseño de módulos:
   - Criterios para separación en módulos
   - Estructura interna de cada módulo
   - Manejo de dependencias entre módulos
   - Reutilización de funcionalidad compartida
   - Domain-Driven Design aplicado a NestJS

2. Patrones avanzados para controladores y rutas:
   - Estructura consistente de endpoints
   - Versioning de API
   - Documentación con Swagger/OpenAPI
   - DTO pattern con validación avanzada
   - Mapeo y serialización eficiente de respuestas

3. Mejores prácticas para servicios y lógica de negocio:
   - Aplicación de Single Responsibility Principle
   - Manejo de transacciones y errores
   - Separación de concerns
   - Patrones para operaciones CRUD y avanzadas
   - Estrategia para operaciones asíncronas

4. Enfoque detallado para TypeORM:
   - Diseño de entidades y relaciones
   - Estrategias de consulta optimizada
   - Manejo de migraciones
   - Patrones para repositorio personalizado
   - Estrategias de caché

5. Implementación de seguridad robusta:
   - Autenticación con múltiples estrategias
   - RBAC con permisos granulares
   - Protección contra ataques comunes
   - Securización de endpoints críticos
   - Manejo de sesiones y revocación

6. Testing avanzado:
   - Estrategias para mocking y spying
   - Testing de integración con bases de datos
   - Testing de endpoints con supertest
   - E2E testing de flujos críticos
   - Métricas de cobertura y áreas prioritarias

7. Patrones específicos para casos críticos:
   - Implementación de colas con Bull/Redis
   - Integración con APIs externas para IA
   - Gestión de uploads y storage de imágenes
   - Auditoría y logging avanzado
   - Healthchecks y monitoreo

Proporciona ejemplos concretos de código para cada sección que muestren la implementación recomendada, incluyendo configuraciones, snippets y patrones aplicados específicamente al contexto de una aplicación veterinaria con IA.
```

**Prompt 4:**
```
Como experto en desarrollo cloud-native y DevOps para aplicaciones médicas, establece la configuración óptima de herramientas de desarrollo y CI/CD para el proyecto VetAI Connect. Tu propuesta debe incluir:

1. Entorno de desarrollo local completo:
   - Configuración Docker Compose para desarrollo
   - Scripts de inicialización y seed
   - Hot-reloading y debugging
   - Entornos de testing y simulación
   - Integración editor/IDE (recomendaciones VSCode)

2. Configuración de linting y formateo:
   - ESLint y Prettier configurados para Vue y NestJS
   - Reglas específicas para el proyecto
   - Git hooks con Husky para validación pre-commit
   - Integración en CI/CD

3. Pipeline CI/CD completo:
   - Configuración GitHub Actions o equivalente
   - Matrix testing en diferentes entornos
   - Estrategia de build optimizada
   - Security scanning (SAST, SCA, secrets)
   - Deployment automatizado a entornos

4. Estrategia de branching y PR:
   - Modelo de branching (GitFlow, trunk-based)
   - Proceso de code review
   - PR template y checks automáticos
   - Políticas de merge y protección

5. Monitoreo y observabilidad:
   - Configuración de logging centralizado
   - Métricas de aplicación
   - Tracing distribuido
   - Alertas y notificaciones

6. Gestión de configuración:
   - Manejo de variables de entorno
   - Secrets management
   - Configuración específica por entorno
   - Feature flags y toggle

Proporciona los archivos de configuración completos (docker-compose.yml, github workflows, eslint config, etc.) y scripts necesarios para implementar todas estas recomendaciones, con instrucciones detalladas para que un nuevo desarrollador pueda comenzar a trabajar en el proyecto inmediatamente.
```

### **2.4. Infraestructura y despliegue**

**Prompt 1:**
```
Como arquitecto de soluciones cloud y DevOps con experiencia en sistemas de salud, diseña la estrategia de infraestructura y despliegue completa para VetAI Connect. Tu propuesta debe incluir:

1. Arquitectura cloud detallada:
   - Diagrama de infraestructura completo (preferentemente AWS o Azure)
   - Selección justificada de servicios gestionados vs self-hosted
   - Distribución en zonas/regiones para alta disponibilidad
   - Topología de red y seguridad (VPC, subnets, NAT, etc.)
   - Estrategia de costos optimizada para startup (estimated billing)

2. Solución de despliegue y entornos:
   - Arquitectura multi-entorno (dev, staging, production)
   - Estrategia de promoción entre entornos
   - Pipeline de despliegue automatizado (CI/CD)
   - Blue/Green o Canary deployments
   - Gestión de database migrations sin downtime

3. Containerización completa:
   - Dockerfiles optimizados para frontend y backend
   - Estrategias de caching y capas
   - Multi-stage builds para optimización
   - Configuración de Docker Compose para desarrollo
   - Solución de orquestación para producción (ECS, Kubernetes, etc.)

4. Estrategia de escalabilidad:
   - Configuración de auto-scaling
   - Load balancing y distribución de tráfico
   - Optimización de bases de datos para escalado
   - Caché distribuida para reducir carga
   - Manejo de assets estáticos (CDN)

5. Seguridad de infraestructura:
   - IAM y gestión de permisos
   - Encriptación en tránsito y reposo
   - Secrets management
   - WAF y protección de endpoints
   - Network security y DDoS protection

6. Observabilidad y monitoreo:
   - Logging centralizado
   - Métricas de aplicación y sistema
   - Alerting y on-call
   - Dashboards de operación
   - Análisis de rendimiento y optimización

7. Disaster Recovery y operaciones:
   - Estrategia de backups
   - RTO y RPO definidos
   - Plan de recuperación ante desastres
   - Runbooks para operaciones comunes
   - Automatización de tareas de mantenimiento

Proporciona los scripts de IaC (Terraform, CloudFormation, CDK, etc.) necesarios para implementar la infraestructura base, junto con configuraciones completas de CI/CD (GitHub Actions, GitLab CI) para automatizar el despliegue.
```

**Prompt 2:**
```
Como especialista en CI/CD y DevOps para aplicaciones médicas, desarrolla una estrategia detallada de integración continua y despliegue para VetAI Connect utilizando GitHub Actions. Tu propuesta debe incluir:

1. Workflows completos para todas las etapas:
   - Validación de código (linting, formatting)
   - Testing (unitario, integración, e2e)
   - Análisis estático de código (SonarQube, CodeQL)
   - Security scanning (SAST, dependency scanning, secrets)
   - Construcción de imágenes y publicación
   - Despliegue a entornos

2. Estrategia de branching y automatización:
   - Modelo de rama detallado (Gitflow, trunk-based, etc.)
   - Triggers para cada workflow
   - Automatización de PR reviews
   - Reglas de protección para ramas principales
   - Proceso de release y versionado semántico

3. Matriz de testing completa:
   - Testing en múltiples entornos
   - Combinaciones de navegadores/dispositivos
   - Pruebas de rendimiento automatizadas
   - Tests de accesibilidad
   - Load/stress testing

4. Pipeline de despliegue seguro:
   - Estrategia para blue/green deployment
   - Canary releases con análisis de métricas
   - Rollback automático ante fallos
   - Aprobaciones manuales para entornos críticos
   - Integración con herramientas de monitoreo

5. Gestión de secretos y configuración:
   - Integración con GitHub Secrets
   - Variables de entorno por ambiente
   - Rotación de credenciales
   - Validación de configuración

6. Automatización de entornos efímeros:
   - Entornos de preview por PR
   - Limpieza automática
   - Snapshots de bases de datos para testing
   - Isolated testing environments

7. Notificaciones y reporting:
   - Alertas en fallos de pipeline
   - Notificaciones a equipos relevantes
   - Reporting de status en PRs
   - Dashboards de métricas CI/CD

Proporciona los archivos YAML completos para todos los workflows de GitHub Actions, así como templates de PR, configuraciones de branch protection y guías de contribución que aseguren un ciclo de desarrollo seguro y eficiente.
```

**Prompt 3:**
```
Como experto en containerización y Kubernetes para aplicaciones de salud digital, desarrolla una estrategia completa de containerización y orquestación para VetAI Connect. Tu propuesta debe incluir:

1. Dockerfiles optimizados:
   - Dockerfile multi-etapa para frontend
   - Dockerfile multi-etapa para backend
   - Optimización de layers y caching
   - Securización de imágenes (non-root, eliminación de vulnerabilidades)
   - Reducción de tamaño de imagen final

2. Configuración Docker Compose para desarrollo:
   - Setup completo para desarrollo local
   - Servicios para frontend, backend, base de datos, redis
   - Volúmenes para persistencia y hot reload
   - Redes para comunicación entre servicios
   - Scripts de inicialización y seeds

3. Arquitectura Kubernetes detallada para producción:
   - Estructura de namespaces
   - Despliegues optimizados (Deployments, StatefulSets)
   - Servicios y Ingress
   - ConfigMaps y Secrets
   - PersistentVolumes para datos
   - Network Policies para seguridad
   - RBAC y Service Accounts

4. Estrategia de escalabilidad y resiliencia:
   - HorizontalPodAutoscalers
   - Readiness y liveness probes
   - Disruption budgets
   - Anti-affinity rules
   - Resource limits y requests

5. Solución para bases de datos en Kubernetes:
   - Operadores para PostgreSQL
   - Configuración de replicación
   - Backups automatizados
   - Monitoreo específico

6. Gestión de tráfico:
   - Ingress controllers
   - TLS termination
   - Configuración de path routing
   - Rate limiting
   - Mutual TLS si es necesario

7. Observabilidad en Kubernetes:
   - Logging distribuido con adaptadores
   - Prometheus para métricas
   - Configuración de Grafana dashboards
   - Tracing distribuido
   - Alerting

Proporciona los manifiestos Kubernetes completos (YAML o Helm charts) para todos los componentes necesarios, así como los Dockerfiles y docker-compose.yml para desarrollo. Incluye también recomendaciones para herramientas de gestión de Kubernetes (Lens, k9s, etc.) para facilitar las operaciones.
```

**Prompt 4:**
```
Como arquitecto de seguridad cloud para aplicaciones médicas reguladas, desarrolla una estrategia integral de seguridad cloud y cumplimiento para la infraestructura de VetAI Connect. Tu propuesta debe incluir:

1. Evaluación de riesgos y compliance:
   - Matriz de requerimientos para datos de salud veterinaria
   - Análisis de regulaciones aplicables (HIPAA-like para veterinaria)
   - Identificación de riesgos específicos para IA médica
   - Framework de seguridad aplicado (NIST, ISO 27001, etc.)

2. Arquitectura de seguridad cloud detallada:
   - Identity and Access Management (IAM/RBAC)
   - Network security (firewalls, WAF, segmentación)
   - Data protection (encryptions at-rest, in-transit)
   - Security monitoring y threat detection
   - DDoS protection y borde seguro

3. Protección de datos:
   - Clasificación de datos por sensibilidad
   - Estrategias de encriptación por tipo de dato
   - Key management
   - Data masking y anonimización
   - Gestión de backups seguros
   - Data lifecycle y retención

4. Estrategia de acceso seguro:
   - Zero trust architecture aplicada
   - Least privilege access
   - Just-in-time access
   - Multi-factor authentication
   - Privileged access management
   - Boundary protection

5. Security posture y compliance monitoring:
   - Auditoría continua
   - Vulnerability scanning automatizado
   - Compliance checking
   - Security posture dashboards
   - Incident response automation

6. Seguridad operativa:
   - Processes para patching y updates
   - Secrets rotation
   - Certificate management
   - Security incident response plan
   - Runbooks de seguridad
   - SecOps y integración con DevOps

7. Seguridad específica para componentes críticos:
   - Protección para servicios de IA
   - Seguridad para almacenamiento de imágenes médicas
   - Database security controls
   - API security
   - Frontend/client security

Proporciona plantillas para políticas de seguridad, configurations as code para security controls, y un plan detallado de implementación por fases que asegure que la seguridad sea parte integral de la infraestructura desde el inicio.
```

### **2.5. Seguridad**

**Prompt 1:**
```
Como experto en seguridad de aplicaciones web, desarrolla un plan completo de seguridad para VetAI Connect, abordando:

1. Implementación detallada de autenticación JWT
2. Protección contra vulnerabilidades web comunes (XSS, CSRF, inyección SQL)
3. Seguridad en almacenamiento y transmisión de datos médicos
4. Gestión segura de acceso a APIs externas
5. Auditoría de seguridad y logging

Proporciona ejemplos concretos de implementación para los aspectos más críticos y prioriza las medidas según el contexto del proyecto.
```

**Prompt 2:**
```
Como especialista en cumplimiento normativo, desarrolla una guía para que VetAI Connect cumpla con regulaciones de privacidad y protección de datos, considerando:

1. Consentimientos necesarios para procesamiento de datos
2. Políticas de retención y eliminación de datos
3. Derechos del usuario respecto a sus datos
4. Manejo de brechas de seguridad
5. Documentación legal necesaria (términos de servicio, política de privacidad)

La guía debe ser práctica y aplicable al contexto específico de datos veterinarios e integración con IA.
```

**Prompt 3:**
```
Como experto en seguridad de APIs, desarrolla una estrategia completa para asegurar todas las comunicaciones API en VetAI Connect, incluyendo:

1. Implementación de autenticación y autorización a nivel de API
2. Rate limiting y protección contra abusos
3. Validación exhaustiva de datos de entrada
4. Manejo seguro de respuestas y errores
5. Monitoreo y alertas para actividades sospechosas

Proporciona ejemplos de implementación en NestJS y considera el balance entre seguridad y usabilidad.
```

### **2.6. Tests**

**Prompt 1:**
```
Como ingeniero de QA, desarrolla una estrategia de testing completa para VetAI Connect, incluyendo:

1. Plan de pruebas unitarias para frontend y backend
2. Estrategia para pruebas de integración entre componentes
3. Pruebas end-to-end para flujos críticos (registro, citas, diagnósticos)
4. Pruebas de rendimiento para componentes intensivos
5. Plan de QA manual para validación final

Proporciona ejemplos de tests para casos críticos y establece métricas de cobertura apropiadas considerando las limitaciones de tiempo.
```

**Prompt 2:**
```
Como especialista en testing de VueJS, desarrolla una guía específica para testing del frontend de VetAI Connect, incluyendo:

1. Configuración del entorno de testing (Jest, Vue Test Utils)
2. Estrategias para mocking de APIs y servicios externos
3. Testing de componentes complejos (formularios, visualizaciones)
4. Pruebas de integración entre componentes
5. Testing de rutas y navegación

Proporciona ejemplos prácticos para los diferentes tipos de tests y establece mejores prácticas para mantener tests mantenibles.
```

**Prompt 3:**
```
Como especialista en testing de NestJS, desarrolla una guía específica para testing del backend de VetAI Connect, incluyendo:

1. Configuración del entorno de testing (Jest, SuperTest)
2. Estrategias para mocking de servicios externos y bases de datos
3. Testing de controladores, servicios y middlewares
4. Pruebas de integración para flujos críticos
5. Testing de seguridad básico

Proporciona ejemplos prácticos para los diferentes tipos de tests y establece mejores prácticas adaptadas al contexto del proyecto.
```

---

### 3. Modelo de Datos

**Prompt 1:**
```
Como arquitecto de bases de datos PostgreSQL, diseña el modelo de datos completo para VetAI Connect, incluyendo:

1. Diagrama entidad-relación detallado con todas las entidades necesarias
2. Definición completa de cada tabla con campos, tipos, restricciones y claves
3. Justificación de relaciones y cardinalidad
4. Estrategia de indexación para consultas frecuentes
5. Consideraciones para escalabilidad y rendimiento

El modelo debe cubrir todas las funcionalidades (usuarios, mascotas, citas, historiales, diagnósticos IA) y seguir mejores prácticas de diseño de bases de datos.
```

**Prompt 2:**
```
Como experto en ORM y TypeORM, desarrolla la implementación completa del modelo de datos para VetAI Connect en NestJS, incluyendo:

1. Definición de entidades con decoradores y relaciones
2. Migraciones para creación inicial y actualizaciones
3. Repositorios personalizados para consultas complejas
4. Estrategia para manejo de transacciones
5. Seeds para datos iniciales de prueba

Proporciona el código completo para las entidades principales y explica decisiones técnicas importantes.
```

**Prompt 3:**
```
Como especialista en almacenamiento de datos en aplicaciones médicas, desarrolla una estrategia específica para el almacenamiento y manejo de historiales clínicos e imágenes en VetAI Connect, considerando:

1. Estructura óptima para almacenar historiales médicos evolutivos
2. Estrategia para almacenamiento de imágenes (en BD o sistema de archivos)
3. Métodos de consulta eficientes para recuperar historiales completos
4. Consideraciones de backup y retención de datos médicos
5. Manejo de documentos adjuntos y resultados de diagnósticos

La estrategia debe balancear rendimiento, costos y complejidad de implementación.
```

---

### 4. Especificación de la API

**Prompt 1:**
```
Como arquitecto de APIs RESTful, diseña la especificación OpenAPI completa para el backend de VetAI Connect, incluyendo:

1. Todos los endpoints organizados por recursos/módulos
2. Métodos HTTP, parámetros, body y respuestas para cada endpoint
3. Esquemas de datos detallados para request/response
4. Documentación de autenticación y autorización
5. Códigos de error y mensajes estandarizados

La API debe seguir principios REST, usar convenciones adecuadas y cubrir todas las funcionalidades del sistema.
```

**Prompt 2:**
```
Como experto en diseño de APIs para sistemas médicos, desarrolla patrones y mejores prácticas específicas para los endpoints críticos de VetAI Connect, particularmente:

1. Diseño detallado para endpoints de historiales clínicos (consulta, filtrado, actualización)
2. Patrón para endpoints relacionados con el pre-diagnóstico IA (carga de imágenes, consulta de resultados)
3. Estrategia para paginación y filtrado de grandes conjuntos de datos
4. Versionado de API y estrategia de compatibilidad
5. Optimización para reducir latencia en operaciones frecuentes

Proporciona ejemplos de implementación y justifica decisiones de diseño específicas para el contexto veterinario.
```

**Prompt 3:**
```
Como especialista en seguridad de APIs, desarrolla una guía completa de seguridad específica para la API de VetAI Connect, incluyendo:

1. Implementación detallada de autenticación JWT (emisión, validación, renovación)
2. Estrategia de autorización basada en roles y permisos granulares
3. Protección contra ataques comunes (injection, rate limiting, etc.)
4. Validación exhaustiva de datos de entrada
5. Logging de seguridad y auditoría de accesos sensibles

Proporciona ejemplos de implementación en NestJS y configuraciones específicas para maximizar la seguridad sin comprometer usabilidad.
```

---

### 5. Historias de Usuario

**Prompt 1:**
```
Como Product Owner con experiencia en sistemas médicos, desarrolla el conjunto completo de historias de usuario para VetAI Connect, organizadas por módulos y prioridad. Para cada historia incluye:

1. Título descriptivo
2. Narrativa en formato "Como [rol], quiero [acción] para [beneficio]"
3. Criterios de aceptación detallados
4. Prioridad (Must have, Should have, Could have, Won't have)
5. Estimación de esfuerzo en horas

Las historias deben ser completas, claras y suficientemente detalladas para guiar el desarrollo, considerando el tiempo total disponible de 30 horas.
```

**Prompt 2:**
```
Como Product Manager especializado en UX, desarrolla historias de usuario enfocadas específicamente en la experiencia del cliente (dueño de mascota) en VetAI Connect, detallando:

1. Journey completo desde registro hasta recepción de diagnóstico
2. Historias específicas para gestión de perfiles de mascotas
3. Historias para sistema de citas (solicitud, reprogramación, cancelación)
4. Historias para visualización de historiales clínicos
5. Historias para interacción con el sistema de pre-diagnóstico IA

Incluye criterios de aceptación detallados y screenshots o wireframes conceptuales para las interacciones más complejas.
```

**Prompt 3:**
```
Como Product Manager especializado en aplicaciones para profesionales médicos, desarrolla historias de usuario enfocadas específicamente en la experiencia del veterinario en VetAI Connect, detallando:

1. Dashboard y visualización de agenda de citas
2. Acceso y actualización de historiales clínicos
3. Visualización e interpretación de resultados de pre-diagnóstico IA
4. Registro de diagnósticos, tratamientos y seguimientos
5. Gestión de disponibilidad y horarios

Incluye criterios de aceptación detallados y considera especialmente la eficiencia de flujos de trabajo para profesionales con tiempo limitado.
```

---

### 6. Tickets de Trabajo

**Prompt 1:**
```
Como Tech Lead experimentado, convierte las historias de usuario principales de VetAI Connect en tickets de trabajo técnicos detallados para el equipo de desarrollo frontend. Para cada ticket incluye:

1. Título técnico específico
2. Descripción detallada del trabajo a realizar
3. Tareas técnicas específicas con checklist
4. Dependencias con otros tickets
5. Criterios técnicos de finalización (Definition of Done)
6. Estimación precisa en horas

Los tickets deben ser accionables, claros y con el nivel adecuado de detalle técnico para desarrolladores de nivel intermedio.
```

**Prompt 2:**
```
Como Tech Lead experimentado, convierte las historias de usuario principales de VetAI Connect en tickets de trabajo técnicos detallados para el equipo de desarrollo backend. Para cada ticket incluye:

1. Título técnico específico
2. Descripción detallada del trabajo a realizar
3. Tareas técnicas específicas con checklist
4. Dependencias con otros tickets
5. Criterios técnicos de finalización (Definition of Done)
6. Estimación precisa en horas

Los tickets deben ser accionables, claros y con el nivel adecuado de detalle técnico para desarrolladores de nivel intermedio.
```

**Prompt 3:**
```
Como DevOps Engineer, crea tickets de trabajo técnicos detallados para la configuración de infraestructura y despliegue de VetAI Connect. Para cada ticket incluye:

1. Título técnico específico
2. Descripción detallada del trabajo a realizar
3. Tareas técnicas específicas con checklist
4. Dependencias con otros tickets
5. Criterios técnicos de finalización (Definition of Done)
6. Estimación precisa en horas

Los tickets deben cubrir configuración de entornos, CI/CD, monitoreo y operaciones post-despliegue.
```

---

### 7. Pull Requests

**Prompt 1:**
```
Como senior developer y revisor de código, crea un template detallado para Pull Requests en el proyecto VetAI Connect, que incluya:

1. Estructura completa con secciones relevantes
2. Checklist de revisión específica para el contexto del proyecto
3. Criterios de aceptación técnicos
4. Consideraciones de seguridad específicas
5. Requerimientos de testing

El template debe facilitar revisiones eficientes y asegurar consistencia en la calidad del código.
```

**Prompt 2:**
```
Como líder técnico, desarrolla una guía completa de mejores prácticas para revisión de código en VetAI Connect, incluyendo:

1. Estándares de código específicos para VueJS y NestJS
2. Proceso paso a paso para revisiones efectivas
3. Enfoque en puntos críticos (seguridad, rendimiento, mantenibilidad)
4. Estrategia para manejo de feedback y resolución de discrepancias
5. Métricas para evaluar la calidad de las revisiones

La guía debe promover colaboración efectiva mientras mantiene altos estándares de calidad.
```

**Prompt 3:**
```
Como experto en calidad de software, desarrolla un conjunto de criterios de evaluación automatizados para Pull Requests en VetAI Connect, incluyendo:

1. Configuración de herramientas de análisis estático (ESLint, SonarQube)
2. Reglas específicas para el contexto del proyecto
3. Umbrales de cobertura de tests y otros métricas de calidad
4. Integración con CI/CD para validación automática
5. Estrategia para manejo de excepciones y casos especiales

La automatización debe balancear rigurosidad con practicidad para un proyecto con tiempo limitado.
```
