// Copyright (c) 2024, Meera and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gold Scheme Allocation', {
	scheme_name: function (frm) {
		var scheme_name = frm.doc.scheme_name;

		if (scheme_name) {
			frappe.call({
				method: 'frappe.client.get_value',
				args: {
					doctype: 'Gold Scheme',
					filters: { 'name': scheme_name },
					fieldname: 'scheme_type'
				},
				callback: function (response) {
					if (response.message && response.message.scheme_type) {
						frm.set_value('scheme_type', response.message.scheme_type);
					}
				}
			});
		}
	}
});

