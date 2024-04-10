frappe.ui.form.on('Stock Audit', {
    onload: function(frm) {
        // Make AJAX request to fetch count of items in stock
        frappe.call({
            method: 'get_count',
            doc: frm.doc,
            callback: function(response) {
                if (response.message) {
                    var counts = response.message;
                    frm.set_value('total_items_in_stock', counts.in_stock);
                    frm.set_value('total_not_in_stock_items', counts.not_in_stock);
                    frm.refresh_field(['total_items_in_stock', 'total_not_in_stock_items']);
                }
            }
        });
    }
});
