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
})

