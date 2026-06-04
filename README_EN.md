# TrayPulsy Skins

[中文](README.md) | English

Online PNG skin resources for [TrayPulsy](https://github.com/krissss/tray-pulsy).

This repository is a static asset catalog. TrayPulsy reads `manifest.json`, downloads frame images from `skins/<skin-id>/`, and installs them locally.

When adding or updating a skin, keep the manifest complete and make sure the assets are suitable for this public catalog.

## Manifest

`manifest.json` uses a minimal schema:

```json
{
  "schemaVersion": 1,
  "baseURL": "https://raw.githubusercontent.com/krissss/tray-pulsy-skins/main/skins",
  "skins": [
    {
      "id": "example-skin",
      "author": "Original Author",
      "source_from": "https://example.com/original-source",
      "frames": ["0.png", "1.png", "2.png"]
    }
  ]
}
```

Fields:

- `schemaVersion`: manifest format version.
- `baseURL`: remote base URL for skin folders.
- `skins`: ordered list; this order is the catalog display order.
- `id`: unique skin id, local folder name, and default display name.
- `author`: resource author or maintainer.
- `source_from`: resource source or reference URL.
- `frames`: PNG frame filenames, in playback order.

TrayPulsy downloads each frame as:

```text
{baseURL}/{id}/{frame}
```

## Skin Layout

Each skin is a folder under `skins/`:

```text
skins/
  example-skin/
    0.png
    1.png
    2.png
```

## Contributing

To contribute a skin:

1. Add PNG frames under a new `skins/<skin-id>/` folder.
2. Add one matching entry to `manifest.json`.
3. Keep frame filenames in playback order.
4. Fill in the required resource metadata.
5. Make sure the assets are suitable for this public catalog.
