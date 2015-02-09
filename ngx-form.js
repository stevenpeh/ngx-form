var ngFormModule = angular.module('ngxFormModule', []);

ngFormModule.factory('ngxFormTemplateEngine', function() {
	var templateEngine = {
		inputLabelWrapperPrefix: 
			"<div class='row form-group'><div class='col-md-{{labelsize}}'>" +
			"<label for='{{prop}}' class='control-label {{#if required}}required{{/if}}'>" + 
			"{{proplabel}}</label></div>" +
			"<div class='col-md-{{inputsize}} input-group'>", 

		inputLabelWrapperSuffix:  "</div>" + 
			"{{#if required}}<span class='form-error col-md-{{errorsize}}' " + 
			" ng-show='{{formname}}.{{prop}}.$error.required'>" +
			"* This is a required field</span><br/>{{/if}}" +
			"<span class='form-error col-md-{{errorsize}}' " + 
			" ng-show='!({{formname}}.{{prop}}.$valid)'>" +
			"* This field has invalid values</span>" +
			"</div>",

		// compile all our handlebar templates
		init : function() {
			this.inputHiddenTempl = Handlebars.compile(
				"<div class='row form-group'>" +
				"<input id='{{prop}}' type='hidden' name='{{prop}}' class='form-control' " + 
					"ng-model='{{model}}.{{prop}}'></input>" +
				"</div>");

			this.inputTextTempl = Handlebars.compile(
				this.inputLabelWrapperPrefix + 
				"<input id='{{prop}}' type='text' name='{{prop}}' class='form-control' " + 
					"ng-model='{{model}}.{{prop}}' " + 
					"{{#if required}}required{{/if}}></input>" +
				this.inputLabelWrapperSuffix);

			this.inputTextAreaTempl = Handlebars.compile(
				this.inputLabelWrapperPrefix + 
				"<textarea id='{{prop}}' rows='5' name='{{prop}}' class='form-control' " + 
					"ng-model='{{model}}.{{prop}}' " + 
					"{{#if required}}required{{/if}}></textarea>" +
				this.inputLabelWrapperSuffix);

			this.inputBooleanTempl = Handlebars.compile(
				this.inputLabelWrapperPrefix + 
				"<input id='{{prop}}' name='{{prop}}' type='checkbox' " + 
					"ng-model='{{model}}.{{prop}}'></input>" +
				this.inputLabelWrapperSuffix);

			this.inputSelectTempl = Handlebars.compile(
				this.inputLabelWrapperPrefix +
				"<select id='{{prop}}' name='{{prop}}' class='form-control' ng-model='{{model}}.{{prop}}' " + 
				"{{#if required}}ng-init='{{model}}.{{prop}}={{initialvalue}}'{{/if}}>" +
				"{{#each selectList}}<option value='{{this}}' " + 
				" >{{this}}</option>{{/each}}" +
				"</select>" +
				this.inputLabelWrapperSuffix);

			this.inputEnumRadioTempl = Handlebars.compile(
				this.inputLabelWrapperPrefix +
				"<div class='row radio input-group' " +
				"{{#if required}}ng-init='{{model}}.{{prop}}={{initialvalue}}'{{/if}}>" +
				"{{#each selectList}}<div class='col-mid-{{../input-size}} input-group'>" +
				"<label><input type='radio' name='{{../prop}}' ng-model='{{../model}}.{{../prop}}' " + 
				" id='{{this}}' value='{{this}}'>" + 
				"{{this}}</label></div>{{/each}}" + 
				"</div>" + 
				this.inputLabelWrapperSuffix);

			this.inputDateTempl = Handlebars.compile(
				this.inputLabelWrapperPrefix +
				"<input type='text' id='{{prop}}' name='{{prop}}' class='form-control' datepicker-popup='dd-MMM-yyyy' " +
				"{{#if required}}ng-required='true'{{/if}} is-open='{{prop}}Opened' readonly='true' " + 
				"ng-model='{{model}}.{{prop}}' " +
				" datepicker-options='{startingDay: 1}'/>" +
				"<span class='input-group-btn'><button type='button' class='form-control btn btn-default' " +
				"ng-click='$event.preventDefault();$event.stopPropagation();{{prop}}Opened = true;'>" + 
				"<i class='glyphicon glyphicon-calendar'></i></button></span>" +
				this.inputLabelWrapperSuffix);

			this.inputNumberTempl = Handlebars.compile(
				this.inputLabelWrapperPrefix + 
				"<input id='{{prop}}' type='number' name='{{prop}}' class='form-control' " + 
					"ng-model='{{model}}.{{prop}}' " + 
					"{{#if required}}required{{/if}} " + 
					"{{#if min}}min='{{min}}'{{/if}} " + 
					"{{#if max}}max='{{max}}'{{/if}} " +
					"></input>" +
				this.inputLabelWrapperSuffix);

			this.createButtonTempl = Handlebars.compile(
				"<button class='btn btn-default' ng-click='create()'>" +
					"{{#if createbuttontext}}{{createbuttontext}}" + 
					"{{else}}Create{{/if}}" +
				"</button>"
				);

			this.createWithCancelButtonTempl = Handlebars.compile(
				"<button class='btn btn-default' ng-click='update()'>" + 
				"{{#if updatebuttontext}}{{updatebuttontext}}{{else}}Update{{/if}}</button>" +
				"&nbsp;<button class='btn btn-default' ng-click='cancelUpdate()'>" +
				"{{#if cancelbuttontext}}{{cancelbuttontext}}{{else}}" + 
				"Cancel{{/if}}</button>"
				);

		},
		createInputHidden: function(parameter) {
			return templateEngine.inputHiddenTempl(parameter);
		},
		createInputText: function(parameter) {
			return templateEngine.inputTextTempl(parameter);
		}, 
		createInputTextArea: function(parameter) {
			return templateEngine.inputTextAreaTempl(parameter);
		}, 
		createInputCheckbox: function(parameter) {
			return templateEngine.inputBooleanTempl(parameter);
		},
		createInputSelect: function(parameter) {
			// always set default to first item if required is set
			if (parameter.required) {
				parameter.initialvalue = "'" + parameter.selectList[0] + "'";
			} else {
				parameter.selectList.unshift('');
			}
			return templateEngine.inputSelectTempl(parameter);
		},
		createInputEnumRadio: function(parameter) {
			if (parameter.required) {
				parameter.initialvalue = "'" + parameter.selectList[0] + "'";
			} else {
				parameter.selectList.unshift('');
			}
			return templateEngine.inputEnumRadioTempl(parameter);
		},
		createInputNumber: function(parameter) {
			return templateEngine.inputNumberTempl(parameter);
		},
		createInputDate: function(parameter) {
			return templateEngine.inputDateTempl(parameter);
		},

		createFormButtons: function(parameter) {
			if (parameter.formbuttons === "create") {
				return templateEngine.createButtonTempl(parameter);
			} else if (parameter.formbuttons === "updateWithCancel") {
				return templateEngine.createWithCancelButtonTempl(parameter);
			}
		}
	};
	templateEngine.init();
	return templateEngine;
});

ngFormModule.factory('_str', ['$window', function($window){
	var underscoreStr = $window.s;
	return underscoreStr;
}]);

ngFormModule.directive('ngxForm', ['$parse', '$compile', 'ngxFormTemplateEngine', '_str',
	function($parse, $compile, templateEngine, _str){

	return {
		restrict: 'E',
		link: function(scope, element, attrs) {
			var html, newEl, linkFn, formEl, formLinkFn, parameters;

			var loadPromise = ($parse(attrs.schema)(scope))();

			loadPromise.success(function(data, status) {
				var schema = data;
				formEl = angular.element("<form class='form-horizontal' role='form' name='" + attrs.name
					+ "''></form>");
				for (prop in schema) {
					newEl = undefined;
					parameters = {labelsize: attrs.labelsize,  selectList: schema[prop].enum,
						proplabel: _str.humanize(prop), prop: prop, inputsize: attrs.inputsize, 
						model: attrs.model, selectList: schema[prop].enum, required: schema[prop].required, 
						formname: attrs.name, errorsize: attrs.errorsize, min: schema[prop].min, 
						max: schema[prop].max};
					if (schema[prop].ngxFormHidden) {
						newEl = angular.element(templateEngine.createInputHidden(parameters));
					} else if (schema[prop].type === "String") {
						if (schema[prop].enum !== undefined && schema[prop].enum !== null && 
							schema[prop].enum.length > 0) {
							if (schema[prop].ngxFormEnumType === "radio") {
								newEl = angular.element(templateEngine.createInputEnumRadio(parameters));
							} else {
								newEl = angular.element(templateEngine.createInputSelect(parameters));
							}
						} else {
							if (schema[prop].ngxFormType === "textarea") {
								newEl = angular.element(templateEngine.createInputTextArea(parameters));
							} else {
								newEl = angular.element(templateEngine.createInputText(parameters));								
							}
						}
					} else if (schema[prop].type === "Boolean") {
						newEl = angular.element(templateEngine.createInputCheckbox(parameters));
					} else if (schema[prop].type === "Date") {
						newEl = angular.element(templateEngine.createInputDate(parameters));
					} else if (schema[prop].type === "Number") {
						newEl = angular.element(templateEngine.createInputNumber(parameters));
					}
					if (newEl !== undefined) {
						formEl.append(newEl);					
					}
				}
				newEl = angular.element(templateEngine.createFormButtons(attrs));
				formEl.append(newEl);					

				formLinkFn = $compile(formEl);
				formLinkFn(scope);
				element.append(formEl);
			});
		}
	}
}]);

ngFormModule.provider('ngxFormGenerator', function() {
	var controllers = {};

	var registerRoutes = function(modelName, routeProvider, routeMap) {
		routeProvider.
			when(controllers[modelName].defaultUrl, {
				templateUrl: 'templates/' + modelName + '_add.html',
				controller: controllers[modelName].controllerName
			}).
			when(controllers[modelName].detailUrl+ ':id', {
				templateUrl: 'templates/' +
					(routeMap && routeMap['postcreate'] ? routeMap['postcreate'] :
						 modelName + '_update.html'),
				controller: controllers[modelName].controllerName
			});		
	}

	this.$get = function() {
		console.log("ngxFormGenerator $get");
		return {};
	};

	this.createController = function(modelName, routeProvider, controllerProvider, routeMap) {
		console.log("registering controller: " + controllerName);

		var loadByIdServiceUrl = '/' + modelName + '/id/';
		var schemaServiceUrl = '/' + modelName + '/schema';
		var updateServiceUrl = '/' + modelName + '/update/';
		var newServiceUrl = '/' + modelName + "/new";

		var defaultUrl = '/' + modelName;
		var detailUrl = '/' + modelName + "/";

		var controllerName = modelName + 'Controller';

		controllers[modelName] = { controllerName: controllerName, 
			defaultUrl: defaultUrl, detailUrl: detailUrl };

		var controllerFunc = function($scope, $routeParams, $http, $location, $route) {
			var loadById = function(id) {
				$http.get(loadByIdServiceUrl + id).success(function(data, status) {
					console.log("result of " + modelName + " id:" + id, + ", results: " + data);
					$scope.formModel = data;
				});
			};

			$scope.formSchema = function() {
				console.log("loading form schema");
				return $http.get(schemaServiceUrl);
			};

			$scope.update = function() {
				console.log("updating " + modelName + " : " + $scope.formModel._id + 
					", version:" + $scope.formModel.__v);
				if ($scope.formModel._id !== undefined) {
					$http.post(updateServiceUrl + $scope.formModel._id, $scope.formModel)
						.success(function(data, status){
							loadById(data._id);
						});
				}
			}

			$scope.cancelUpdate = function() {
				$location.url(defaultUrl);
			};

			$scope.create = function() {
				console.log("creating new " + modelName + ": " + $scope.formModel);
				$http.post(newServiceUrl, $scope.formModel).success(function(data, status) {
					$location.url(detailUrl + data._id);												
				})
			};

			$scope.init = function() {
				if ($routeParams.id) {
					console.log("loading " + modelName + " id: " + $routeParams.id);
					loadById($routeParams.id);
				}
			};

			$scope.init();
		};

		// register routes
		registerRoutes(modelName, routeProvider, routeMap);

		// register controller
		controllerProvider.register(controllerName, controllerFunc)

		return {controllerName: controllers[modelName].controllerName, controllerFunc: controllerFunc};

	}; // create

});
