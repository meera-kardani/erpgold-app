// Copyright (c) 2024, Meera and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gold Scheme Allocation', {
    enroll_date: function(frm) {
        calculateEndDate(frm);
    },
    scheme_tenure: function(frm) {
        calculateEndDate(frm);
    }
});

function calculateEndDate(frm) {
    var enrollDate = new Date(frm.doc.enroll_date);
    var schemeTenureMonths = frm.doc.scheme_tenure;

    if (enrollDate && schemeTenureMonths) {
        var endDate = new Date(enrollDate);
        endDate.setMonth(enrollDate.getMonth() + schemeTenureMonths);

        frm.set_value('scheme_end_date', endDate);
    }
}
