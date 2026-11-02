# Juan Barista — Sitio web

Repositorio preparado a partir del paquete entregado.

## Archivos principales
- `juan_barista_landing_carrito_blog.html`: página principal con carrito y acceso al blog.
- `juan_barista_tienda.html`: tienda.
- `blog-cafe-libros.html`: artículo del blog.
- `juan_barista_cafe_origen_detalles.html`: página de detalle de café.
- `juan_barista_camisa_detalles.html`: página de detalle de camisa.
- `blog-cafe-libros-01.png`, `blog-cafe-libros-02.png`, `blog-cafe-libros-03.png`: imágenes del artículo.
- `CRM_Juan_Barista.gs`: código de Google Apps Script para el formulario/CRM.

## Cómo abrir localmente
1. Descarga o clona este repositorio.
2. Mantén todos los HTML e imágenes en la misma carpeta (la estructura actual conserva las rutas relativas).
3. Abre `juan_barista_landing_carrito_blog.html` en el navegador.

## Publicación
Puedes activar GitHub Pages desde **Settings → Pages**. Para un sitio estático, selecciona la rama `main` y la carpeta `/ (root)`. La página de inicio de GitHub Pages normalmente busca `index.html`; si quieres usar la landing como portada, renómbrala a `index.html` o crea un `index.html` que la enlace.

## CRM / Apps Script
`CRM_Juan_Barista.gs` se ejecuta en Google Apps Script y no forma parte del hosting estático. Revisa el despliegue y los permisos del endpoint antes de publicar el sitio. No agregues contraseñas, tokens privados ni credenciales al repositorio.

## Nota
Este repositorio contiene archivos HTML/CSS/JS de la versión entregada. El carrito es front-end; no representa por sí solo un checkout o procesamiento de pagos.
