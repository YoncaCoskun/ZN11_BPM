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
	var oMessageTemplate = new MessagePopoverItem({
		type: '{type}',
		title: '{title}',
		description: '{description}',
		subtitle: '{subtitle}',
		counter: '{counter}'

	});

	var oMessagePopover1 = new MessagePopover({

		items: {

			path: '/',

			template: oMessageTemplate

		}

	});

	var oMessagePopover2 = new MessagePopover({

		items: {

			path: '/',

			template: oMessageTemplate

		}

	});

	var oMessagePopover3 = new MessagePopover({

		items: {

			path: '/',

			template: oMessageTemplate

		},

		initiallyExpanded: false

	});

	var CController = Controller.extend("zn11_expense.controller.Home", {

		model: new sap.ui.model.json.JSONModel(),

		onInit: function() {},

		onItemSelect: function(oEvent) {

			var item = oEvent.getParameter('item');

			var viewId = this.getView().getId();

			sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId + "--" + item.getKey());

		},

		handleUserNamePress: function(event) {

			var popover = new Popover({

				showHeader: false,

				placement: sap.m.PlacementType.Bottom,

				content: [

					new Button({

						text: 'Feedback',

						type: sap.m.ButtonType.Transparent

					}),

					new Button({

						text: 'Help',

						type: sap.m.ButtonType.Transparent

					}),

					new Button({

						text: 'Logout',

						type: sap.m.ButtonType.Transparent

					})

				]

			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

			popover.openBy(event.getSource());

		},

		handlePopover: function(oEvent) {

			oMessagePopover1.openBy(oEvent.getSource());

		},

		onSideNavButtonPress: function() {

			var viewId = this.getView().getId();

			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");

			var sideExpanded = toolPage.getSideExpanded();

			this._setToggleButtonTooltip(sideExpanded);

			toolPage.setSideExpanded(!toolPage.getSideExpanded());

		},

		_setToggleButtonTooltip: function(bLarge) {

			var toggleButton = this.getView().byId('sideNavigationToggleButton');

			if (bLarge) {

				toggleButton.setTooltip('Large Size Navigation');

			} else {

				toggleButton.setTooltip('Small Size Navigation');

			}

		},

		onChangeEditMode: function(oEvent) {

			var oView = this.getView();

			var bFlag = !oView.byId("idCategory").getContextEditable();

			oView.byId("idProductId").setContextEditable(bFlag);

			oView.byId("idName").setContextEditable(bFlag);

			oView.byId("idCategory").setContextEditable(bFlag);

			oView.byId("idDescription").setContextEditable(bFlag);

			oView.byId("idPrice").setContextEditable(bFlag);

			oView.byId("idStatus").setContextEditable(bFlag);

			oView.byId("idQuantity").setContextEditable(bFlag);

			oView.byId("idPassword").setContextEditable(bFlag);

			oView.byId("idCreationDate").setContextEditable(bFlag);

			oView.byId("idLastChanged").setContextEditable(bFlag);

			oView.byId("idAvailableSince").setContextEditable(bFlag);

		},

		onChangeEnabledMode: function(oEvent) {

			var oView = this.getView();

			var bFlag = !oView.byId("idCategory").getEnabled();

			oView.byId("idProductId").setEnabled(bFlag);

			oView.byId("idName").setEnabled(bFlag);

			oView.byId("idCategory").setEnabled(bFlag);

			oView.byId("idDescription").setEnabled(bFlag);

			oView.byId("idPrice").setEnabled(bFlag);

			oView.byId("idStatus").setEnabled(bFlag);

			oView.byId("idQuantity").setEnabled(bFlag);

			oView.byId("idPassword").setEnabled(bFlag);

			oView.byId("idCreationDate").setEnabled(bFlag);

			oView.byId("idLastChanged").setEnabled(bFlag);

			oView.byId("idAvailableSince").setEnabled(bFlag);

		},

			btnHomeClick: function()

			{

				var navCon = this.getView().byId("navContainer");

					navCon.to(this.getView().byId("idHomePage"), "slide");

			},

		btnBudgetClick: function()

		{

			var navCon = this.getView().byId("navContainer");

			navCon.to(this.getView().byId("idBudgetPage"), "slide");

		},
		btnManBudgetClick: function()

		{

			var navCon = this.getView().byId("navContainer");

			navCon.to(this.getView().byId("idManBudgetPage"), "slide");

		},

		btnExpenseClick: function()

		{

			var navCon = this.getView().byId("navContainer");

			navCon.to(this.getView().byId("idExpensePage"), "slide");

		},

		btnPaymentClick: function()

		{

			var navCon = this.getView().byId("navContainer");

			navCon.to(this.getView().byId("idPaymentPage"), "slide");

		}

	});

	return CController;

});