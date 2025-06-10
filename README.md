# rhythm-recruiter
# 設計方針
```
rhythm-recruiter/
├── packages/                     # 各機能モジュールをまとめる
│   ├── crawler/
│   │   ├── src/
│   │   │   │
│   │   │   │--- interface/
│   │   │   │--- infra/
│   │   │   │--- domain/
│   │   │   │--- usecase/
│   │   └── package.json          # crawlerモジュール専用のpackage.json
│   ├── summarizer/
│   ├── slack-notifier/
│   ├── orchestrator/             # Cloud Functionsのエントリーポイントなど
│   └── (core-utils/)               # 全パッケージ共通の便利機能
├── pnpm-workspace.yaml           # pnpm workspaceの設定ファイル
└── (ルートのpackage.json, tsconfig.jsonなど)
```
