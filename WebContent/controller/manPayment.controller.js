jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");
jQuery.sap.require("zn11_expense.util.ErrorHandler");
jQuery.sap.require("zn11_expense.util.TcmHelper");
jQuery.sap.require("zn11_expense.util.ModelBuilder");
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
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageToast',
	'sap/ui/model/Filter',
	'sap/m/MessageBox'
], function(MessagePopover, MessagePopoverItem, Link, jQuery, Fragment, Controller, JSONModel, AnnotationHelper, Popover, Button,
	ResourceModel, MessageToast, Filter,MessageBox) {
	"use strict";
    //test
	var usersTo = [];
	var budgetId = "";
	var multiUserTo = [];
	var usersInf = [];
	var multiUserInf = [];
	var attachFiles = [];
	var count = 0;
	var idNum = 0;
	var columnListItemNewLine;
	var inputArrayId = [];
	var buttonArrayId = [];
	var tableList = [];
	var oInstallments = [];
	var sDate;
	var sTime;
	var TaskInstanceID;
	var supplierModel = new sap.ui.model.json.JSONModel();
	var searchModel = new sap.ui.model.json.JSONModel();
	var oSelectedIndex;
	var oSelectedRadioText;
	//var budgetID;
	/*var budgetId;
	var department;
	var type;
	var desc;
	var subDesc;*/
	var twoEntry = [];
	var oModel = new sap.ui.model.json.JSONModel();
	var sKur;
	var selectItem;
	var imgData = "";
	var zdata = [];
	

	var unamePas;
	var arrayUserPas;
	var username;
	var password;


	var CController = Controller.extend("zn11_expense.controller.manPayment", {
		serviceUrl : "/bpmodata/taskdata.svc/",
		bpmPrefixParameter : "?prefixReservedNames=true",
		
		oDataSettings : {
			json : true,
			useBatch : false,
			disableHeadRequestForToken : true
		},
		
		model: new sap.ui.model.json.JSONModel(),
		onInit: function() {
			unamePas = atob(window.localStorage["unamePas"]);
			arrayUserPas = unamePas.split(":");
			username = arrayUserPas[0];
			password = arrayUserPas[1];
					
			debugger;
			var that = this;
			var oUserData = "";
			var usernameService =  "/RESTAdapter/b2b/SearchHelp";
			var HttpRequest = "";
			HttpRequest = new XMLHttpRequest();
			HttpRequest.onreadystatechange = function() {
			if (HttpRequest.readyState == 4 && HttpRequest.status == 200) {
			oUserData = JSON.parse(xmlHttp.responseText);
			}

			};
			HttpRequest.open( "GET", usernameService, false );
			var usernameFinal = oUserData.id
			
			console.log(usernameFinal);

			//get token begin of 
			var oHeaders;
			var oToken;

    		var aData = jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "/bpmodata/tasks.svc/TaskCollection?$filter=Status eq 'READY'",
                dataType : "json",
                headers: {"x-csrf-token": "Fetch",
					  "Authorization":"Basic "+btoa(username+":"+password)},
                async: false, 
                success : function(data,textStatus, jqXHR) {
                }

            });
    	
    		try{
    			debugger;
    			TaskInstanceID = aData.responseJSON.d.results[sap.ui.getCore().cSelectItemIndex].InstanceID;

    			
    		var serviceUrlWithPrefix = this.serviceUrl + TaskInstanceID + this.bpmPrefixParameter;
    		var odataModel = new sap.ui.model.odata.v2.ODataModel(serviceUrlWithPrefix, this.oDataSettings);
    		
            var startTypeINPUT = jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "/bpmodata/taskdata.svc/"+TaskInstanceID+"/InputData('"+TaskInstanceID+"')?$format=json&$expand=startTypeINPUT/start/DO_PaymentApproval/InvoiceDetails,startTypeINPUT/start/DO_PaymentApproval/FormDetails,startTypeINPUT/start/DO_PaymentApproval/VendorDetails,startTypeINPUT/start/DO_PaymentApproval/PaymentDetails/Installment,startTypeINPUT/start/DO_PaymentApproval/BudgetApprovalForm/RelatedBudgetNo,startTypeINPUT/start/DO_PaymentApproval/Attachments",
                dataType : "json",
                headers: {"x-csrf-token": "Fetch",
					  "Authorization":"Basic "+btoa(username+":"+password)},
                async: false, 
                success : function(data,textStatus, jqXHR) {    
    				var oODataJSONModel = new sap.ui.model.json.JSONModel(data);
                }

            });
            debugger;
            zdata = startTypeINPUT.responseJSON.d.startTypeINPUT.start;
            console.log(zdata);
        var Attachments = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.Attachments;
        var BudgetApprovalForm = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.BudgetApprovalForm;
        var FormDetails = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.FormDetails;
        var InvoiceDetails = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.InvoiceDetails;
        var PaymentDetails = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.PaymentDetails;
        var VendorDetails = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.VendorDetails;
        
        
        var uiAction = startTypeINPUT.responseJSON.d.startTypeINPUT.start.uiAction;
        
        if(uiAction !== "2" || uiAction !== "3"){
        	//Form Details
        that.getView().byId("ManPayrequestOwner").setValue(FormDetails.requestOwner);
        that.getView().byId("ManPaydepartment").setValue(FormDetails.department);
        that.getView().byId("ManPaytitle").setValue(FormDetails.title);
        that.getView().byId("ManPayrequestDate").setValue(FormDetails.requestDate);
        that.getView().byId("ManPayrequestTime").setValue(FormDetails.requestTime);
        that.getView().byId("ManPayrequestNum").setValue(FormDetails.requestNumber);
        that.getView().byId("ManPayFormType").setValue(FormDetails.paymentFormType);
        that.getView().byId("ManPaystatus").setValue(FormDetails.status);
        
        	//Invoice Details
        that.getView().byId("ManPayInvoiceDate").setValue(InvoiceDetails.invoiceDate);
        that.getView().byId("ManPayExpiryDate").setValue(InvoiceDetails.expiryDate);
        that.getView().byId("ManPayCurrencyType").setValue(InvoiceDetails.currencyType);
        that.getView().byId("ManPayCurrency").setValue(InvoiceDetails.currency);
        that.getView().byId("ManPayInvoiceNum").setValue(InvoiceDetails.invoiceNumber);
        
        	//Budget Approval Form
    	var JBafModel = new sap.ui.model.json.JSONModel();
    	JBafModel.setData(BudgetApprovalForm.RelatedBudgetNo);
		that.getView().setModel(JBafModel, "JBafModel");
		that.getView().byId("ManPayBafidTable").setModel(that.getView().getModel("JBafModel"));
		
		that.getView().byId("ManPayTotalAmount").setValue(BudgetApprovalForm.totalAmount);       
		//that.getView().byId("ManrequestDate").setValue(BudgetApprovalForm.Document);
		
			//VendorDetails
	     that.getView().byId("ManPayVenName").setValue(VendorDetails.vendorNr+" - "+VendorDetails.vendorName);
	     that.getView().byId("ManPayVenAdd").setValue(VendorDetails.vendorAddress);
	     that.getView().byId("ManPayVenTC").setValue(VendorDetails.vendorVKN);
	     that.getView().byId("ManPayVenPhone").setValue(VendorDetails.vendorPhone);
	     that.getView().byId("ManPayConPer").setValue(VendorDetails.vendorContact);     
	     that.getView().byId("ManPayVenMail").setValue(VendorDetails.vendorMail);
	     that.getView().byId("ManPayBankName").setValue(VendorDetails.bankName);
	     that.getView().byId("ManPayIBAN").setValue(VendorDetails.IBAN);
	     
	     	//Payment Details
	     that.getView().byId("ManPayType").setValue(PaymentDetails.type);
	     that.getView().byId("ManPaySubject").setValue(PaymentDetails.subject);
	     //that.getView().byId("ManPaymentType").setValue(PaymentDetails.paymentType);
	   
	     var oJsonInstallmentModel = new sap.ui.model.json.JSONModel();
	   	oJsonInstallmentModel.setData(PaymentDetails.Installment);
		that.getView().setModel(oJsonInstallmentModel, "JInstallmentModel");
		that.getView().byId("ManPayInstallementTbl").setModel(that.getView().getModel("JInstallmentModel"));
		
		 that.getView().byId("ManPayInsAmount").setValue(PaymentDetails.installmentAmount);
	     that.getView().byId("ManPayComment").setValue(PaymentDetails.comment);
	     that.getView().byId("ManidPayAmount").setValue(PaymentDetails.paymentAmount);
	     that.getView().byId("ManPayidVatAmount").setValue(PaymentDetails.vatAmount);
	     that.getView().byId("ManPayidTax").setValue(PaymentDetails.withholdingTax);
	     that.getView().byId("ManPayidVatIncAmount").setValue(PaymentDetails.vatIncAmount);
	     that.getView().byId("ManPayAdvanceInf").setValue(PaymentDetails.advanceInformation);     
	     that.getView().byId("ManPayAdvAmount").setValue(PaymentDetails.advanceAmount);
	     that.getView().byId("ManPayNetAmount").setValue(PaymentDetails.netPaymentAmount);
	     
	     debugger;
	     
        }
        
    		}
    		catch(err){
    	        that.getView().byId("ManPayrequestOwner").setValue("");
    	        that.getView().byId("ManPaydepartment").setValue("");
    	        that.getView().byId("ManPaytitle").setValue("");
    	        that.getView().byId("ManPayrequestDate").setValue("");
    	        that.getView().byId("ManPayrequestTime").setValue("");
    	        that.getView().byId("ManPayrequestNum").setValue("");
    	        that.getView().byId("ManPayFormType").setValue("");
    	        that.getView().byId("ManPaystatus").setValue("");
    	        
    	        	//Invoice Details
    	        that.getView().byId("ManPayInvoiceDate").setValue("");
    	        that.getView().byId("ManPayExpiryDate").setValue("");
    	        that.getView().byId("ManPayCurrencyType").setValue("");
    	        that.getView().byId("ManPayCurrency").setValue("");
    	        that.getView().byId("ManPayInvoiceNum").setValue("");
    	        
    	        	//Budget Approval Form
    	    	var oJsonModel = new sap.ui.model.json.JSONModel();
    			oJsonModel.setData(BudgetApprovalForm.BudgetForm);
    			console.log(BudgetApprovalForm.BudgetForm.results);
    			that.getView().setModel(oJsonModel, "JModel");
    			this.getView().byId("ManPayInstallementTbl").setModel(this.getView().getModel("JModel"));
    			
    			//that.getView().byId("ManPayTotalAmount").setValue("");       
    			//that.getView().byId("ManrequestDate").setValue(BudgetApprovalForm.Document);
    			
    				//VendorDetails
    		     that.getView().byId("ManPayVenName").setValue("");
    		     that.getView().byId("ManPayVenAdd").setValue("");
    		     that.getView().byId("ManPayVenTC").setValue("");
    		     that.getView().byId("ManPayVenPhone").setValue("");
    		     that.getView().byId("ManPayConPer").setValue("");     
    		     that.getView().byId("ManPayVenMail").setValue("");
    		     that.getView().byId("ManPayBankName").setValue("");
    		     that.getView().byId("ManPayIBAN").setValue("");
    		     
    		     	//Payment Details
    		     that.getView().byId("ManPayType").setValue("");
    		     that.getView().byId("ManPaySubject").setValue("");
    		     that.getView().byId("ManPaymentType").setValue("");
    		   
    		   	var oJsonInstallmentModel = new sap.ui.model.json.JSONModel();
    		   	oJsonInstallmentModel.setData(PaymentDetails.Installment);
    			console.log(PaymentDetails.Installment.results);
    			that.getView().setModel(oJsonInstallmentModel, "JInstallmentModel");
    			this.getView().byId("ManPayInstallementTbl").setModel(this.getView().getModel("JInstallmentModel"));
    			
    			 that.getView().byId("ManPayInsAmount").setValue("");
    		     that.getView().byId("ManPayComment").setValue("");
    		     that.getView().byId("ManidPayAmount").setValue("");
    		     that.getView().byId("ManPayidVatAmount").setValue("");
    		     that.getView().byId("ManPayidTax").setValue("");
    		     that.getView().byId("ManPayidVatIncAmount").setValue("");
    		     that.getView().byId("ManPayAdvanceInf").setValue("");     
    		     that.getView().byId("ManPayAdvAmount").setValue("");
    		     that.getView().byId("ManPayNetAmount").setValue("");
    		      
    		     
    			
    		}	        
		},		
		approveAction : function (evt) {
			debugger;
			var oHeaders;
			var oToken;
			var oTaskId = TaskInstanceID.slice(-32);
			var that = this;

			
			jQuery.ajax({
				  url: "/bpmodata/taskdata.svc/"+oTaskId+"/?prefixReservedNames=true",
				  headers: {"x-csrf-token": "Fetch",
					  "Authorization":"Basic "+btoa(username+":"+password)},
				  async: false,
				  method: 'GET'
				}).then(function(data,status,xhr) {
					  oToken = xhr.getResponseHeader('x-csrf-token');
					  oHeaders = {
								"x-csrf-token": oToken
							};
					});
			
			var oPostURL = "/bpmodata/taskdata.svc/"+oTaskId+"/SAPBPMOutputData?prefixReservedNames=true";
			
			//zdata formatını belirleme begin of
			var oEntryData = {"PaymentCompleteEventTypeOUTPUT": {"PaymentCompleteEvent": zdata
			}};

			
			oEntryData.PaymentCompleteEventTypeOUTPUT.PaymentCompleteEvent.DO_PaymentApproval.uiAction = "1";
			//end of 
			
			//ready durumundaki taskı reserved yapmak begin of 
			var tasksSvcURL = "/bpmodata/tasks.svc";
			var tasksODataModel = new sap.ui.model.odata.ODataModel(tasksSvcURL, false);
			tasksODataModel.create("/Claim?InstanceID='"+TaskInstanceID+"'", null);
			//end of
			
			
			jQuery.ajax({
		        type: 'POST',
		        url: oPostURL,
		        data: JSON.stringify(oEntryData),
		        dataType: "json",
		        headers: {
	                "X-CSRF-Token": oToken,
	                "Content-Type": "application/json"              	
	            },
		        success: function(result) {

		        	alert("success");
		        	console.log(result);
		        	tasksODataModel.refresh(true);
		        	that.onInit();
		        	that.getOwnerComponent().getRouter().navTo("Home");
					window.location.reload();
		   
		        
		        }
		    });
		},
		
		rejectAction : function (evt) {
			var that = this;
			var username,password;
			var oHeaders;
			var oToken;
			var oTaskId = TaskInstanceID.slice(-32);

			jQuery.ajax({
				  url: "/bpmodata/taskdata.svc/"+oTaskId+"/?prefixReservedNames=true",
				  headers: {"x-csrf-token": "Fetch",
					  "Authorization":"Basic "+btoa(username+":"+password)},
				  async: false,
				  method: 'GET'
				}).then(function(data,status,xhr) {
					  oToken = xhr.getResponseHeader('x-csrf-token');
					  oHeaders = {
								"x-csrf-token": oToken
							};
					});
			
			var oPostURL = "/bpmodata/taskdata.svc/"+oTaskId+"/SAPBPMOutputData?prefixReservedNames=true";
			//zdata formatını belirleme begin of
			var oEntryData = {"PaymentCompleteEventTypeOUTPUT": {"PaymentCompleteEvent": zdata
			}};
			
			oEntryData.PaymentCompleteEventTypeOUTPUT.PaymentCompleteEvent.DO_PaymentApproval.uiAction = "0";
			//end of
			
			//ready durumundaki taskı reserved yapmak begin of 
			var tasksSvcURL = "/bpmodata/tasks.svc";
			var tasksODataModel = new sap.ui.model.odata.ODataModel(tasksSvcURL, false);
			tasksODataModel.create("/Claim?InstanceID='"+TaskInstanceID+"'", null);
			//end of
			
			
			jQuery.ajax({
		        type: 'POST',
		        url: oPostURL,
		        data: JSON.stringify(oEntryData),
		        dataType: "json",
		        headers: {
	                "X-CSRF-Token": oToken,
	                "Content-Type": "application/json"              	
	            },
		        success: function(result) {	        
		        	alert("success");
		        	console.log(result);
		        	tasksODataModel.refresh(true);
		        	that.onInit();
		        	that.getOwnerComponent().getRouter().navTo("Home");
					window.location.reload();
		        
		        }
		    });
		},	
		onPdfExport: function() {
			//var oURL = "/RESTAdapter/BudgetApproval/Attachment";
			var doc;
				
			 html2canvas($('#__panel1'), {
		            onrendered: function(canvas) { 
		                 imgData = canvas.toDataURL(
		                    'application/pdf');     
		                 doc = new jsPDF('1', 'mm', [242, 700]);
		                doc.addImage(imgData, 'PNG',  0, 0);
		                doc.save('doc.pdf');
		            }
		        });
			 
			/* setTimeout(function(){				
			 var FileData = {"MT_UI_BudgetApproval_Attachment": {
			        "FileContent": imgData,
			        "FileName": "doc.png"
			    }}
				
			 jQuery.ajax({
			        type: 'POST',
			        url: oURL,
			        data: JSON.stringify(FileData),
			        dataType: "json",
			        headers: {
		                "Content-Type": "application/json"              	
		            },
			        success: function(result) {
			        	alert("Success");
			        }
			    });
			 },1000);*/
			 
		},			
		onAfterRendering: function() {
			
		},
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		oMessageDialog: null,
		bShowResetEnabled: false,
		bIsReseted: false,

		onAddMessageDialogPress: function() {
			var onAddMessageDialogPress = this.getDialogMessage();
			this.bIsReseted = false;

			onAddMessageDialogPress.open();
		},
		getDialogMessage: function() {
			this.oMessageDialog = sap.ui.xmlfragment("zn11_expense.view.AddMessageDialog", this);
			this.getView().addDependent(this.oMessageDialog);

			// 			var oModel = new JSONModel(jQuery.sap.getModulePath("zn11_expense/mockserver", "/Products.json"));
			// 			this.getView().setModel(oModel);

			return this.oMessageDialog;
		},
		onAddTo: function(oEvent) {
			/*var oUserToDialog = this.getDialogUser();
			var oUserInfDialog = this.getDialogUserInf();
			var that = this;
			var Model = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZN11_BPM_SRV");
			var oJasonModel = new sap.ui.model.json.JSONModel();

			Model.read("/UserSet", null, null, true,
				function(oData, response) {
					oJasonModel.setData(oData);
					//	console.log(oData);

				});
			that.getView().setModel(oJasonModel, "JModel");
			that.getView().setModel(oJasonModel, "JsonModel");

			var buttonId = oEvent.getSource().getId();

			if (buttonId === "addButtonTo") {
				sap.ui.getCore().byId("idUserTblTo").setModel(that.getView().getModel("JModel"));
				oUserToDialog.open();
			} else {
				sap.ui.getCore().byId("idUserTblInf").setModel(that.getView().getModel("JsonModel"));
				oUserInfDialog.open();
			}
*/
		},
		getDialogUser: function() {
			if (!this.oUserToDialog) {
				this.oUserToDialog = sap.ui.xmlfragment("zn11_expense.view.UserToDialog", this);
				this.getView().addDependent(this.oUserToDialog);
			}

			return this.oUserToDialog;
		},
		getDialogUserInf: function() {
			if (!this.oUserInfDialog) {
				this.oUserInfDialog = sap.ui.xmlfragment("zn11_expense.view.UserInfDialog", this);
				this.getView().addDependent(this.oUserInfDialog);
			}

			return this.oUserInfDialog;
		},
		onExit: function() {
			if (this.oUserToDialog) {
				this.oUserToDialog.destroy();
			}
			if (this.oUserInfDialog) {
				this.oUserInfDialog.destroy();
			}
		},
		handleSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("FirstName", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		handleClose: function(oEvent) {
			var aContexts = oEvent.getParameter("edContexts");
			var tableId = oEvent.getSource().getId();

			if (tableId === "idUserTblTo") {
				usersTo.push(aContexts.map(function(oContext) {
					return oContext.getObject().FirstName + " " + oContext.getObject().LastName;
				}).join(", "));
				for (var a = 0; a < usersTo.length; a++) {
					var userTo = usersTo[a];
					multiUserTo = userTo.split(",");
				}

				if (multiUserTo != null) {
					for (var j = 0; j < multiUserTo.length; j++) {
						var vList1 = new sap.m.StandardListItem({
							title: multiUserTo[j]
						});
						sap.ui.getCore().byId("addTbl1").addItem(vList1);
					}
					console.log(multiUserTo);
				}
			} else if (tableId === "idUserTblInf") {
				usersInf.push(aContexts.map(function(oContext) {
					return oContext.getObject().FirstName + " " + oContext.getObject().LastName;
				}).join(", "));

				for (var b = 0; b < usersInf.length; b++) {
					var userInf = usersInf[b];
					multiUserInf = userInf.split(",");
				}
				if (multiUserInf != null) {
					for (var k = 0; k < multiUserInf.length; k++) {
						var vList2 = new sap.m.StandardListItem({
							title: multiUserInf[k]
						});
						sap.ui.getCore().byId("addTbl2").addItem(vList2);
					}
					console.log(multiUserInf);
				}
			}
		},
		onCloseDialog: function() {
			this.oMessageDialog.close();
			this.oMessageDialog.destroy();
		},
		handleDelete: function(oEvent) {

			var tableId = oEvent.getSource().getId();
			//delete item

			if (tableId === "addTbl1") {
				var oList1 = sap.ui.getCore().byId("addTbl1");
				var item1 = oEvent.getParameter("listItem");
				oList1.removeItem(item1);
			} else {
				var oList2 = sap.ui.getCore().byId("addTbl2");
				var item2 = oEvent.getParameter("listItem");
				oList2.removeItem(item2);
			}

		},
		onAttachAdd: function() {
			var oAttachAddDialog = this.getDialogAttach();

			oAttachAddDialog.open();

		},
		getDialogAttach: function() {
			if (!this.oAttachAddDialog) {
				this.oAttachAddDialog = sap.ui.xmlfragment("zn11_expense.view.AttachDialogBudget", this);
				this.getView().addDependent(this.oAttachAddDialog);
			}

			return this.oAttachAddDialog;
		},

		//Attachment close butonu
		onCloseAttachDialog: function(oEvent) {
			if (!this.oAttachAddDialog) {
				this.oAttachAddDialog = sap.ui.xmlfragment("zn11_expense.view.AttachDialogBudget", this.getView().getController());

			}
			var oFileUploader = sap.ui.getCore().byId("fileupload");
			oFileUploader.setValue("");
			this.oAttachAddDialog.close();
			
		
			//kac adet file eklenmiş onu ekrana gösterme
			var form = sap.ui.getCore().byId("simpleFormMessage");
			for (var m = 0; m < attachFiles.length; m++) {
				    var oButton = new sap.ui.commons.Button({
									text: attachFiles[m].name,
									icon: "sap-icon://attachment",
									lite: true,
									width: "60%",
									id: "button"+attachFiles[m].name,
									press: function(oEvent) {
										alert("Dosyalarr!!" + oEvent.getSource().getId());
									
									}
								});
								form.addContent(oButton);
				}
					attachFiles = [];
		},
		//File Upload
		uploadFile: function() {

			var oFileUploader = sap.ui.getCore().byId("fileupload");
			var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
			var form = sap.ui.getCore().byId("simpleFormAttach");
			console.log(form);

			console.log(file);

			try {
				if (file) {
					this._bUploading = true;
					var that = this;
					/****************To Fetch CSRF Token*******************/
					var a = "/sap/opu/odata/sap/ZN11_BPM_SRV/";
					var f = {
						headers: {
							"X-Requested-With": "XMLHttpRequest",
							"Content-Type": "application/atom + xml",
							DataServiceVersion: "2.0",
							"x-csrf-token": "Fetch"
						},
						requestUri: a,
						method: "GET"
					};
					var oHeaders;
					var sUrl = "/sap/opu/odata/sap/ZN11_BPM_SRV/";
					var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
					sap.ui.getCore().setModel(oModel);
					OData.request(f, function(data, oSuccess) {
						var oToken = oSuccess.headers['x-csrf-token'];
						oHeaders = {
							"x-csrf-token": oToken,
							"slug": "QF"
						};
						/*	* * * * * * * * * * * * * * * To Fetch CSRF Token * * * * * * * * * * * * * * * * * * * /
/ * * * * * * * * * * * * * * * * * * * To Upload File * * * * * * * * * * * * * * * * * * * * * * * * */
						var oURL = "/sap/opu/odata/sap/ZN11_BPM_SRV" + "/FileSet('" + file.name + "')/$value";
						jQuery.ajax({
							type: 'PUT',
							url: oURL,
							headers: oHeaders,
							cache: false,
							contentType: file.type,
							processData: false,
							data: file,
							success: function() {
								sap.m.MessageToast.show("File Uploaded Successfully");
								oFileUploader.setValue("");
                                
                                attachFiles.push(file);
                                //attach butonları yaratma
								var oButton = new sap.ui.commons.Button({
									text: file.name,
									icon: "sap-icon://attachment",
									lite: true,
									width: "20%",
									id: "button_"+file.name,
									press: function(oEvent) {
										alert("Dosyalarr!!" + oEvent.getSource().getId());
									
									}
								});
								form.addContent(oButton);

							},
							error: function() {
								sap.m.MessageToast.show("File Upload Error!");
							}
						});
					});
				}
			} catch (oException) {
				jQuery.sap.log.error("File upload failed: \n" + oException.message);
			}
                console.log(attachFiles);
		},
		selectChange:function(oEvent){
			var oThat = this;
			var selectItem = oEvent.oSource.getSelectedItem().getText();
			console.log(selectItem);
			
			var array = selectItem.split('@');
			budgetId = array[0];
			var department = array[1];
			var type = array[2];
			var desc = array[3];
			var subDesc = array[4];
					
			
			
			oThat.getView().byId("idDepartment").setValue(department);
			oThat.getView().byId("idType").setValue(type);
			oThat.getView().byId("idDesc").setValue(desc);
			oThat.getView().byId("idSubDesc").setValue(subDesc);
			
			
			setTimeout(function(){
				oThat.byId("ManidBudget").setValue(budgetId);
			},10);
				
			
	
	
			
		},
		addListInput: function(oEvent) {
			var oThat = this;
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1;
			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = '0' + dd;
			} else {
				dd = dd.toString();
			}

			if (count !== 0) {
				mm = (mm + count);
				var newMM = mm % 12;
				var newYYYY = Math.floor(mm / 12);
				if (newMM < 10) {
					if (newMM === 0) {
						newMM = 12;
						newYYYY = newYYYY - 1;
					} else {
						newMM = '0' + newMM;
					}
				} else {
					newMM = newMM;
				}
				yyyy = yyyy + newYYYY;
				today = yyyy.toString() + newMM.toString() + dd;

			} else {
				if (mm < 10) {
					mm = '0' + mm;
				}
				today = yyyy.toString() + mm.toString() + dd;
			}

			var oDatePicker1 = new sap.ui.commons.DatePicker();
			oDatePicker1.setYyyymmdd(today);
			count = count + 1;
			idNum = idNum + 1;
			
			var buttonId = "_button" + count;
			var inputId = "_text" + count;

			columnListItemNewLine = new sap.m.ColumnListItem({
				type: sap.m.ListType.Inactive,
				unread: false,
				cells: [
					new sap.m.Label({
						text: idNum,
						editable: false
					}),
					new sap.m.Input({
						type: "Text",
						value: oDatePicker1.getValue(),
						editable: false
					}),
					new sap.m.Input({
						type: "Text",
						value: "",
						id: "_text" + count,
						liveChange: function() {
							var inputNo = 0;
							var toplam = 0;
							for (var a = 0; a < inputArrayId.length; a++) {
								var input = sap.ui.getCore().byId(inputArrayId[a]).getValue();
								inputNo = parseInt(input);
								if (inputNo > 0) {
									toplam = toplam + inputNo;
								}

							}
							console.log(toplam);
							oThat.getView().byId("idTotalAmount").setValue(toplam);
							var crrType = oThat.getView().byId("currency").getValue();
							oThat.getView().byId("totalCurrAmount").setValue(toplam * crrType);
							//var sCur = parseInt(sKur);
							//oThat.getView().byId("totalCurrAmount").setValue(toplam*sCur);
						}
					}),
					new sap.m.Button({
						icon: "sap-icon://delete",
						width: "30%",
						id: buttonId,
						press: function(oEvent) {
							
							if (oEvent.getSource().getParent().getParent().getItems().length > 0) {
								var row = oEvent.getSource().getParent().getId();
								oEvent.getSource().getParent().getParent().removeItem(row);
								count--;
								idNum--;
								var sButton = "_button" + (count);
								if (count > -1) {
									inputArrayId.splice(count, 1);
								}
								if (count > -1) {
									tableList.splice(count, 1);
								}
								if (count > -1) {
									buttonArrayId.splice(count, 1);
								}
								sap.ui.getCore().byId(sButton).setVisible(true);
							}

						},
						visible: true
					})
				]
			});
			oThat.getView().byId("mainViewTbl").addItem(columnListItemNewLine);
			tableList.push(columnListItemNewLine);
			inputArrayId.push(inputId);
			buttonArrayId.push(buttonId);
			console.log(buttonArrayId);

			//bır oncekının delete butonunu sil veya gizle
			var oncekiButton;
			if (count === 1) {
				oncekiButton = "_button" + (count);
				sap.ui.getCore().byId(oncekiButton).setVisible(true);
			} else {
				oncekiButton = "_button" + (count - 1);
				sap.ui.getCore().byId(oncekiButton).setVisible(false);
			}
			console.log(oncekiButton);

		},
		selectChangeCur:function(oEvent){
			var oThat = this;
		 selectItem = oEvent.oSource.getSelectedItem().getText();
				
		       var aData = jQuery.ajax({
		            type : "GET",
		            contentType : "application/json",
		            url : "/RESTAdapter/b2b/ExchangeRate/"+selectItem,
		            dataType : "json",
		            async: false, 
		            success : function(data,textStatus, jqXHR) {
		                oModel.setData({modelData : data}); 
		                sKur = data.E_UKURS;
		                oThat.getView().byId('currency').setValue(sKur);
		                         
		            }
		        
		        });
		},
		selectChange:function(oEvent){
			
			var oThat = this;
			var selectItem = oEvent.oSource.getSelectedItem().getText();
			console.log(selectItem);
			
			var array = selectItem.split(' - ');
			budgetId = array[0];
			var department = array[1];
			var type = array[2];
			var desc = array[3];
			var subDesc = array[4];
					
			
			
			oThat.getView().byId("ManidDepartment").setValue(department);
			oThat.getView().byId("ManidType").setValue(type);
			oThat.getView().byId("ManidDesc").setValue(desc);
			oThat.getView().byId("ManidSubDesc").setValue(subDesc);
			
			
			setTimeout(function(){
				oThat.byId("ManidBudget").setValue(budgetId);
			},10);
			
			//begin of budget id ye bağlı rem amount cekme
			try{
				var remAmountData = jQuery.ajax({
	                type : "GET",
	                contentType : "application/json",
	                url : "/RESTAdapter/b2b/RemainingBudget/"+ budgetId,
	                dataType : "json",
	                async: false, 
	                success : function(data,textStatus, jqXHR) {
	                }

	            });
	    		var remData = remAmountData.responseJSON.E_BUDGET;
	    		
	    		 oThat.getView().byId('ManremBudget').setValue(remData);
				
				//end of ycoskun
				
			}catch(err){
				
			}	
			//end of budget id ye bağlı rem amount cekme
	
	
			
		},
		handleValueHelpSupplier: function() {
			var that = this;
			var supplier;
			var handleClose = function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					
					var title = oSelectedItem.getTitle();
					 var array = title.split('@');
					 supplier = array[0];
					that.getView().byId("Mansupplier").setValue(supplier);
					//that.additionalInfoValidation();
				}
			};
			if (!this._valueHelpSelectDialogOkulAd) {
				this._valueHelpSelectDialogOkulAd = new sap.m.SelectDialog("valueHelpSelectDialogOkulAd", {
					title: "Supplier",
					items: {
						path: "/",
						sorter: "STRING",
						template: new sap.m.StandardListItem({
							title: "{STRING}",
							description: "{STRING}",
							active: true
						})
					},
					search: function(oEvent) {
						var searchSupp = [];
						var sValue = oEvent.getParameter("value");						
						//supplier search help begin of 	     
				        var aData = jQuery.ajax({
				            type : "GET",
				            contentType : "application/json",
				            url : "/RESTAdapter/b2b/SearchHelp/NAME1*"+sValue+"&VENDOR",
				            dataType : "json",
				            async: false, 
				            success : function(data,textStatus, jqXHR) {
				            
				            	oModel.setData({modelData : data}); 
				                console.log(data);
				                
				                for(var i = 0; i < data.T_RESULT.item.length; i++) {
					                   var text = data.T_RESULT.item[i];	                    
					                   searchSupp.push(text);
					                   // selectId.push(budgetId);
					                    
					                    
					                 }
					               
				    			console.log(searchSupp);
				    			searchModel.setData(searchSupp);
				    			that._valueHelpSelectDialogOkulAd.setModel(searchModel);
				                
				            }
				        
				        });		        
				        //end of
						/*var oFilter = new sap.ui.model.Filter(
							"STRING",
							sap.ui.model.FilterOperator.Contains, sValue
						);
						oEvent.getSource().getBinding("items").filter([oFilter]);*/
					},
					confirm: handleClose
				});
				this._valueHelpSelectDialogOkulAd.setModel(supplierModel);

			} else {
				this._valueHelpSelectDialogOkulAd.setModel(supplierModel);
			}
			this._valueHelpSelectDialogOkulAd.open();

			
			
		},
		sendBackAction:function(){
			var vComment = sap.ui.getCore().byId("idComment").getValue();	
			var oHeaders;
			var oToken;
			var oTaskId = TaskInstanceID.slice(-32);
			var that = this;
	
			jQuery.ajax({
				  url: "/bpmodata/taskdata.svc/"+oTaskId+"/?prefixReservedNames=true",
				  headers: {"x-csrf-token": "Fetch",
					  "Authorization":"Basic "+btoa(username+":"+password)},
				  async: false,
				  method: 'GET'
				}).then(function(data,status,xhr) {
					  oToken = xhr.getResponseHeader('x-csrf-token');
					  oHeaders = {
								"x-csrf-token": oToken
							};
					});
			
			var oPostURL = "/bpmodata/taskdata.svc/"+oTaskId+"/SAPBPMOutputData?prefixReservedNames=true";
			//zdata formatını belirleme begin of
			zdata.DO_BudgetApproval.Details.comment = vComment;
			var oEntryData = {"PersonelCompleteEventTypeOUTPUT": {"PersonelCompleteEvent": zdata
			}};		
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.UIAction = "2";
			
			//end of
			
			//ready durumundaki taskı reserved yapmak begin of 
			var tasksSvcURL = "/bpmodata/tasks.svc";
			var tasksODataModel = new sap.ui.model.odata.ODataModel(tasksSvcURL, false);
			tasksODataModel.create("/Claim?InstanceID='"+TaskInstanceID+"'", null);
			//end of
			
			
			jQuery.ajax({
		        type: 'POST',
		        url: oPostURL,
		        data: JSON.stringify(oEntryData),
		        dataType: "json",
		        headers: {
	                "X-CSRF-Token": oToken,
	                "Content-Type": "application/json"              	
	            },
		        success: function(result) {
		        	console.log(result);
		        	var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
	    			MessageBox.success(
	    				"Form sended.",
	    				{
	    					styleClass: bCompact ? "sapUiSizeCompact" : ""
	    				}
	    			);
		        	tasksODataModel.refresh(true);
		        	that.onInit();
		        	that.getOwnerComponent().getRouter().navTo("Home");
					window.location.reload();
		        	
		        	
		        
		        }
		    });	
			 this.oCommentDialog.destroy();
				if (!this.oCommentDialog) {
					this.oCommentDialog = sap.ui.xmlfragment("zn11_expense.view.Comment", this.getView().getController());

				}
				this.oCommentDialog.close();
		},
		onSendBackBtn:function(){
			if (!this.oCommentDialog) {
				this.oCommentDialog = sap.ui.xmlfragment("zn11_expense.view.Comment", this);
			}

			this.oCommentDialog.open();

			},
		oCommentDialogClose : function() {		
			this.oCommentDialog.destroy();
			this.oCommentDialog = sap.ui.xmlfragment("zn11_expense.view.Comment", this.getView().getController());
			
			this.oCommentDialog.close();
		},
		setInstallment:function(value){
			if (value) {
				var floatValue = parseFloat(value.toString().replace(/\D/g, '')).toFixed(2);
				return floatValue;
			
			} else {
				return value;
			}
		},
		TakeOpinionAction:function(){
			var that = this;
			var oHeaders;
			var oToken;
			debugger;
			var oTaskId = TaskInstanceID.slice(-32);
			
	
			jQuery.ajax({
				  url: "/bpmodata/taskdata.svc/"+oTaskId+"/?prefixReservedNames=true",
				  headers: {"x-csrf-token": "Fetch",
					  "Authorization":"Basic "+btoa(username+":"+password)},
				  async: false,
				  method: 'GET'
				}).then(function(data,status,xhr) {
					  oToken = xhr.getResponseHeader('x-csrf-token');
					  oHeaders = {
								"x-csrf-token": oToken
							};
					});
			
			var oPostURL = "/bpmodata/taskdata.svc/"+oTaskId+"/SAPBPMOutputData?prefixReservedNames=true";
			
			zdata.DO_BudgetApproval.Opinion.OpSndPerNo = sap.ui.getCore().cardId ;
			zdata.DO_BudgetApproval.Opinion.OpSndComment = sap.ui.getCore().byId("idSendComment").getValue();
			zdata.DO_BudgetApproval.Opinion.OpRcvPerNo =  sap.ui.getCore().byId("idSendUser").getValue();
			zdata.DO_BudgetApproval.Opinion.OpRcvComment =  sap.ui.getCore().byId("idReceiveComment").getValue();
			//zdata formatını belirleme begin of
			var oEntryData = {"PersonelCompleteEventTypeOUTPUT": {"PersonelCompleteEvent": zdata
			}};
			
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.UIAction = "3";
			//end of
			
			//ready durumundaki taskı reserved yapmak begin of 
			var tasksSvcURL = "/bpmodata/tasks.svc";
			var tasksODataModel = new sap.ui.model.odata.ODataModel(tasksSvcURL, false);
			tasksODataModel.create("/Claim?InstanceID='"+TaskInstanceID+"'", null);
			//end of
			
			
			jQuery.ajax({
		        type: 'POST',
		        url: oPostURL,
		        data: JSON.stringify(oEntryData),
		        dataType: "json",
		        headers: {
	                "X-CSRF-Token": oToken,
	                "Content-Type": "application/json"              	
	            },
		        success: function(result) {
		        	MessageBox.success(
		    				"Form sended.",
		    				{
		    					styleClass: bCompact ? "sapUiSizeCompact" : ""
		    				}
		    			);
		        	console.log(result);
		        	tasksODataModel.refresh(true);
		        	that.onInit();
		        	that.getOwnerComponent().getRouter().navTo("Home");
					window.location.reload();
		        
		        }
		    });
			 this.oCommentTakeODialog.destroy();
			 this.oCommentTakeODialog = sap.ui.xmlfragment("zn11_expense.view.CommentTakeO", this.getView().getController());
			
			 this.oCommentTakeODialog.close();
		},
		onTakeOpinionBtn:function(){
	
			if (!this.oCommentTakeODialog) {
				this.oCommentTakeODialog = sap.ui.xmlfragment("zn11_expense.view.CommentTakeO", this);
			}

			this.oCommentTakeODialog.open();

			},
		oCommentDialogTakeOClose : function() {		
			 this.oCommentTakeODialog.destroy();
			 this.oCommentTakeODialog = sap.ui.xmlfragment("zn11_expense.view.CommentTakeO", this.getView().getController());
			
			 this.oCommentTakeODialog.close();
		},
		btnHomeClick:function(){
			this.getOwnerComponent().getRouter().navTo("Home");
			window.location.reload();
		},
		handleUserNamePress: function(event) {
			var that = this;
			var oHeaders;

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
						type: sap.m.ButtonType.Transparent,					
						press:function(){
							debugger;
							var oToken;
							var oHeaders;
							window.localStorage.clear();
							document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });						
							that.getOwnerComponent().getRouter().navTo("Route");							
							window.location.reload();
							//document.execCommand('ClearAuthenticationCache'); 
							

							jQuery.ajax({
	    			                type : "GET",
	    			                contentType : "application/json",
	    			                url : "http://dperppo01d.n11.local:50000/bpminbox/auth?serviceName=logout",
	    			                dataType : "json",
	    			                async: false, 
	    			                success : function(data,textStatus, jqXHR) {
	    			                }

	    			            });
							
						}

					})

				]

			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

			popover.openBy(event.getSource());

		}



	});

	return CController;

});