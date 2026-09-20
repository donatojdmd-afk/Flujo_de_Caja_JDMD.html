# Corrección de alertas

Se agregó `alert-focus.js` para que las alertas puedan desplazar y resaltar exactamente la sección relacionada.

Para activarlo en `index.html`, agrega antes de `</body>`:

```html
<script src="alert-focus.js"></script>
```

Las alertas deben llamar a:

```js
goAlertExact('flujo', mes, 'Gastos');
goAlertExact('flujo', mes, 'Deudas');
goAlertExact('flujo', mes, 'Liquidez');
goAlertExact('deudas', mes, 'Deudas', nombreDeuda);
```

El script es compatible con `switchTab()` y `setFlowView()` existentes.
