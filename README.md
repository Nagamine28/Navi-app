# サービス名
アプリ名称：corgui(CornerGuide)日本語読みコーギー

<img width="150" src=assets\images\Corgui.png>

## 概要
このアプリは、曲がり角付近で動画が表示されるナビアプリです。


## メンバー
- 長嶺拓己
- 榎本祐希  
- 水野彰大
- 青柳奏汰
## 環境構築
### EXPOのinstal
- スマートフォンのアプリストアからExpo Goをインストール


### パッケージ
- githubからクローン 
- npmの最適化`npm install`
- expo-cliをインストール`npm install -g expo-cli`

### Google MAPs APIの取得
1.[Googleアカウントを作成する。](https://accounts.google.com/signup/v2/webcreateaccount?hl=ja&flowName=GlifWebSignIn&flowEntry=SignUp&nogm=true)  
2.Google Cloud Platformへ[アクセスする。](https://cloud.google.com/)  
3.プロジェクトを作成し、作成したプロジェクトを開く  
4.APIとサービスのライブラリを開く  
5.Directions APIとGeocoding APIを有効にする。  
6.APIとサービスのダッシュボードから、先ほど有効にしたAPIを選択し、認証情報タブから{認証情報を作成}をクリック。  
7.APIキーが作成されたら、キーを制限をクリックし、APIキーの制限設定画面が表示されますが、そのままの設定で、｛保存｝をクリックすると、認証情報タブに取得したAPIキー情報が表示されます。  
### envの記述
- .env.expamleを複製し名前を.envに変更
- YOUR_API_KEY_HEREを取得したAIPキーに変更する
### 起動
Expoの立ち上げコマンドをターミナルに打ちQRコードをスマホで読み込み、Expo Goで立ち上げる
`npx expo start --tunnel`

## 使用技術
- TypeScript
- Go
- Python

## アプリ内動作
### 検索機能
テキストボックスをタッチして、行きたい場所を入力し検索ボタンかEnterキーを押すと現在地から目的地までの経路が表示されます。

<img src="assets\videos\guide.gif" controls="true" width="200"></img>

### ナビゲーション
経路に沿って目的地まで移動している最、曲がり角に近づいた時動画を表示します。