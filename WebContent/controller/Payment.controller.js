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
	'sap/m/Button',
	'jquery.sap.global',
		'sap/m/Dialog',
		'sap/m/List',
		'sap/m/StandardListItem',
		'sap/ui/core/mvc/Controller'
], function(MessagePopover, MessagePopoverItem, Link, jQuery, Fragment, Controller, JSONModel, AnnotationHelper, Popover, Button, Dialog) {
		"use strict";

		var CController = Controller.extend("zn11_expense.controller.Payment", {
				model: new sap.ui.model.json.JSONModel(),

				onInit: function() {
					var that = this;
					var Model = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZN11_BPM_SRV");
					var oJasonModel = new sap.ui.model.json.JSONModel();

					Model.read("/BudgetSet", null, null, true,
						function(oData, response) {
							oJasonModel.setData(oData);

							console.log(oData);

						});
					that.getView().setModel(oJasonModel, "JasonModel");
					this.getView().byId("idProductsTable").setModel(this.getView().getModel("JasonModel"));

				},
				fixedSizeDialog: null,
				onAfterRendering: function() {
					// Create a simple RadioButtonGroup with three items

				},
				clickPayment: function() {

					var selectDown = this.getView().byId("RB-Down").getSelected();

					if (selectDown === true) {
						this.getView().byId("idType").setValue("Invoice"); //Type
						this.getView().byId("idSubject").setValue(null); //Subject
						this.getView().byId("idInsAmount").setValue("0"); //Installment Amount
						this.getView().byId("idComment").setValue(null); //Comment
						this.getView().byId("idBudAmount").setValue("29.000"); //VAT Budget Amount
						this.getView().byId("idTRY0").setValue("TRY"); //dolu
						this.getView().byId("idPayAmount").setValue("4.000"); //Payment Amount
						this.getView().byId("idTRY1").setValue("TRY"); //dolu
						this.getView().byId("idAmount").setValue("200"); //VAT Amount
						this.getView().byId("idTax").setValue("0,00"); //Withholding Tax
						this.getView().byId("idIncAmount").setValue("4200"); //VAT Incl. Amount
						this.getView().byId("idTRY2").setValue("TRY"); //dolu

					} else {
						this.getView().byId("idType").setValue("Invoice"); //Type
						this.getView().byId("idSubject").setValue(null); //Subject
						this.getView().byId("idInsAmount").setValue("4200"); //Installment Amount
						this.getView().byId("idComment").setValue(null); //Comment
						this.getView().byId("idBudAmount").setValue("29.000"); //VAT Budget Amount
						this.getView().byId("idTRY0").setValue("TRY"); //dolu
						this.getView().byId("idPayAmount").setValue("4.000"); //Payment Amount
						this.getView().byId("idTRY1").setValue("TRY"); //dolu
						this.getView().byId("idAmount").setValue("200"); //VAT Amount
						this.getView().byId("idTax").setValue("0,00"); //Withholding Tax
						this.getView().byId("idIncAmount").setValue("4200"); //VAT Incl. Amount
						this.getView().byId("idTRY2").setValue("TRY"); //dolu
					}

				},
				onAddBudget: function() {

				// 	var oModel = new JSONModel(jQuery.sap.getModulePath("zn11_expense/mockserver", "/Products.json"));

					var oDialog;
					var oBudgetNum = new sap.ui.commons.TextField({
						value: "",
						enabled: true
					});
					var oVATAmount = new sap.ui.commons.TextField({
						value: "",
						enabled: true
					});
					var oUsedAmount = new sap.ui.commons.TextField({
						value: "",
						enabled: true
					});
					var oRemAmount = new sap.ui.commons.TextField({
						value: "",
						enabled: true

					});

					var oForm = new sap.ui.layout.form.SimpleForm({
						editable: true,
						content: [
				        new sap.ui.commons.Label({
								text: "Budget Number"
							}), oBudgetNum,
				        new sap.ui.commons.Label({
								text: "VAT Excl. Amount(TRY)"
							}), oVATAmount,
				        new sap.ui.commons.Label({
								text: "Used Amount(TRY)"
							}), oUsedAmount,
				        new sap.ui.commons.Label({
								text: "Remaining Amount(TRY)"
							}), oRemAmount
						]
					});
					oDialog = new sap.m.Dialog({
							title: "Related Budget Number",
							rightButton: new sap.m.Button({
									text: "Add",
									type: sap.m.ButtonType.Emphasized,
									icon: "sap-icon://add",
									press: function() {
										var Model = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZN11_BPM_SRV");
		
                                    var oEntry = {};
                                    oEntry.BudgetNum = oBudgetNum.getValue();
                                    oEntry.VatAmount = oVATAmount.getValue();
                                    oEntry.UsedAmount = oUsedAmount.getValue();
                                    oEntry.RemAmount = oRemAmount.getValue();
								

                                Model.create("/BudgetSet", oEntry, {
                                method: "POST",
                                success: function() {
                                           console.log("SUCCESS");
                                           
                                         },
                                error: function() {
                                           console.log("ERROR");
                                        }
                                    });
									Model.refresh(true);
								
									this.oParent.close();
										}
									}),
								leftButton: new sap.m.Button({
									text: "Close",
									type: sap.m.ButtonType.Emphasized,
									icon: "sap-icon://decline",
									press: function() {
									        this.oParent.close();
										}
									}),
								content: [oForm]
							}); oDialog.open();

					}

				});

			return CController;

		});