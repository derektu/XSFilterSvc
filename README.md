# XSFilterSvc

提供XS選股服務的欄位資料查詢功能.

## Installation

$ npm install
$ npm run dev       # for local development, port=8888
$ pm2 start local.config.js         # for local development test for pm2
$ pm2 start server.config.js        # 如果是在203.67.19.129, 則使用這一個來deploy pm2

## API

### 查詢欄位相關資訊 

```
http://<server>/api/fields
```

回傳選股欄位清單如下. 

```
[
    {id:.., name:.., taid:.., unit:.., markets:[
        {"market":"TW","freq":"8;9;10;11;12;13;14;15;16"},
        {"market":"HK","freq":"8;9;10"},
        {"market":"CN","freq":"8;9;10"},
        {"market":"US","freq":"8;9;10"}
    ]},
]
```

欄位說明:

- id是內部代碼,
- name是欄位名稱,
- taid是欄位代碼,
- unit是單位(文字),
- markets是此欄位所支援的市場, 以及每個市場所支援的頻率. 市場目前包含TW, HK, CN, US, 
- 頻率代碼: 8(日), 9(週), 10(月), 14(季), 16(年), 11/12/13(還原日週月), 15(半年)

### 查詢欄位歷史資料

```
http://<server>/api/symboldata?symbol=<商品代碼>&freq=<頻率>&fields=<欄位代碼>&count=N
```

查詢某檔商品/某個頻率的欄位資料:

- symbol: 傳入商品代碼, 例如"2330.TW",
- freq: 查詢的頻率, 例如8(日), 9(週), 10(月), 14(季), 16(年)
- fields: 欲查詢的欄位, 請傳入欄位的名稱或是taid, 可以傳入多個(使用;分隔)
- count: 最新N筆, 如果不傳的話預設回傳20筆

回傳以下格式:

```
{
    symbol: '2330.TW',
    freq: '8',
    records: [
        {
            [
                'date': yyyymmdd,
                '欄位#1': 'value1',
                '欄位#2': 'value2'
            ]
        }
    ]
}
```

每一筆資料的格式如下:
- date: 要注意格式, for月資料, 日期會是當月的第一個交易日, 例如20220102, 20220201, for季資料, 日期固定是3/6/9/12的1日, 例如 20210301, 20210601, for 年資料, 日期固定是12月1日, 例如20211201,
- 欄位數值採用字串方式回傳, ''表示沒有資料,




