$(function () {

    // Backbone.Modelを継承したAddressクラスを定義
    var Address = Backbone.Model.extend({
        // デフォルト値
        defaults: {
            name: ''
        },
        // 初期化
        initialize: function () {
            if (!this.get('name')) {
                this.set({name:  this.defaults.name});
            }
        },
        // バリデーション
        validate: function (attributes) {
            var name = attributes.name;
            if (!name || name === this.defaults.name) {
                return 'Error!';
            }
        }
    });

    // Backbone.Collectionを継承したAddressCollectionクラスを定義
    var AddressCollection = Backbone.Collection.extend({
        // このCollectionで扱うModel
        model: Address,
        // addressbook-sampleというキーでローカルストレージを使う
        localStorage: new Store('addressbook-sample')
    });
    // インスタンスを生成
    var Addresses = new AddressCollection;

    // Backbone.Viewを継承してAddressを表示するAddressViewクラスを定義
    var AddressView = Backbone.View.extend({
        tagName: 'li',
        className: 'address-item',
        // イベントハンドラの設定
        events: {  // ①
            'dblclick label.name': 'rename',
            'click button.delete': 'clear'
        },
        initialize: function () {
            // モデルへのバインド
            this.model.bind('change', this.render, this);   // ②
            this.model.bind('destroy', this.remove, this);  // ②
        },
        render: function () {  // ③
            $(this.el).html(
                $('<label class="name">')
                    .text(this.model.get('name'))
            ).append('<button class="delete">Delete</buton>');
            return this;
        },
        rename: function() {
            var newName = window.prompt('Enter new name.',
                this.model.get('name'));
            console.log(newName);
            this.model.save('name', newName);
        },
        clear: function () {
            this.model.destroy();
        }
    });

    // アプリケーション全体を表示するAppViewクラスを定義
    var AppView = Backbone.View.extend({
        el: $('#app'),  // ①
        events: {
            'keypress #new-address': 'keyPress',
            'click #delete-all': 'deleteAll'
        },
        initialize: function () {
            this.input = this.$('#new-address');
            // Collectionへのバインド
            Addresses.bind('add', this.add, this);
            Addresses.bind('reset', this.addAll, this);  // ②
            // モデル一覧の取得
            Addresses.fetch();  // ③
        },
        add: function (address) {
            // 引数のモデルからAddressViewを作成・描画
            var view = new AddressView({model: address});
            this.$('#list').append(view.render().el);
        },
        addAll: function () {
            Addresses.each(this.add);
        },
        keyPress: function (e) {
            if (e.keyCode === 13) {
                // Enterキーが押されたらモデルを追加する
                Addresses.create({name: this.input.val()});
                this.input.val('');
            }
        },
        deleteAll: function (e) {
            var address;
            while (address = Addresses.first()) {
                address.destroy();
            }
        }
    });
    // インスタンスを生成
    var App = new AppView;

})
