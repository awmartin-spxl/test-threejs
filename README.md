# Three.js Plane & Cubes Scene

A minimal, vanilla-JavaScript web app that renders a three.js scene containing
a flat ground plane with several cubes sitting on it.

## Layout

- A navigation bar spans the top of the window, outside the three.js canvas,
  with a single "File" menu item.
- The three.js canvas fills the full window width below the nav bar.

## Running locally

No build step is required. Serve the directory with any static file server
and open it in a browser, e.g.:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Structure

- `index.html` — page markup, nav bar, and import map
- `style.css` — layout and styling
- `main.js` — three.js scene setup (plane, cubes, lights, camera, controls)
- `vendor/three/` — vendored copy of three.js (MIT licensed) so the app has
  no external CDN dependency
