sap.ui.define([



	"sap/ui/core/UIComponent",



	"sap/ui/Device",



	"zn11_expense/model/models"



], function(UIComponent, Device, models) {

	"use strict";

	return UIComponent.extend("zn11_expense.Component", {

		metadata: {

			manifest: "json",

			rootView: "sap.ui.comp.sample.smartfield.SmartField",

			dependencies: {

				libs: ["sap.m", "sap.ui.comp"]

			}

		},

		config: {

			sample: {

				stretch: true,

				files: ["Home.view.xml", "Home.controller.js", "/mockserver/metadata.xml", "/mockserver/Products.json"]

			}

		},

		/**



		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.



		 * @public



		 * @override



		 */

		init: function() {

			// call the base component's init function

			UIComponent.prototype.init.apply(this, arguments);

			// set the device model

			this.setModel(models.createDeviceModel(), "device");
		

    
	
		}

	});

});