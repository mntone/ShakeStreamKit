[English](//github.com/mntone/shake-streamkit/blob/main/README-en.md) | 日本語

# Shake StreamKit

Shake StreamKitは、Nintendo Switchの人気ゲーム「スプラトゥーン3」のサーモンランNEXT WAVEからリアルタイム情報を表示するために設計されたストリーマーやビデオ制作者向けのオーバーレイツールです。

## 目次

* [機能](#機能)
* [インストール](#インストール)
* [使用方法](#使用方法)
* [貢献について](#貢献について)
* [ライセンス](#ライセンス)
* [連絡先](#連絡先)
* [謝辞](#謝辞)
* [著者](#著者)
* [関連プロジェクト](#関連プロジェクト)

## 機能

- **リアルタイム視覚化**  Shake StreamKitは、ShakeScouterからWebSocketを介してテレメトリーデータを受信し、詳細な情報をストリーム上に表示します。
- **ユーザーフレンドリー**  Shake StreamKitは、使いやすいユーザーインターフェースを備えています。

## インストール

プロジェクトのリポジトリを複製し、依存関係をインストールします。

```bash
git lfs clone https://github.com/mntone/shake-streamkit.git
cd shake-streamkit
npm install
```

## 使用方法

開発サーバーを起動して、プロジェクトを実行します。

```bash
npm start
```

ブラウザで以下のURLにアクセスしてください。

```
http://localhost:5173
```

## 貢献について

あなたの貢献に感謝します! バグ報告、機能要望、およびプルリクエストを自由に提出してください。

1. プロジェクトをフォークします: https://github.com/mntone/shake-streamkit/fork
2. 機能ブランチを作成します。  
   `git checkout -b feature/your-new-feature`
3. 変更をコミットします。  
   `git commit -m 'Adds feat with your new features'`
4. ブランチにプッシュします。
5. プルリクエストを開きます。

## ライセンス

このプロジェクトは GPLv3 ライセンスの下で認可されています。詳細については [LICENSE](//github.com/mntone/shake-streamkit/blob/main/LICENSE) ファイルを参照してください。

## 連絡先

質問やサポートが必要な場合は、私に連絡してください。

- Mastodon: https://mstdn.jp/@mntone

## 謝辞

- まず、スプラトゥーン3のクリエイターの方々に心から感謝します。
- [erudot](https://x.com/erudot)氏に感謝します。彼は私にサーモンランNEXT WAVEをプレイする機会を与えてくれ、でんせつ 999に到達するきっかけとなりました。
- また、このソフトウェアの開発において、ChatGPTのサポートに心から感謝いたします。

## 著者

- mntone - このプロジェクトの作成者

## 関連プロジェクト

- [ShakeScouter](//github.com/mntone/ShakeScouter): サーモンランNEXT WAVEの映像を解析し、テレメトリーデータを生成するツール
