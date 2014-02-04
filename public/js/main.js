app.controller('FirstCtrl', function ($scope) {
    $scope.uploadComplete = function (content) {
	$scope.user = JSON.parse(content); // Presumed content is a json string!
	$scope.user.style = {
	    color: $scope.user.color,
	    "font-weight": "bold"
	};

	$scope.adname = '';
	$scope.adname.tags = '';
	$scope.adname.gpsloc = '';
	
    };

    $scope.submit = function () {
	var $scope.adobject = new Object({
	    adname: String,
	    tags: String,
	    imagepath: String,
	    gpsloc: {
		lat: number,
		lon: number
	    }
	});

	var $scope.UserSchema = new Object({
            name: String,
            ads: Array
	});

	var $scope.Account = mongoose.model('Accounts', UserSchema);
	var $scope.test = new Account({name:'Samuel', ads: [] });
	var $scope.test2 = new adobject(test.save())
    });
);
