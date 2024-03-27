// Copyright (c) 2024, Meera and contributors
// For license information, please see license.txt

frappe.ui.form.on('Metal Rate', {
	refresh: function (frm) {
		// Your code here
	},

	get_metal_list: function (frm) {
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Purity',
				fields: ['metal_type', 'purity']
			},
			callback: function (response) {
				if (response.message) {
					frm.doc.daily_metal_rate = [];

					response.message.forEach(function (purity) {
						var row = frappe.model.add_child(frm.doc, 'Daily Metal Rate', 'daily_metal_rate');
						row.metal_type = purity.metal_type;
						row.purity = purity.purity;
						row.rate = '';
					});

					frm.refresh_field('daily_metal_rate');
				} else {
					frappe.msgprint('Failed to fetch purity data.');
				}
			}
		});
	},

	custom_on_save: function (frm) {
		frm.save('Save');
	}
});

frappe.ui.form.on('Metal Rate', {
	get_metal_list: function (frm) {
		frm.get_metal_list();
	}
});



