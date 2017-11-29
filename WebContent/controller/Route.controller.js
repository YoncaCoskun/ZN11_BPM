sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("zn11_expense.controller.Route", {
		onInit: function() {
			
		},

		onAfterRendering: function() {},
		// onLogin: function() {
		// 	var that = this;
		// 	that.showBusyIndicator(2000);

		// },
		hideBusyIndicator: function() {
			sap.ui.core.BusyIndicator.hide();
		},
		//showBusyIndicator: function(iDuration, iDelay) {
		// sap.ui.core.BusyIndicator.show(iDelay);

		//begin of kullanıcı adı ve şifrenin kontrolü
		onLogin: function() {
			var that = this;
			var username = that.getView().byId("kardNo").getValue();
			var password = that.getView().byId("sifre").getValue();
			

			if (username === "" || password === "") {
				sap.m.MessageToast.show("Kart No veya Şifre Alanını Boş Bırakmayınız!");
				return;
			}
			
			var oHeaders;
			var oToken;

			//var uname = btoa(username);
			//var pword = btoa(password);
			
			//document.cookie = username+"="+password+";"+"secure";
			//console.log(document.cookie);
			var unamePas = btoa(username+":"+password);
			//var pword = btoa(password);
			  window.localStorage.setItem("unamePas", unamePas);


			jQuery.ajax({
				  url: "/bpmodata/tasks.svc/TaskCollection?$filter=Status eq 'READY'",
				  headers: {"x-csrf-token": "Fetch",
					  "Authorization":"Basic "+unamePas},
				  async: false,
				  method: 'GET'
				}).then(function(data,status,xhr) {
					  oToken = xhr.getResponseHeader('x-csrf-token');
					  oHeaders = {
								"x-csrf-token": oToken
							};
					});
			
			if(oToken){
				debugger;
				that.getOwnerComponent().getRouter().navTo("Home");
			}

			//end of

			// if (iDuration && iDuration > 0) {
			// 	if (this._sTimeoutId) {
			// 		jQuery.sap.clearDelayedCall(this._sTimeoutId);
			// 		this._sTimeoutId = null;
			// 	}

			// 		this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function() {
			// 			this.hideBusyIndicator();
			// 			this.getOwnerComponent().getRouter().navTo("Home");
			// 		});

			// }
		}

	});

});