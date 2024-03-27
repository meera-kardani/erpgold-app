// Copyright (c) 2024, Meera and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gold Scheme', {
	last_date_of_enroll: function (frm) {
		updateStatus(frm);
		updateFreeInstallment(frm);
	},
	status: function (frm) {
		updateStatus(frm);
	},
	scheme_type: function (frm) {
		updateFreeInstallment(frm);
	}
});

function updateStatus(frm) {
	var today = frappe.datetime.get_today();
	var lastDateOfEnroll = frm.doc.last_date_of_enroll;
	var status = frm.doc.status;

	if (lastDateOfEnroll) {
		if (lastDateOfEnroll >= today && status != "Active") {
			frm.set_value('status', 'Active');
		} else if (lastDateOfEnroll < today && status != "Expired") {
			frm.set_value('status', 'Expired');
		}
	}
}

function updateFreeInstallment(frm) {
	var schemeType = frm.doc.scheme_type;
	if (schemeType === "Amount") {
		frm.set_value('is_free_installment', 1);
	} else {
		frm.set_value('is_free_installment', 0);
	}
}
