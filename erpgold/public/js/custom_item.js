frappe.ui.form.on('Item', {
    custom_metal_type: function(frm) {
        var metal_type = frm.doc.custom_metal_type;
        if (metal_type) {
            frm.set_query('custom_purity', function() {
                return {
                    filters: [
                        ['Purity', 'metal_type', '=', metal_type]
                    ]
                };
            });
        }
    }
});
