# TrayPulsy Skins

中文 | [English](README_EN.md)

[TrayPulsy](https://github.com/krissss/tray-pulsy) 的在线 PNG 皮肤资源仓库。

这是一个静态资源目录。TrayPulsy 会读取 `manifest.json`，从 `skins/<skin-id>/` 下载帧图片，并安装到本地。

新增或更新皮肤时，请保持 manifest 信息完整，并确认资源适合放在公开目录中。

## Manifest

`manifest.json` 使用一个精简 schema：

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

字段说明：

- `schemaVersion`：manifest 格式版本。
- `baseURL`：皮肤目录的远程基础 URL。
- `skins`：有序列表；该顺序也是皮肤目录的展示顺序。
- `id`：唯一皮肤 id、本地文件夹名，以及默认展示名称。
- `author`：资源作者或维护者。
- `source_from`：资源来源或参考 URL。
- `frames`：PNG 帧文件名，按播放顺序排列。

TrayPulsy 会按以下路径下载每一帧：

```text
{baseURL}/{id}/{frame}
```

## 皮肤目录

每个皮肤都是 `skins/` 下的一个文件夹：

```text
skins/
  example-skin/
    0.png
    1.png
    2.png
```

## 贡献皮肤

贡献一个新皮肤时：

1. 在新的 `skins/<skin-id>/` 文件夹中添加 PNG 帧图片。
2. 在 `manifest.json` 中添加一条对应记录。
3. 按播放顺序填写帧文件名。
4. 补全必要的资源信息。
5. 确认资源适合放在公开目录中。
