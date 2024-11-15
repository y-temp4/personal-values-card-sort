# personal-values-card-sort

## Development

```bash
$ cd functions
$ yarn install
$ yarn serve

# move to another terminal pane and...
$ cd ..
$ yarn install
$ yarn dev
```

Go to http://localhost:3000.

### 開発時の注意

- [package.json](./package.json) に記載があり、アプリケーションの実行に必要なパッケージは [functions/package.json](./functions/package.json) にも記載してください
- [DeepL 翻訳：読みながら、書きながら使える翻訳ツール](https://chrome.google.com/webstore/detail/deepl-translate-reading-w/cofdbpoegempjloogbagkncekinflcnj?hl=ja) などの拡張機能を入れていると、Firestore の読み込みに失敗することがあるため、一度オフにするなどの対応が必要かもしれないです

## Deploy

```bash
$ cd functions
$ yarn deploy
```

## License

MIT
