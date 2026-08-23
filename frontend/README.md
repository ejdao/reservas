# Reservas (Frontend)

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) version 20.3.0

## Implementación de native federation

1) Copia esta linea en el angular.json y reemplaza `example` por el nombre de tu nuevo mf.

```json
"example":{"projectType":"application","root":"projects/example","sourceRoot":"projects/example/src","prefix":"app","architect":{"build":{"builder":"@angular-architects/native-federation:build","options":{},"configurations":{"production":{"target":"example:esbuild:production"},"development":{"target":"example:esbuild:development","dev":true}},"defaultConfiguration":"production"},"serve":{"builder":"@angular-architects/native-federation:build","options":{"target":"example:serve-original:development","rebuildDelay":500,"dev":true,"cacheExternalArtifacts":false,"port":0}},"extract-i18n":{"builder":"@angular/build:extract-i18n"},"test":{"builder":"@angular/build:karma","options":{"tsConfig":"projects/example/tsconfig.spec.json","inlineStyleLanguage":"scss","assets":[{"glob":"**/*","input":"projects/example/public"}]}},"esbuild":{"builder":"@angular/build:application","options":{"browser":"projects/example/src/main.ts","tsConfig":"projects/example/tsconfig.app.json","inlineStyleLanguage":"scss","assets":[{"glob":"**/*","input":"projects/example/public"}],"polyfills":["es-module-shims"]},"configurations":{"production":{"budgets":[{"type":"initial","maximumWarning":"500kB","maximumError":"1MB"},{"type":"anyComponentStyle","maximumWarning":"4kB","maximumError":"8kB"}],"fileReplacements":[{"replace":"@environments/environment.ts","with":"@environments/environment.prod.ts"}],"outputHashing":"all"},"development":{"optimization":false,"extractLicenses":false,"sourceMap":true}},"defaultConfiguration":"production"},"serve-original":{"builder":"@angular/build:dev-server","configurations":{"production":{"buildTarget":"example:esbuild:production"},"development":{"buildTarget":"example:esbuild:development"}},"defaultConfiguration":"development","options":{"port":4199}}}}
```

2) Copia esto en el `tsconfig.json`.

```json
{ "path": "./projects/example/tsconfig.app.json" },
{ "path": "./projects/example/tsconfig.spec.json" }
```

3) Copia la carpeta `example` en `projects` y renombralo.

4) Copia en `app.routes.ts`

```javascript
{
    path: 'example',
    canActivate: [AuthoritiesGuard],
    loadChildren: () => loadRemoteModule('example', './mf').then((m) => m.routes),
}
```

