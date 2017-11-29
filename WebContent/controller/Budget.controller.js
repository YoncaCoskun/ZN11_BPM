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
	'sap/m/MessageBox',
	'sap/ui/commons/TextField'
], function(MessagePopover, MessagePopoverItem, Link, jQuery, Fragment, Controller, JSONModel, AnnotationHelper, Popover, Button,
	ResourceModel, MessageToast, Filter,MessageBox,TextField) {
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
	var relModel = new sap.ui.model.json.JSONModel();
	var searchModel = new sap.ui.model.json.JSONModel();
	var oSelectedRadioText;
	var oSelectedIndex;
	var vUSD;

	var twoEntry = [];
	var oModel = new sap.ui.model.json.JSONModel();
	var sKur;
	var selectItem;
	var imgData = "";
	var zdata = [];
	var selectsSupp = [];
	var selectsRel = [];
	
	var unamePas;
	var arrayUserPas;
	var username;
	var password;
	

	
	var CController = Controller.extend("zn11_expense.controller.Budget", {
		serviceUrl : "/bpmodata/taskdata.svc/",
		bpmPrefixParameter : "?prefixReservedNames=true",
		
		oDataSettings : {
			json : true,
			useBatch : false,
			disableHeadRequestForToken : true
		},

		model: new sap.ui.model.json.JSONModel(),
		onInit: function() {
			var oThat = this;
			unamePas = atob(window.localStorage["unamePas"]);
			arrayUserPas = unamePas.split(":");
			username = arrayUserPas[0];
			password = arrayUserPas[1];
			
			
			//begin of startdata personel department cekme
			try{
				var persData = jQuery.ajax({
	                type : "GET",
	                contentType : "application/json",
	                url : "/RESTAdapter/b2b/SearchHelp/PERNR="+username+"&PERSONEL",
	                dataType : "json",
	                async: false, 
	                success : function(data,textStatus, jqXHR) {
	                }

	            });
	    		var personelData = persData.responseJSON.T_RESULT.item.STRING;
	    		
	    		
	    		 var arrayPers = personelData.split('@');
	    		 var department = arrayPers[2];
	    		 
	    		 oThat.getView().byId('requestOwner').setValue(arrayPers[0] + " " + arrayPers[1]);
	    		 oThat.getView().byId('department').setValue(arrayPers[2]);
	    		 //oThat.getView().byId('requestNum').setValue(arrayPers[0]);
	    		 oThat.getView().byId('title').setValue(arrayPers[3]);
				
				//end of ycoskun
				
			}catch(err){
				
			}
			
			
			var budgetModel = new sap.ui.model.json.JSONModel();
			var budgetIdModel = new sap.ui.model.json.JSONModel();
			var selects = [];
			var selectId = [];
			var budgetId ;
		     //"http://dperppo01d.n11.local:50000/RESTAdapter/b2b/SearchHelp/DEPARTMENT="+department+"&INPUT_BUDGET_DEPARTMENT"
		        var aData = jQuery.ajax({
		            type : "GET",
		            contentType : "application/json",
		            url : "/RESTAdapter/b2b/SearchHelp/*&INPUT_BUDGET_DEPARTMENT",
		            dataType : "json",
		            async: false, 
		            success : function(data,textStatus, jqXHR) {
		                oModel.setData({modelData : data}); 
		                console.log(data);
		                
		                for(var i = 0; i < data.T_RESULT.item.length; i++) {
		                   var text = data.T_RESULT.item[i];	                    
		                    var array = text.STRING.split('@');
		                    budgetId = array[0];
		                    selects.push(array[0]+" - "+array[1]+" - "+array[2]+" - "+array[3]+" - "+array[4]);
		                   // selectId.push(budgetId);	                    		                    
		                 }		               
		                console.log(selects);
		                
		    			budgetModel.setData(selects);
		    			//budgetIdModel.setData(Id);
		    			
		    			var Budget = oThat.getView().byId("idBudget");
		    		    Budget.setModel(budgetModel, "budgetModel");
		    		    console.log(Budget);
		    		    
		    			var fText = oThat.getView().byId('idText');
		    			Budget.bindItems("budgetModel>/", fText);
		    			
		                
		            }
		        
		        });
		        
		        
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
		    			supplierModel.setData(selectsSupp);
		    	
		    		    
		    			

		                
		            }
		        
		        });		        
		        //end of
		      //supplier search help begin of 	     
		        var aData = jQuery.ajax({
		            type : "GET",
		            contentType : "application/json",
		            url : "/RESTAdapter/b2b/SearchHelp/*&RELATED_PARTY",
		            dataType : "json",
		            async: false, 
		            success : function(data,textStatus, jqXHR) {
		            	debugger;
		            	oModel.setData({modelData : data}); 
		                console.log(data);
		                
		                for(var i = 0; i < data.T_RESULT.item.length; i++) {
			                   var text = data.T_RESULT.item[i];	                    
			                    var array = text.STRING.split('@');
			                    //budgetId = array[0];	           
			                    selectsRel.push(text);
			                   // selectId.push(budgetId);	                    
			                    
			                 }
			               
		    			console.log(selectsRel);
		    			relModel.setData(selectsRel);
		                
		            }
		        
		        });		        
		        //end of
		      
		    
	    		 
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
	    		 oThat.getView().byId('requestDate').setValue(today);
	    		 oThat.getView().byId('requestTime').setValue(time);
	    		 //end of ycoskun	            
	//----------------------------------------------------------------------------------------    		 
	    		 //begin of Installements input alanlarının otomatik açılması

	 			var oThat = this;
	 			var today = new Date();
	 			var mm = today.getMonth() + 1;
	 	   		var yyyy = today.getFullYear();
	 			var monthCount = (12 - parseInt(mm)) + 1;
	 		//	var mount, year;
	 			var date;
	 			var count = 0;
	 			var inputId;
	 			var inputId2;
	 			
	 	
	 			debugger;
	 			console.log(mm);
	 			
	 			for (var k = 0; k < monthCount ; k++) {
	 				idNum = idNum + 1;
	 				count = count + 1;
	 				inputId = "_text" + count;
	 				
	 				if(mm < 10) {
	 		   		     mm = '0'+mm
	 		   		     date = mm + yyyy;
	 				}
	 				else{
	 					date = mm.toString()+ yyyy;
	 				}
	 				
	 				console.log(date);
		 			columnListItemNewLine = new sap.m.ColumnListItem({
		 				type: sap.m.ListType.Inactive,
		 				unread: false,
		 				cells: [
		 					new sap.m.Label({
		 						text: idNum,
		 						editable: false
		 					}),
		 					new sap.m.DatePicker({
		 						type: "Text",
		 						value: date,
		 						valueFormat : "MM-yyyy",
		 						displayFormat : "MM-yyyy",
		 						editable: false
		 					}),
		 					new sap.ui.commons.TextField({	
		 						value: "",
		 						id:inputId,
		 						liveChange: function(oEvent) {
		 
		 							/*var inputNo = 0;
		 							var toplam = 0;
		 								
		 								for (var a = 0; a < inputArrayId.length; a++) {	
		 									var inputId = sap.ui.getCore().byId(inputArrayId[a]);
			 								var input = inputId.mProperties.value;
		 									//var input = sap.ui.getCore().byId(inputArrayId[a]).getValue();
			 								inputNo = parseInt(input);
			 								console.log(inputNo);
			 								if (inputNo > 0) {
			 									toplam = toplam + inputNo;
			 								}								
			 								

			 							}
		 							
		 							console.log(toplam);
		 							oThat.getView().byId("idTotalAmount").setValue(toplam);
		 							var crrType = oThat.getView().byId("currency").getValue();
		 							oThat.getView().byId("totalCurrAmount").setValue(toplam * crrType);*/

		 						},
		 						change:function(oEvent){
		 							debugger;
		 							/*debugger;
		 							var inputNo = 0;
		 							var toplam = 0;
		 							for (var a = 0; a < inputArrayId.length; a++) {
		 								var input = sap.ui.getCore().byId(inputArrayId[a]).getValue();
		 								inputNo = parseInt(input);
		 								var floatInput = parseFloat(input.toString().replace(/\D/g, '')).toFixed(2);
		 								sap.ui.getCore().byId(inputArrayId[a]).setValue(floatInput); 								
		 								
		 							}		 							
		 			*/
		 							var inputNo = 0;
		 							var toplam = 0;
		 								
		 								for (var a = 0; a < inputArrayId.length; a++) {	
		 									var inputId = sap.ui.getCore().byId(inputArrayId[a]);
			 								var input = inputId.mProperties.value;
		 									//var input = sap.ui.getCore().byId(inputArrayId[a]).getValue();
			 								inputNo = parseInt(input); 
			 								
			 						
			 								if (inputNo > 0) {
			 									toplam = toplam + inputNo;
			 								}	
			 								if(input === ""){
			 									sap.ui.getCore().byId(inputArrayId[a]).setValue("");
			 								}
			 								else{
			 									var floatInput = parseFloat(inputNo.toString().replace(/\D/g, '')).toFixed(2);
				 								sap.ui.getCore().byId(inputArrayId[a]).setValue(floatInput);
			 								}
			 								
			 								

			 							}
		 							
		 							console.log(toplam);
		 							oThat.getView().byId("idTotalAmount").setValue(parseFloat(toplam.toString().replace(/\D/g, '')).toFixed(2));
		 							var crrType = oThat.getView().byId("currency").getValue();
		 							var carpim = toplam * crrType;
		 							oThat.getView().byId("totalCurrAmount").setValue(parseFloat(carpim.toString().replace(/\D/g, '')).toFixed(2));
		 						
		 						}
		 					})
		 				]
		 			});
		 			//oText.setModel(oXModel);
		 			oThat.getView().byId("mainViewTbl").addItem(columnListItemNewLine);
		 			inputArrayId.push(inputId);
		 			mm = parseInt(mm) + 1;
		 			tableList.push(columnListItemNewLine);
	 			} 			
	    		 //end of  Installements input alanlarının otomatik açılması
	//-----------------------------------------------------------------------------------------	        
		},
		
		approveAction : function (evt) {
			/*debugger;
			
			var odataModel = this.getView().getModel("odataModel");
			var jsonModel = this.getView().getModel();

			zn11_expense.util.ModelBuilder.setEdmTimeFromConvertedProperty(data);
			zn11_expense.util.ModelBuilder.removeEmptyEntitiesFromCollections(data);
			var outputData = {ManagerAppCompleteEventTypeOUTPUT : {ManagerAppCompleteEvent :  zdata }}; 

			var bundle = this.getView().getModel("i18n").getResourceBundle();
			
			var createParameters = {
				success : function() {
					// post was successful, either close window or show success message
					window.close();
					// in case close does not work due to security reasons
					
				},
				error : function(oEvent) {
					// show failure message
				}
			};
			
			odataModel.create("/SAPBPMOutputData", outputData, createParameters);	*/
		},	
    	onSaveChange: function() { 
    		/*
    		var that = this;
    		var aData = jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "/bpmodata/tasks.svc/TaskCollection?$filter=Status eq 'READY'",
                dataType : "json",
                async: false, 
                success : function(data,textStatus, jqXHR) {
                }

            });
    		TaskInstanceID = aData.responseJSON.d.results["0"].InstanceID;
            
    	
    		var serviceUrlWithPrefix = this.serviceUrl + TaskInstanceID + this.bpmPrefixParameter;
    		var odataModel = new sap.ui.model.odata.v2.ODataModel(serviceUrlWithPrefix, this.oDataSettings);
    		
            var startTypeINPUT = jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "/bpmodata/taskdata.svc/"+ TaskInstanceID +"/InputData('"+ TaskInstanceID +"')?$format=json&$expand=startTypeINPUT/start/DO_BudgetApproval/Installments/row,startTypeINPUT/start/DO_BudgetApproval/Head,startTypeINPUT/start/DO_BudgetApproval/Details,startTypeINPUT/start/DO_BudgetApproval/Amount",
                dataType : "json",
                async: false, 
                success : function(data,textStatus, jqXHR) {
      
    				var oODataJSONModel = new sap.ui.model.json.JSONModel(data);
    				oODataJSONModel.setDefaultBindingMode("TwoWay");
    				oODataJSONModel.setSizeLimit(100);
    				that.getView().setModel(oODataJSONModel);
    				// eases the access for the controller
    				that.getView().setModel(odataModel, "odataModel");
                }

            });
            zdata = startTypeINPUT.responseJSON.d.startTypeINPUT.start;
        var Amount = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Amount;
        var Head = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Head;
        var Details = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Details;
        var Installments = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Installments;
        
        that.getView().byId("idDepartment").setValue(Details.Department),
        that.getView().byId("idDesc").setValue(Details.Desc),
        that.getView().byId("idSubDesc").setValue(Details.SubDesc),
        that.getView().byId("idType").setValue(Details.Type),
        that.getView().byId("brExp").setValue(Details.brExp),
        that.getView().byId("explanation").setValue(Details.explanation),
        that.getView().byId("periodEnd").setValue(Details.periodEnd),
        that.getView().byId("periodStart").setValue(Details.periodStart),
        that.getView().byId("purpose").setValue(Details.purpose),
        that.getView().byId("remBudget").setValue(Details.remBudget),
        that.getView().byId("subject").setValue(Details.subject),
        that.getView().byId("supplier").setValue(Details.supplier)
          
            
         */   
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
		selectFormType:function(oEvent){
			debugger;
			var that = this;
			oSelectedIndex = oEvent.getParameter("selectedIndex");  
			var oRadioButtonSrc = oEvent.getSource().getAggregation("buttons");  
			oSelectedRadioText = oRadioButtonSrc[oSelectedIndex].getText();
			
			if(oSelectedRadioText !== "Related Party"){
				that.getView().byId("idRelatedParty").setVisible(false);
				that.getView().byId("relatedParty").setVisible(false);
				that.getView().byId("idBudget").setValue(budgetId);
				}
			else{
				that.getView().byId("idRelatedParty").setVisible(true);
				that.getView().byId("relatedParty").setVisible(true);
				that.getView().byId("idBudget").setValue(budgetId);
			}
			setTimeout(function(){
				that.byId("idBudget").setValue(budgetId);
			},1);

		},
		sendAction:function(oEvent){
			debugger;
			var that = this;
			var startDate,endDate,arrayStart,count,arrayEnd;
			var sTarih;
			var eTarih;
			var startNok;
			var endNok;
			var counter;
			
			startDate = that.getView().byId("periodStart").getValue();
			endDate = that.getView().byId("periodEnd").getValue();
			//date'in EN veya TR gelip gelmedğinin kontrolü begin of
			startNok = startDate.slice(1,2);
			endNok = endDate.slice(1,2);
			if(startNok !== "."){
				startNok = startDate.slice(2,3);
			}
			else{
				startNok = startDate.slice(1,2);
			}
			if(endNok !== "."){
				endNok = endDate.slice(2,3);
			}
			else{
				endNok = endDate.slice(1,2);
			}
			//end of
			if(startNok === "."){		
				arrayStart = startDate.split(".");
				count = arrayStart[0].length;
				if (count === 1) {
					arrayStart[0] = "0" + arrayStart[0];
					
				}
				sTarih = arrayStart[2] + arrayStart[1] + arrayStart[0];
				
				
			}
			else{
				arrayStart = startDate.split("/");
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
				
				sTarih = "20"+arrayStart[2] + arrayStart[0] + arrayStart[1];
				

			}
			if(endNok === "."){		
							
				arrayEnd = endDate.split(".");
				count = arrayEnd[0].length;
				
				if (count === 1 ) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				
				eTarih = arrayEnd[2] + arrayEnd[1] + arrayEnd[0];
				
			}
			else{				
				arrayEnd = endDate.split("/");
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
				eTarih = "20"+arrayEnd[2] + arrayEnd[0] + arrayEnd[1];
			}
			
				
		
			var vCount, vMonth, vInsAmount;
			for (var i = 0; i < tableList.length; i++) {
				vCount = tableList[i].mAggregations.cells["0"].mProperties.text;
				vMonth = tableList[i].mAggregations.cells["1"].mProperties.value;
				vInsAmount = tableList[i].mAggregations.cells["2"].mProperties.value;
				
				var arrayInsAmount = vInsAmount.split(".");

				oInstallments.push({
					rowNumber: vCount,
					Month: vMonth,
					InstallmentAmount: arrayInsAmount[0]
				});
			}
			console.log(oInstallments);

			
			
			
		
			var oHeaders;
			var oToken;
			
			jQuery.ajax({
				  url: "/bpmodata/startprocess.svc/itelligence.com.tr/budget/BPM_Budget_Approval/$metadata",
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
			var oURL = "/bpmodata/startprocess.svc/itelligence.com.tr/budget/BPM_Budget_Approval/StartData";
			
			var selectedRadio;
			debugger;
			var that = this;
			if(oSelectedRadioText === undefined){
				oSelectedRadioText = that.getView().byId("RB3-2").getText();
			}
//			var oEntry = {"ProcessStartEvent": {"BudgetApproval": {
//			    "Amount": {
//			        "CurrencyType": "",
//			        "Currency": "TRY",
//			        "totalAmount": "945",
//			        "totalAmountTRY": "945",
//			        "approvalNecessary": true
//			    },
//			    "Details": {
//			        "Budget": "17001",
//			        "Department": "CUSTOMER VALUE",
//			        "Desc": "CV",
//			        "SubDesc": "OUTSRC COST FOR CALL CENTER",
//			        "Type": "2017 OPEX",
//			        "brExp": "BR EXP TEXT",
//			        "explanation": "EXPLANATION TEXT",
//			        "formType": "Donation",
//			        "periodEnd": "20171231",
//			        "periodStart": "20170901",
//			        "purpose": "PURPOSE TEXT",
//			       "relatedParty": "",
//			        "remBudget": "1255",
//			        "subject": "2017 BAF DENEME",
//			        "supplier": ""
//			    },
//			    "Head": {
//			        "department": "IT",
//			        "requestDate": "20170907",
//			        "requestNum": "2017-BAF-0013",
//			        "requestOwner": "",
//			        "requestTime": "",
//			        "title": "DIRECTOR"
//			    },
//			    "Installments": {"row": [
//			        {
//			            "InstallmentAmount": "",
//			            "Month": "",
//			            "rowNumber": ""
//			        },
//			        {
//			            "InstallmentAmount": "",
//			            "Month": "",
//			            "rowNumber": ""
//			        }
//			    ]}
//			}}};
			
			//mkaya 16.10.2017 
		if(that.getView().byId("idTotalAmount").getValue() !== that.getView().byId("totalAmount").getValue()){
				sap.m.MessageToast.show("Please enter the same total amounts");
				 oInstallments = [];
			
			}
		else{
			//"Currency": sKur olarak degılde sımdılık try olarak yolla
			var arraytotalAmount = that.getView().byId("idTotalAmount").getValue().split(".");
			var arraytotalAmountTRY = that.getView().byId("totalCurrAmount").getValue().split(".");
			var supplierFull = that.getView().byId("supplier").getValue().split(" - ");
			var relatedPartyFull = that.getView().byId("relatedParty").getValue().split(" - ");
				 setTimeout(function(){	
						var oEntry = {"ProcessStartEvent": {"BudgetApproval": {
						    "Amount": {
						        "CurrencyType": that.getView().byId("CurrencyType").getSelectedKey(),
						        "Currency": that.getView().byId("currency").getValue(),
						        "totalAmount": arraytotalAmount[0],
						        "totalAmountTRY": arraytotalAmountTRY[0],
						        "totalAmountUSD": (parseInt(arraytotalAmountTRY[0])/vUSD).toString(),
						        "approvalNecessary": true
						    },
						    "Details": {
						        "Budget": budgetId,
						        "Department": that.getView().byId("idDepartment").getValue(),
						        "Desc": that.getView().byId("idDesc").getValue(),
						        "SubDesc": that.getView().byId("idSubDesc").getValue(),
						        "Type": that.getView().byId("idType").getValue(),
						        "brExp": that.getView().byId("brExp").getValue(),
						        "explanation": that.getView().byId("explanation").getValue(),
						        "formType": oSelectedRadioText,
						        "periodEnd": eTarih,
						        "periodStart": sTarih,
						        "purpose": that.getView().byId("purpose").getValue(),				        
						        "relatedParty": relatedPartyFull[1],
						        "relatedPartyId": relatedPartyFull[0],
						        "remBudget": that.getView().byId("remBudget").getValue(),
						        "subject": that.getView().byId("subject").getValue(),
						        "supplier": supplierFull[1],
						        "supplierId":supplierFull[0]
						    },
						    "Head": {
						        "department": that.getView().byId("department").getValue(),
						        "requestDate": sDate,
						        "requestNum": "",
						        "requestOwner": that.getView().byId("requestOwner").getValue(),
						        "requestTime": "",
						        "title": that.getView().byId("title").getValue()
						    },
						    "Installments": {"row": oInstallments},
						    "Attachments":{
						    	"Content":imgData,
						    	"FileName":"test"
						    },
						    "Opinion":{
						    	"OpSndPerNo":"",
						    	"OpSndComment":"",
						    	"OpRcvPerNo":"",
						    	"OpRcvComment":""
						    }
						}}};
						jQuery.ajax({
					        type: 'POST',
					        url: oURL,
					        data: JSON.stringify(oEntry),
					        dataType: "json",
					        Cookie: 'csrftoken='+ oToken,
					        headers: {
				                "X-CSRF-Token": oToken,
				                "Content-Type": "application/json"              	
				            },
					        success: function(result) {
					        	debugger;
					        	//that.onPdfExport();
					        	console.log(result);					 				     	
					    		var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
					    			MessageBox.success(
					    				"Form saved.",
					    				{
					    					styleClass: bCompact ? "sapUiSizeCompact" : ""
					    				}
					    			);
					    		that.resetValue();
					        }
					    });
				 },2000);
			
		}
		},
		resetValue:function(){			
			 //begin of ycoskun Request Date otomatik getirme
	     var that = this;
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
   		that.getView().byId('requestDate').setValue(today);
   		that.getView().byId('requestTime').setValue(time);
   		 //end of ycoskun
   		 
   		oInstallments=[];
    	that.getView().byId("periodStart").setValue("");
    	that.getView().byId("periodEnd").setValue("");
    	that.getView().byId("supplier").setValue("");
    	that.getView().byId("subject").setValue("");
    	that.getView().byId("idBudget").setValue("");
    	that.getView().byId("idDepartment").setValue("");
    	that.getView().byId("idType").setValue("");
    	that.getView().byId("idDesc").setValue("");
    	that.getView().byId("idSubDesc").setValue("");
    	that.getView().byId("remBudget").setValue("");
    	that.getView().byId("purpose").setValue("");				        	
    	that.getView().byId("explanation").setValue("");
    	that.getView().byId("brExp").setValue("");
    	that.getView().byId("currency").setValue("");
    	that.getView().byId("totalAmount").setValue("");
    	that.getView().byId("idTotalAmount").setValue("");
    	that.getView().byId("totalCurrAmount").setValue("");
    	that.getView().byId("CurrencyType").setValue("");
    	that.getView().byId("relatedParty").setValue("");
    
    	for (var a = 0; a < inputArrayId.length; a++) {	
			sap.ui.getCore().byId(inputArrayId[a]).setValue("");			

    	}
		
 
    	
    		
			
		},
		/*sendActionOLD: function() {
			var that = this;
			var BudgetApproval = {};
			var ProcessStartEvent = {};
			var eInstallments = {};
			var Installments = {
					row: []
				};
			var Head = {};
			var Details = {};
			var Amount = {};
			var oneEntry = [];
			var oEntry = [];
			

			Head.requestOwner = that.getView().byId("requestOwner").getValue();
			Head.department = that.getView().byId("department").getValue();
			Head.title = that.getView().byId("title").getValue();
			Head.requestNum = that.getView().byId("requestNum").getValue();
			Head.requestDate = that.getView().byId("requestDate").getValue();
			Head.requestTime = that.getView().byId("requestTime").getValue();
			Head.requestTime = that.getView().byId("status").getValue();
			
			oEntry.Head = Head;
			
			Details.Department = that.getView().byId("idDepartment").getValue();
			Details.Type = that.getView().byId("idType").getValue();
			Details.Desc = that.getView().byId("idDesc").getValue();
			Details.SubDesc = that.getView().byId("idSubDesc").getValue();
			Details.Budget = that.getView().byId("idBudget").getSelectedKey();
			Details.periodStart = that.getView().byId("periodStart").getValue();
			Details.periodEnd = that.getView().byId("periodEnd").getValue();
			Details.supplier = that.getView().byId("supplier").getValue();
			Details.subject = that.getView().byId("subject").getValue();
			Details.remBudget = that.getView().byId("remBudget").getValue();
			Details.purpose = that.getView().byId("purpose").getValue();
			Details.explanation = that.getView().byId("explanation").getValue();
			Details.formType = that.getView().byId("formType").getSelectedIndex();
			Details.relatedParty = that.getView().byId("relatedParty").getSelectedKey();
			Details.brExp = that.getView().byId("brExp").getValue();
			
			oEntry.Details = Details;
			
			
			
			Amount.CurrencyType = that.getView().byId("CurrencyType").getSelectedKey();
			Amount.currency = that.getView().byId("currency").getValue();
			Amount.totalAmount = that.getView().byId("totalAmount").getValue();
			Amount.totalAmountTRY = that.getView().byId("totalAmount").getValue();
			
			oEntry.Amount = Amount;
			
			
			
			oEntry.Installments = oInstallments;
			
			oneEntry.BudgetApproval = oEntry;
			twoEntry.ProcessStartEvent = oneEntry;
			
		
			
		},
		*/
			
		setFormat:function(value){
			if (value) {
				/*var array = value.split('@');
				budgetId = array[0];
				department = array[1];
				type = array[2];
				desc = array[3];
				subDesc = array[4];*/
				//var array = value.split('@');
				//budgetID = array[0];
				return value;
			
			} else {
				return value;
			}
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
		selectChange:function(oEvent){
			debugger;
			var oThat = this;
			var selectItem = oEvent.oSource.getSelectedItem().getText();
			console.log(selectItem);
			
			var array = selectItem.split(' - ');
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
				oThat.byId("idBudget").setValue(budgetId);
			},100);
			
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
	    		
	    		 oThat.getView().byId('remBudget').setValue(remData);
				
				//end of ycoskun
				
			}catch(err){
				
			}	
			//end of budget id ye bağlı rem amount cekme
	
	
			
		},
		addListInput: function(oEvent) {
			var oThat = this;
		/*	var today = new Date();
			//var dd = today.getDate();
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
				today = yyyy.toString() + newMM.toString();

			} else {
				if (mm < 10) {
					mm = '0' + mm;
				}
				today = yyyy.toString() + mm.toString();
			}
*/
			//var oDatePicker1 = new sap.ui.commons.DatePicker();
			//oDatePicker1.setYyyymmdd(today);
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
					new sap.m.DatePicker({
						type: "Text",
						value: "",
						valueFormat : "MM-yyyy",
						displayFormat : "MM-yyyy",
						editable: true
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
							debugger;
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
		                vUSD = data.E_USD;
		                oThat.getView().byId('currency').setValue(sKur);
		             
		    			
		                
		            }
		        
		        });
		},
		handleValueHelpSupplier: function() {
			debugger;
			var that = this;
			var supplier;
			var supplierName;
			var jsonSearch;
			var handleClose = function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					debugger;
					var title = oSelectedItem.getTitle();
					 var array = title.split(' - ');
					 supplier = array[0];
					 supplierName = array[1];
					that.getView().byId("supplier").setValue(supplier+" - "+supplierName);
					//that.additionalInfoValidation();
				}
			};
			if (!this._valueHelpSelectSupplier) {
				this._valueHelpSelectSupplier = new sap.m.SelectDialog("valueHelpSelectSupplier", {
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
					                   var array = text.STRING.split('@');
					                   var test = array[0]+" - "+array[1]+" - "+array[2]+" - "+array[3]+" - "+array[4];
					                   jsonSearch = {STRING: test};
					                   
					                   searchSupp.push(jsonSearch);
					                    
					                    
					                 }
					               
				    			console.log(searchSupp);
				    			searchModel.setData(searchSupp);
				    			that._valueHelpSelectSupplier.setModel(searchModel);
				                
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
				this._valueHelpSelectSupplier.setModel(supplierModel);

			} else {
				this._valueHelpSelectSupplier.setModel(supplierModel);
			}
			this._valueHelpSelectSupplier.open();

			
			
		},
		changeDate:function(){
			debugger;
			var that = this;
			var startDate,endDate,arrayStart,count,arrayEnd;
			var sTarih;
			var eTarih;
			var startNok;
			var endNok;
			var counter;
			
			startDate = that.getView().byId("periodStart").getValue();
			endDate = that.getView().byId("periodEnd").getValue();
			//date'in EN veya TR gelip gelmedğinin kontrolü begin of
			startNok = startDate.slice(1,2);
			endNok = endDate.slice(1,2);
			if(startNok !== "."){
				startNok = startDate.slice(2,3);
				//endNok = endDate.slice(2,3);
			}
			else{
				startNok = startDate.slice(1,2);
				//endNok = endDate.slice(1,2);
			}
			if(endNok !== "."){
				endNok = endDate.slice(2,3);
			}
			else{
				endNok = endDate.slice(1,2);
			}
			//end of
			if(startNok === "."){		
				arrayStart = startDate.split(".");
				count = arrayStart[0].length;
				if (count === 1) {
					arrayStart[0] = "0" + arrayStart[0];
					
				}
				sTarih = arrayStart[2] + arrayStart[1] + arrayStart[0];
				
				
				/*arrayEnd = endDate.split(".");
				count = arrayEnd[0].length;
				if (count === 1) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				eTarih = arrayEnd[2] + arrayEnd[1] + arrayEnd[0];*/
				
			}
			else{
				arrayStart = startDate.split("/");
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
				
				sTarih = "20"+arrayStart[2] + arrayStart[0] + arrayStart[1];
				
				
				/*arrayEnd = endDate.split("/");
				count = arrayEnd[0].length;
				if (count === 1) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				eTarih = arrayEnd[2] + arrayEnd[1] + arrayEnd[0];*/
			}
			if(endNok === "."){		
							
				arrayEnd = endDate.split(".");
				count = arrayEnd[0].length;
				
				if (count === 1 ) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				
				eTarih = arrayEnd[2] + arrayEnd[1] + arrayEnd[0];
				
			}
			else{				
				arrayEnd = endDate.split("/");
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
				eTarih = "20"+arrayEnd[2] + arrayEnd[0] + arrayEnd[1];
			}
			
					
			
			if(endDate === "" || startDate === ""){
		
			}
			else{
				if( parseInt(sTarih) >= parseInt(eTarih) ){		
					var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
							MessageBox.error(
								"Budget Period Start Date cannot be less than the Budget Period End Date",
								{
									styleClass: bCompact ? "sapUiSizeCompact" : ""
								}
							);				
				}
				if( parseInt(arrayStart[2]) !== parseInt(arrayEnd[2]) ){		
					var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
							MessageBox.error(
								"Budget Period Start Date and Budget Period End Date should be the same year",
								{
									styleClass: bCompact ? "sapUiSizeCompact" : ""
								}
							);
						
					
				}
			}
	
			
		},
		changeTotalAmount:function(){
			var that = this;
			var totalAmount = that.getView().byId("totalAmount").getValue();
			that.getView().byId("totalAmount").setValue(parseFloat(totalAmount.toString().replace(/\D/g, '')).toFixed(2));
			
			
		},
		getDialogComment: function() {
			this.oCommentDialog = sap.ui.xmlfragment("zn11_expense.view.Comment", this);
			this.getView().addDependent(this.oCommentDialog);

			// 			var oModel = new JSONModel(jQuery.sap.getModulePath("zn11_expense/mockserver", "/Products.json"));
			// 			this.getView().setModel(oModel);

			return this.oCommentDialog;
		},
		handleValueHelpRelatedParty: function() {
			debugger;
			var that = this;
			var relatedParty;
			var relatedPartyName;
			
			var handleClose = function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					debugger;
					var title = oSelectedItem.getTitle();
					 var array = title.split('@');
					 //supplier = array[0];
					 //supplierName = array[1];
					 relatedParty = array[0];
					 relatedPartyName = array[1];
					that.getView().byId("relatedParty").setValue(relatedParty+" - "+relatedPartyName);
					
				}
			};
			if (!this._valueHelpSelectRelatedParty) {
				this._valueHelpSelectRelatedParty = new sap.m.SelectDialog("valueHelpSelectRelatedParty", {
					title: "Related Party",
					items: {
						path: "/",
						sorter: "STRING",
						template: new sap.m.StandardListItem({
							title: "{STRING}",
							description: "{STRING}",
							active: true
						})
					},
					search: function(oEvent) {},
					confirm: handleClose
				});
				this._valueHelpSelectRelatedParty.setModel(relModel);

			} else {
				this._valueHelpSelectRelatedParty.setModel(relModel);
			}
			this._valueHelpSelectRelatedParty.open();

			
			
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
		}
		
		


	});

	return CController;

});