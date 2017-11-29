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
'sap/ui/core/mvc/Controller',
'sap/ui/model/Filter',
'sap/m/MessageBox'
], function(MessagePopover, MessagePopoverItem, Link, jQuery, Fragment, Controller, JSONModel, AnnotationHelper, Popover, Button, Dialog,Filter,MessageBox) {
		"use strict";
	var usersTo = [];
	var multiUserTo = [];
	var usersInf = [];
	var multiUserInf = [];
	var attachFiles = [];
	var imgData = "";
	var sDate;
	var sTime;
	var payFormType;
	var exTarih;
	var inTarih;
	var oInstallments = [];
	var imgData = "";
	var vendorModel = new sap.ui.model.json.JSONModel();
	var searchVendorModel = new sap.ui.model.json.JSONModel();
	var selectsSupp = [];
	var selectsRel = [];
	var oModel = new sap.ui.model.json.JSONModel();
	var selectItem;
	
	var vUSD;
	var sKur;
	var sDate;

	var unamePas;
	var arrayUserPas;
	var username;
	var password;

	
	var CController = Controller.extend("zn11_expense.controller.Payment", {
				model: new sap.ui.model.json.JSONModel(),

		onInit: function() {
			unamePas = atob(window.localStorage["unamePas"]);
			arrayUserPas = unamePas.split(":");
			username = arrayUserPas[0];
			password = arrayUserPas[1];
			/*var array = document.cookie.split(";");
			var usernamePassword = (atob(array[1])).split(":");
			username = usernamePassword[0];
			password = usernamePassword[1];*/
			
			var that = this;
			debugger;
			//begin of startdata personel department cekme
			try{
				var persData = jQuery.ajax({
	                type : "GET",
	                contentType : "application/json",
	                url : "/RESTAdapter/b2b/SearchHelp/PERNR=0417&PERSONEL",
	                dataType : "json",
	                async: false, 
	                success : function(data,textStatus, jqXHR) {
	                }

	            });
	    		var personelData = persData.responseJSON.T_RESULT.item.STRING;
	    		
	    		
	    		 var arrayPers = personelData.split('@');
	    		 var department = arrayPers[2];
	    		 
	    		 that.getView().byId('PayrequestOwner').setValue(arrayPers[0] + " " + arrayPers[1]);
	    		 that.getView().byId('Paydepartment').setValue(arrayPers[2]);
	    		 //oThat.getView().byId('requestNum').setValue(arrayPers[0]);
	    		 that.getView().byId('Paytitle').setValue(arrayPers[3]);
				
				//end of ycoskun
	    		 
	    		  
					//supplier search help begin of 
	    		 
			        var jsonResult;
			        var aData = jQuery.ajax({
			            type : "GET",
			            contentType : "application/json",
			            url : "/RESTAdapter/b2b/SearchHelp/NAME1*&VENDOR",
			            dataType : "json",
			            async: false, 
			            success : function(data,textStatus, jqXHR) {
			            	debugger;
			            	oModel.setData({modelData : data}); 
			                console.log(data);
			                
			                for(var i = 0; i < data.T_RESULT.item.length; i++) {
			             
				                   var text = data.T_RESULT.item[i];	                    
				                   var array = text.STRING.split('@');
				                   var test = array[0]+" - "+array[1]+" - "+array[2]+" - "+array[3]+" - "+array[4];
				                   jsonResult = {STRING: test};
				                    selectsSupp.push(jsonResult);
				                    
				                		                    
				                 }	
			                
			    			console.log(selectsSupp);
			    			vendorModel.setData(selectsSupp);
			    	
			    		    
			    			

			                
			            }
			        
			        });		        
			        //end of
				
			}catch(err){
				
			}
			
			
			//begin of ycoskun Request Date otomatik getirme
   		 var today = new Date();
   		 var dd = today.getDate();
   		 var mm = today.getMonth()+1; 
   		 var yyyy = today.getFullYear();
   		 
   		 var hour = today.getHours();
   		 var min = today.getMinutes();
   		 var sec = today.getSeconds();
   		 var time = hour + ":" + min;


   		 if(dd<10) {
   		     dd = '0'+dd
   		 } 

   		 if(mm<10) {
   		     mm = '0'+mm
   		 } 

   		 today = dd + '/' + mm + '/' + yyyy;
   		 sDate = yyyy.toString()+mm.toString()+dd;
   		 sTime = hour+min+sec;
   		 that.getView().byId('PayrequestDate').setValue(today);
   		 that.getView().byId('PayrequestTime').setValue(time);
   		 //end of ycoskun	

		},
		fixedSizeDialog: null,
		onAfterRendering: function() {
					// Create a simple RadioButtonGroup with three items

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

			return this.oMessageDialog;
		},
		onAddTo: function(oEvent) {
			var oUserToDialog = this.getDialogUser();
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
		clickPayment: function() {
			var that = this;

			var selectDown = that.getView().byId("RB-Down").getSelected();

			if (selectDown === true) {
				that.getView().byId("PayType").setValue("Invoice"); //Type
				that.getView().byId("PaySubject").setValue(null); //Subject
				that.getView().byId("PayInsAmount").setValue("0"); //Installment Amount
				that.getView().byId("PayComment").setValue(null); //Comment
				//that.getView().byId("PayBudAmount").setValue("29.000"); //VAT Budget Amount
				//that.getView().byId("PayidTRY0").setValue("TRY"); //dolu
				that.getView().byId("idPayAmount").setValue("4.000"); //Payment Amount
				//that.getView().byId("idTRY1").setValue("TRY"); //dolu
				that.getView().byId("PayidAmount").setValue("200"); //VAT Amount
				that.getView().byId("PayidTax").setValue("0,00"); //Withholding Tax
				that.getView().byId("PayidIncAmount").setValue("4200"); //VAT Incl. Amount
				//that.getView().byId("idTRY2").setValue("TRY"); //dolu

			} else {
				that.getView().byId("PayType").setValue("Invoice"); //Type
				that.getView().byId("PaySubject").setValue(null); //Subject
				that.getView().byId("PayInsAmount").setValue("4200"); //Installment Amount
				that.getView().byId("PayComment").setValue(null); //Comment
				that.getView().byId("PayBudAmount").setValue("29.000"); //VAT Budget Amount
				//that.getView().byId("PayidTRY0").setValue("TRY"); //dolu
				that.getView().byId("idPayAmount").setValue("4.000"); //Payment Amount
				//that.getView().byId("idTRY1").setValue("TRY"); //dolu
				that.getView().byId("PayidAmount").setValue("200"); //VAT Amount
				that.getView().byId("PayidTax").setValue("0,00"); //Withholding Tax
				that.getView().byId("PayidIncAmount").setValue("4200"); //VAT Incl. Amount
				//that.getView().byId("idTRY2").setValue("TRY"); //dolu
					}

				},
		handleSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("FirstName", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
			},
		handleClose: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
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
				this.oAttachAddDialog = sap.ui.xmlfragment("zn11_expense.view.AttachDialogPayment", this);
				this.getView().addDependent(this.oAttachAddDialog);
			}

			return this.oAttachAddDialog;
		},
				//Attachment close butonu
		onCloseAttachDialogPayment: function(oEvent) {
			if (!this.oAttachAddDialog) {
				this.oAttachAddDialog = sap.ui.xmlfragment("zn11_expense.view.AttachDialogPayment", this.getView().getController());

			}
			var oFileUploader = sap.ui.getCore().byId("fileuploadPayment");
			oFileUploader.setValue("");
			this.oAttachAddDialog.close();
			
		
			//kac adet file eklenmiş onu ekrana gösterme
			var form = sap.ui.getCore().byId("simpleFormMessage");
			for (var m = 0; m < attachFiles.length; m++) {
			    debugger;
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

			var oFileUploader = sap.ui.getCore().byId("fileuploadPayment");
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
										debugger;
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
		onAddBudget: function() {
			var that = this;
			var onAddBudgetDialogPress = this.getDialogAddBudget();
			
			// Payment için BAF Formlarının getirilmesi begin of ycoskun
			jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "/RESTAdapter/b2b/findObject/"+username+"&BAF",
                dataType : "json",
                async: false, 
                success : function(data,textStatus, jqXHR) {
                	debugger;
                  	var JAddBafModel = new sap.ui.model.json.JSONModel();
                  	JAddBafModel.setData(data.T_BAF.item);
        			that.getView().setModel(JAddBafModel, "JAddBafModel");
        			sap.ui.getCore().byId("idAddBudgetPaymentFormTable").setModel(that.getView().getModel("JAddBafModel"));
                }

            });
			//Payment için BAF Formlarının getirilmesi end of ycoskun
	
			
	  

			onAddBudgetDialogPress.open();
		},
		getDialogAddBudget: function() {
			this.onAddBudgetDialogPress = sap.ui.xmlfragment("zn11_expense.view.AddBudgetPaymentForm", this);
			this.getView().addDependent(this.onAddBudgetDialogPress);

			return this.onAddBudgetDialogPress;
		},
		sendAcceptAction:function(){
			debugger;
			//this.onPdfExport();
			var that = this;
			var expiryDate,invoiceDate,arrayStart,count,arrayEnd;
			var exNok;
			var inNok;
			var counter;
			
			expiryDate = that.getView().byId("PayExpiryDate").getValue();
			invoiceDate = that.getView().byId("PayInvoiceDate").getValue();
			
			//date'in EN veya TR gelip gelmedğinin kontrolü begin of
			exNok = expiryDate.slice(1,2);
			inNok = invoiceDate.slice(1,2);
			if(exNok !== "."){
				exNok = expiryDate.slice(2,3);	
			}
			else{
				exNok = expiryDate.slice(1,2);
			}
			if(inNok !== "."){
				inNok = invoiceDate.slice(2,3);
			}
			else{
				inNok = invoiceDate.slice(1,2);
			}
			//end of
			if(exNok === "."){		
				arrayStart = expiryDate.split(".");
				count = arrayStart[0].length;
				if (count === 1) {
					arrayStart[0] = "0" + arrayStart[0];
					
				}
				exTarih = arrayStart[2] + arrayStart[1] + arrayStart[0];				
				
			}
			else{
				arrayStart = expiryDate.split("/");
				count = arrayStart[0].length;
				
				if(arrayStart[1] === undefined){
					
				}
				else{
					counter = arrayStart[1].length;	
				}
				if (count === 1) {
					arrayStart[0] = "0" + arrayStart[0];
					
				}
				if (counter === 1) {
					arrayStart[1] = "0" + arrayStart[1];
					
				}
				
				exTarih = "20"+arrayStart[2] + arrayStart[0] + arrayStart[1];
				
			}
			if(inNok === "."){		
							
				arrayEnd = invoiceDate.split(".");
				count = arrayEnd[0].length;
				
				if (count === 1 ) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				
				inTarih = arrayEnd[2] + arrayEnd[1] + arrayEnd[0];
				
			}
			else{				
				arrayEnd = invoiceDate.split("/");
				count = arrayEnd[0].length;
				if(arrayEnd[1] === undefined){
					
				}
				else{
					counter = arrayEnd[1].length;	
				}		
				if (count === 1) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				if (counter === 1) {
					arrayEnd[1] = "0" + arrayEnd[1];
					
				}
				inTarih = "20"+arrayEnd[2] + arrayEnd[0] + arrayEnd[1];
			}
		
			var vInstallement, vExpdt, vVatInclAmount;
			/*for (var i = 0; i < tableList.length; i++) {
				//vInstallement = tableList[i].mAggregations.cells["0"].mProperties.text;
				//vExpdt = tableList[i].mAggregations.cells["1"].mProperties.value;
				//vVatInclAmount = tableList[i].mAggregations.cells["2"].mProperties.value;
				
			}*/
				oInstallments.push({
					installement: "100",
					expdt: "20170101",
					vatInclAmount: "100"
				});
			
			console.log(oInstallments);
			

			var oHeaders;
			var oToken;
			var that = this;
	
			
	
				
			jQuery.ajax({
				  url: "/bpmodata/startprocess.svc/n11.com/dc_n11_paf_onay_pr/PaymentApprovalProcess/$metadata",
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
			var oURL = "/bpmodata/startprocess.svc/n11.com/dc_n11_paf_onay_pr/PaymentApprovalProcess/StartData/";
			
			var arrayVendor = that.getView().byId("PayVenName").getValue().split(" - ");
			
			 setTimeout(function(){	
						var oEntry = {"ProcessStartEvent": {"PaymentApproval": 
						{
							"uiAction": "",
							"comment": "",
							 "InvoiceDetails": {
							      "expiryDate": exTarih,
							      "currencyType": that.getView().byId("PayCurrencyType").getSelectedKey(),
							      "currency": that.getView().byId('PayCurrency').getValue(),
							      "invoiceNumber": that.getView().byId('PayInvoiceNum').getValue(),
							      "invoiceDate": inTarih
							 },
							 "FormDetails": {
							      "requestNumber": "",
							      "requestDate": sDate,
							      "requestTime": "",
							      "requestOwner": that.getView().byId('PayrequestOwner').getValue(),
							      "department": that.getView().byId('Paydepartment').getValue(),
							      "title": that.getView().byId('Paytitle').getValue(),
							      "status": "",
							      "paymentFormType": payFormType
							   },
							  "VendorDetails": {
							      "vendorNr": arrayVendor[0],
							      "vendorName": arrayVendor[1],
							      "vendorContact": that.getView().byId('PayConPer').getValue(),
							      "vendorVKN": that.getView().byId('PayVenTC').getValue(),
							      "vendorAddress": that.getView().byId('PayVenAdd').getValue(),
							      "vendorMail": that.getView().byId('PayVenMail').getValue(),
							      "vendorPhone": that.getView().byId('PayVenPhone').getValue(),
							      "IBAN": that.getView().byId('PayIBAN').getValue(),
							      "swiftCode": "",
							      "bankName": that.getView().byId('PayBankName').getValue()
							   },
							   "PaymentDetails": {
								  "totalAmountUSD":"100",
							      "advanceAmount": that.getView().byId('PayAdvAmount').getValue(),
							      "installmentAmount": that.getView().byId('PayInsAmount').getValue(),
							      "advanceInformation": that.getView().byId("PayAdvanceInf").getSelectedKey(),
							      "subject": that.getView().byId("PaySubject").getValue(),
							      "type": that.getView().byId("PayType").getSelectedKey(),
							      "paymentAmount": that.getView().byId('idPayAmount').getValue(),
							      "netPaymentAmount": that.getView().byId('PayNetAmount').getValue(),
							      "vatIncAmount": that.getView().byId('PayidVatIncAmount').getValue(),
							      "withholdingTax": that.getView().byId('PayidTax').getValue(),
							      "vatBudgetAmount": "",
							      "comment": that.getView().byId('PayComment').getValue(),
							      "Installment": oInstallments
							   },
							   "BudgetApprovalForm": {
							      "totalAmount": "2000",
							      "RelatedBudgetNo": [
							         {
							            "budgetNumber": "2017-BAF-4870",
							            "totalBAF":"100",
							            "usedBAF":"100",
							            "usedAmount": "100",
							            "remainAmount": "100",
							         }
							        ],
							      "Document": "2000",
							      },
							   "Attachments": {
								   "Content":imgData,
								   "FileName":"test"
							    	  
							   }
							}
							      
							  }
							};
						debugger;
						jQuery.ajax({
					        type: 'POST',
					        url: oURL,
					        data: JSON.stringify(oEntry),
					        dataType: "json",
					        headers: {
				                "X-CSRF-Token": oToken,
				                "Content-Type": "application/json"              	
				            },
					        success: function(result) {
					        	debugger;
					        	console.log(result);					 				     	
					    		var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
					    			MessageBox.success(
					    				"Form saved.",
					    				{
					    					styleClass: bCompact ? "sapUiSizeCompact" : ""
					    				}
					    			);
					    		//that.resetValue();
					        }
					    });
				 },2000);
			
		
		
		},
		onPdfExport: function() {
			var oURL = "/RESTAdapter/BudgetApproval/Attachment";
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
			 
			 setTimeout(function(){				
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
			 },1000);
			 
		},
		selectChange:function(){
			debugger;
			var oThat = this;
			var payFormType = oEvent.oSource.getSelectedItem().getText();
			console.log(payFormType);

			
			oThat.getView().byId("PayFormType").setValue(payFormType);
		

		},
		changeDate:function(){
			var that = this;
			var expiryDate,invoiceDate,arrayStart,count,arrayEnd;
			var exNok;
			var inNok;
			var counter;
			
			expiryDate = that.getView().byId("PayExpiryDate").getValue();
			invoiceDate = that.getView().byId("PayInvoiceDate").getValue();
			
			//date'in EN veya TR gelip gelmedğinin kontrolü begin of
			exNok = expiryDate.slice(1,2);
			inNok = invoiceDate.slice(1,2);
			if(exNok !== "."){
				exNok = expiryDate.slice(2,3);	
			}
			else{
				exNok = expiryDate.slice(1,2);
			}
			if(inNok !== "."){
				inNok = invoiceDate.slice(2,3);
			}
			else{
				inNok = invoiceDate.slice(1,2);
			}
			//end of
			if(exNok === "."){		
				arrayStart = expiryDate.split(".");
				count = arrayStart[0].length;
				if (count === 1) {
					arrayStart[0] = "0" + arrayStart[0];
					
				}
				exTarih = arrayStart[2] + arrayStart[1] + arrayStart[0];				
				
			}
			else{
				arrayStart = expiryDate.split("/");
				count = arrayStart[0].length;
				
				if(arrayStart[1] === undefined){
					
				}
				else{
					counter = arrayStart[1].length;	
				}
				if (count === 1) {
					arrayStart[0] = "0" + arrayStart[0];
					
				}
				if (counter === 1) {
					arrayStart[1] = "0" + arrayStart[1];
					
				}
				
				exTarih = "20"+arrayStart[2] + arrayStart[0] + arrayStart[1];
				
			}
			if(inNok === "."){		
							
				arrayEnd = invoiceDate.split(".");
				count = arrayEnd[0].length;
				
				if (count === 1 ) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				
				inTarih = arrayEnd[2] + arrayEnd[1] + arrayEnd[0];
				
			}
			else{				
				arrayEnd = invoiceDate.split("/");
				count = arrayEnd[0].length;
				if(arrayEnd[1] === undefined){
					
				}
				else{
					counter = arrayEnd[1].length;	
				}		
				if (count === 1) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				if (counter === 1) {
					arrayEnd[1] = "0" + arrayEnd[1];
					
				}
				inTarih = "20"+arrayEnd[2] + arrayEnd[0] + arrayEnd[1];
			}
			
					
		},

		onPdfExport: function() {
			debugger;
			/*var oURL = "/RESTAdapter/BudgetApproval/Attachment";
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
			 
			 setTimeout(function(){				
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
			var oURL = "/RESTAdapter/BudgetApproval/Attachment";
			var doc;

			html2canvas($('#__panel1'), {
				onrendered: function(canvas) {
					imgData = canvas.toDataURL(
						'application/pdf');
					doc = new jsPDF('1', 'mm', [242, 700]);
					doc.addImage(imgData, 'PNG', 0, 0);
					doc.save('doc.pdf');
				}
			});

		/*	setTimeout(function() {
				var FileData = {
					"MT_UI_BudgetApproval_Attachment": {
						"FileContent": imgData,
						"FileName": "doc.png"
					}
				}

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
			}, 1000);*/
			 
		},
		handleValueHelpVendor:function(){
			debugger;
			var that = this;
			var vendor;
			var vendorName;
			var jsonSearch;
			var handleClose = function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					debugger;
					var title = oSelectedItem.getTitle();
					 var array = title.split(' - ');
					 vendor = array[0];
					 vendorName = array[1];
					that.getView().byId("PayVenName").setValue(vendor+" - "+vendorName);
					
					//VENDOR bilgilerinin getirilmesi begin of ycoskun				 
					var jsonVendorResult;
			        var aDataVendor = jQuery.ajax({
			            type : "GET",
			            contentType : "application/json",
			            url : "/RESTAdapter/VendorInfo/"+vendor+"",
			            dataType : "json",
			            async: false, 
			            success : function(data,textStatus, jqXHR) {
			            	debugger;
			            	console.log(data);
			            	that.getView().byId("PayVenAdd").setValue(data.E_ADDRESS);
			            	that.getView().byId("PayVenTC").setValue(data.E_TCKN);
			            	that.getView().byId("PayVenPhone").setValue(data.E_PHONE);
			            	that.getView().byId("PayConPer").setValue(data.E_CONTACT);
			            	that.getView().byId("PayVenMail").setValue(data.E_EMAIL);
			            	that.getView().byId("PayBankName").setValue(data.E_BANK);
			            	that.getView().byId("PayIBAN").setValue(data.E_IBAN);
			            	//that.getView().byId("PaySwiftCode").setValue();
			                
				
			                
			            }
			        
			        });	
					//vendor bilgilerinin getirilmesi end of ycoskun
					
					//that.additionalInfoValidation();
				}
			};
			if (!this._valueHelpSelectVendor) {
				this._valueHelpSelectVendor = new sap.m.SelectDialog("valueHelpSelectVendor", {
					title: "Vendor",
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
					                   var array = text.STRING.split('@');
					                   var test = array[0]+" - "+array[1]+" - "+array[2]+" - "+array[3]+" - "+array[4];
					                   jsonSearch = {STRING: test};
					                   
					                   searchSupp.push(jsonSearch);
					                    
					                    
					                 }
					               
				    			console.log(searchSupp);
				    			searchVendorModel.setData(searchSupp);
				    			that._valueHelpSelectVendor.setModel(searchVendorModel);
				                
				            }
				        
				        });		        
					},
					confirm: handleClose
				});
				this._valueHelpSelectVendor.setModel(vendorModel);

			} else {
				this._valueHelpSelectVendor.setModel(vendorModel);
			}
			this._valueHelpSelectVendor.open();

		},
		formatSupp:function(value){
			debugger;	
			var suppValue;
			var array;
			
			//var suppValue;
			if (value) {	
				array = value.STRING.split('@');
				suppValue = array[0] + " - " + array[1] + " - " + array[2] + " - " + array[3] + " - " + array[4];
		
				
			
			} 
			return suppValue;
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
		                vUSD = data.E_USD;
		                oThat.getView().byId('PayCurrency').setValue(sKur);
		             
		    			
		                
		            }
		        
		        });
		
		},
		changeInvoice:function(){
			
			var that = this;
			var vInvoiceDate,arrayStart,count,arrayEnd;
			var inNok;
			var counter;
			
			vInvoiceDate = that.getView().byId("PayInvoiceDate").getValue();
			
			//date'in EN veya TR gelip gelmedğinin kontrolü begin of
			inNok = vInvoiceDate.slice(1,2);
		
			if(inNok !== "."){
				inNok = vInvoiceDate.slice(2,3);	
			}
			else{
				inNok = vInvoiceDate.slice(1,2);
			}
	
			//end of
			if(inNok === "."){		
				arrayStart = vInvoiceDate.split(".");
				count = arrayStart[0].length;
				if (count === 1) {
					arrayStart[0] = "0" + arrayStart[0];
					
				}
				inTarih = arrayStart[2] + arrayStart[1] + arrayStart[0];				
				
			}
			else{
				arrayStart = vInvoiceDate.split("/");
				count = arrayStart[0].length;
				
				if(arrayStart[1] === undefined){
					
				}
				else{
					counter = arrayStart[1].length;	
				}
				if (count === 1) {
					arrayStart[0] = "0" + arrayStart[0];
					
				}
				if (counter === 1) {
					arrayStart[1] = "0" + arrayStart[1];
					
				}
				
				inTarih = "20"+arrayStart[2] + arrayStart[0] + arrayStart[1];
				
			}
			
			//invoice date verilip expriy date'in servis ile alınması begin of ycoskun
	        var aData = jQuery.ajax({
	            type : "GET",
	            contentType : "application/json",
	            url : "/RESTAdapter/InvoiceDate/"+inTarih,
	            dataType : "json",
	            async: false, 
	            success : function(data,textStatus, jqXHR) {
	            	debugger;
	            	oModel.setData({modelData : data}); 
	                console.log(data.E_FDATE);	                
	                that.getView().byId("PayExpiryDate").setValue(data.E_FDATE);
	            }
	        
	        });	
			
			//invoice date verilip expriy date'in servis ile alınması end of ycoskun
			
			
		}
		
	
	
	});

			return CController;

		});