/**
 * Created by Rocky on 2016/10/5.
 */
cartModule.config(function($stateProvider,$urlRouterProvider){

    $urlRouterProvider.otherwise("/items");

    $stateProvider
        .state("items",{
            templateUrl: "partials/item-list.html",
            controller: "shopCtrl"
        })
        .state("cart",{
            templateUrl: "partials/cart-list.html",
            controller: "cartCtrl"
        })


});


cartModule.controller("HeaderCtrl",function($scope,$location){
    $scope.appDetails = {};
    $scope.appDetails.title = "ShoppingCart";
    $scope.appDetails.tagline = "We have four furniture for you";
    $scope.nav = {};
    $scope.nav.isActive = function(path){
        if(path === $location.path()){
            return true;
        }
        return false;
    }
});






