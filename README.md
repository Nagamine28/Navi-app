# サービス名
アプリ名称（仮）：corgui(CornerGuide)日本語読みコーギー
## 概要
これは、ソリューション開発で制作したナビアプリです。


## メンバー
- 長嶺拓己
- 榎本祐希  
- 水野彰大
- 青柳奏汰
## 環境構築


### EXPOのinstal
- スマートフォンのアプリストアからExpo Goをインストール
- 

### パッケージ
- githubからクローン 
- npmの最適化`npm install`
- expo-cliをインストール`npm install -g expo-cli`

### Google MAPs APIの取得
1.googleアカウントを作成する<https://accounts.google.com/signup/v2/webcreateaccount?hl=ja&flowName=GlifWebSignIn&flowEntry=SignUp&nogm=true>  
2.Google Cloud Platform アクセス<https://cloud.google.com/>  
3.プロジェクトを作成し、作成したプロジェクトを開く  
4.APIとサービスのライブラリを開く  
5.Directions APIとGeocoding APIを有効にする。  
6.APIとサービスのダッシュボードから、先ほど有効にしたAPIを選択し、認証情報タブから{認証情報を作成}をクリック。  
7.APIキーが作成されたら、キーを制限をクリックし、APIキーの制限設定画面が表示されますが、そのままの設定で、｛保存｝をクリックすると、認証情報タブに取得したAPIキー情報が表示されます。  
### envの記述

### 起動
Expoの立ち上げコマンドをターミナルに打ちQRコードをスマホで読み込み、Expo Goで立ち上げる
`npx expo start --tunnel`
## 使用技術
- React Naitive
- TypeScript

## アプリ内動作
### 検索
### 現在地へのフォーカス
