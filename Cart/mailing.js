/**
 * Created by 47240 on 10/4/2016.
 */
cartModule.controller('AddrCtrl', function ($scope) {
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
});

cartModule.service('taxarea', function(){
    $scope.Payammount = 0;
    this.myFunc = function(x){
        if(x === 'MD'){
            $scope.Payammount = (1+0.03)* $scope.getTotalAmount();
        }

   }
});

