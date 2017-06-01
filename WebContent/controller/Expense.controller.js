jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");

sap.ui.define([

	'sap/m/MessagePopover',

	'sap/m/MessagePopoverItem',

	'sap/m/Link',

	'jquery.sap.global',

	'sap/ui/core/Fragment',

	'sap/ui/core/mvc/Controller',

	'sap/ui/model/json/JSONModel',

	'sap/ui/model/odata/AnnotationHelper',

	'sap/m/Popover',

	'sap/m/Button'

], function(MessagePopover, MessagePopoverItem, Link, jQuery, Fragment, Controller, JSONModel, AnnotationHelper, Popover, Button) {

	"use strict";

	var CController = Controller.extend("zn11_expense.controller.Expense", {

		model: new sap.ui.model.json.JSONModel(),

		onInit: function() {

		},

		onAfterRendering: function() {

		}

	});

	return CController;

});