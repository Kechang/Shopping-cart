var cartModule = angular.module("cart", ["ui.router","ngAnimate","vsGoogleAutocomplete"]);

cartModule.directive('draggable', function(){
    return{
        restrict: 'A',
        link: function ($scope, element, attrs) {
            element[0].addEventListener('dragstart', $scope.handleDragStart, false);
            element[0].addEventListener('dragend',$scope.handleDragEnd,false);
        }
    }
});

cartModule.directive('droppable', function () {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            element[0].addEventListener('drop', $scope.handleDrop, false);
            element[0].addEventListener('dragover', $scope.handleDragOver, false);
        }
    }
});

cartModule.directive('myAddress',function(){

    return{
        restrict: 'A',
        templateUrl: 'myAddress.html',
        controller: 'cartCtrl'
    }
});


// cart service
cartModule.factory("cartService", function(){
    var cart = [];
    return{
        addToCart: function (item) {
            item.quantity++;
            for(var i = 0; i<cart.length;i++){
                if(item.id === cart[i].id){
                    cart[i].quantity = item.quantity;
                    return;
                }
            }
            cart.push(item);
        },
        getCart: function(){
            return cart;
        }

    }
});


//item service
cartModule.factory("itemService", function(){
    var items = [{id: 10001,title: "Microwave", price: 40.80,quantity: 0,linkUrl: "https://detail.tmall.com/item.htm?spm=a1z0d.6639537.1997196601.4.cwywJs&id=532166746631",city:"Arlington",weight:"10",deliTo:""},
        {id: 10002,title: "MacBook Pro Retina", price: 16088.00,quantity: 0,linkUrl: "https://detail.tmall.com/item.htm?spm=a1z0d.6639537.1997196601.26.cwywJs&id=45771116847",city:"Crystal city",weight:"10",deliTo:""},
        {id: 10003,title: "Surface Book I5 128G",price: 11088.00, quantity: 0,linkUrl: "https://detail.tmall.com/item.htm?spm=a1z0d.6639537.1997196601.15.cwywJs&id=525614504276",city:"Maryland",weight:"20",deliTo:""},
        {id: 10004, title: "Lenovo Yoga3Pro I5 4G",price: 7299.00, quantity: 0,linkUrl: "https://detail.tmall.com/item.htm?spm=a1z0d.6639537.1997196601.37.cwywJs&id=41541519814",city:"DC",weight:"30",deliTo:""} ];

    return{
        getItems: function(){
            return items;
        }
    }
});

cartModule.controller('cartCtrl', function ($scope, cartService) {

    $scope.discount = 0.9;
    $scope.appear = true;
    $scope.items = cartService.getCart();

    $scope.options = {
        types: ['(cities)'],
        componentRestrictions: { country:'FR'}
    };

    $scope.address = {
        name: '',
        place: '',
        components: {
            placeId: '',
            streetNumber: '',
            street: '',
            city: '',
            state: '',
            countryCode: '',
            country: '',
            postCode: '',
            district: '',
            location: {
                lat: '',
                long: ''
            }
        }
    };

    $scope.add = function (id) {
        angular.forEach($scope.items, function (item, index, array) {
            if (item.id === id) {item.quantity++;} })
    };
    $scope.reduce = function (id) {
        angular.forEach($scope.items, function (item, index, array) {
            if (item.id === id)
            {
                item.quantity--;
                if(item.quantity <= 0){
                    $scope.items.splice(index, 1);
                    return;
                }
            }
        })
    };

    //输入框添加keydown事件，避免输入非正整数
    $scope.quantityKeydown = function (event) {
        event = event || window.event;
        var target=event.target||event.srcElement;
        var keycode = event.keyCode;
        if ((37 <= keycode && keycode <= 40)||(48 <= keycode && keycode <= 57) || (96 <= keycode && keycode <= 105) || keycode == 8) {
            //方向键↑→ ↓←、数字键、backspace
        }
        else {
            console.log(keycode);
            event.preventDefault();
            return false;
        }
    };
    //keyup事件，当输入数字为0时，重新刷新文本框内容
    $scope.quantityKeyup = function (event) {
        event = event || window.event;
        var target=event.target||event.srcElement;
        var keycode = event.keyCode;
        if (48 === keycode || 96 === keycode ) {
            target.value=parseInt(target.value);
        }};
    //删除商品
    $scope.delete = function (id) {
        $scope.items.forEach(function (item, index) {
            if (item.id == id) {
                if (confirm("确定要从购物车中删除此商品？")) {
                    item.quantity = 0;
                    $scope.items.splice(index, 1);
                    return;
                }
            }
        })
    };
    //计算已选商品数量
    $scope.getQuantites = function () {
        var quantities = 0;
        angular.forEach($scope.items, function (item, index, array) {
            if (item.quantity) {
                quantities += parseInt(item.quantity);
            }
        });
        return quantities;
    };
    //计算合计总金额
    $scope.getTotalAmount = function () {
        var totalAmount = 0;
        var totalQuantity = 0;
        angular.forEach($scope.items, function (item, index, array) {
            totalAmount += item.quantity * item.price;
            totalQuantity += item.quantity;
        });
        if(totalQuantity < 10){
            totalAmount += 20;
        }

        return totalAmount;
    };

    $scope.submitToPay = function () {
            alert("Shopping Happy!");
    }
});




cartModule.controller('shopCtrl',function ($scope, itemService, cartService) {
    $scope.items = itemService.getItems();
    $scope.addToCart = function(item) {
        cartService.addToCart(item);
    }
    // Drag and Drop
    $scope.itemdrops=[];
    $scope.handleDragStart = function(e){
        this.style.opacity = '0.4';
        e.dataTransfer.setData('text', e.target.id);
    };

    $scope.handleDragEnd = function(e){
        this.style.opacity = '1.0';
    };

    $scope.handleDrop = function(e){
        e.preventDefault();
        e.stopPropagation();
        var dataText = e.dataTransfer.getData('text');

        $scope.$apply(function() {
            for(var index = 0; index < $scope.items.length; index++){
                if(parseInt(dataText) === $scope.items[index].id){
                    $scope.itemdrops.push($scope.items[index]);
                    if(confirm("Are you going to add " + $scope.items[index].title + " to cart?"))
                    cartService.addToCart($scope.items[index]);
                }
            }

        });

    };

    $scope.handleDragOver = function (e) {
        e.preventDefault(); // Necessary. Allows us to drop.
        e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
        return false;
    };

});




