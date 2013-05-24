$(function(){
  // Backbornモデルを継承したAddressクラスを定義
  var Address = Backbone.Model.extends({
    // デフォルト値
    defaults: {
        name: ''
    },
    // 初期化
    initialize: function(){
        if (!this.get('name')){
            this.get((name: this.defaults.name));
        }
    },
    // バリデーション
    validate: function (attributes){
        var name = attributes.name;
        if( !name || name === this.defaults.name){
            return 'Error!';
        }
    }
  });

  // Backborn.Collectionを継承したAddressCollectionクラスを定義
  var AddressCollection = Backbone.Collection.extends({
    // このコレクションを扱うモデル
    model: Address;
    // addressbook-sampleというキーでlocalStorageを扱う
    localStorage: new Store('addressbook-sample')
  });
  
  // Backborn.Viewを継承してAddressを表示する
  // AddressViewクラスを定義
  var AddressView = Backbone.View.extends({
    tagName: 'li', 
    className: 'address-item',
    // イベントハンドラの設定
    events: {
      'dbclick label.name': 'rename' ,
      'click button.delete': 'clear'
    },
    initialize: function(){
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },
    render: function(){
      $(this.el).html(
        $('<label class="name">').text(this.model.get('name'))
      ).append('<button class="delete">Delete</button>');
      return this;
    },
    rename: function(){
      var newName = window.prompt('Enter new name.', this.model.get('name'));
    },
    clear: function(){
      this.model.destroy();
    }
  });

  // インスタンスの生成
  var Addresses = new AddressCollection;
})

