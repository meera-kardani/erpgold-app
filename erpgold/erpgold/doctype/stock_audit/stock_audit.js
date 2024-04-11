frappe.ui.form.on('Stock Audit', {
    onload: function(frm) {
        frappe.call({
            method: 'get_count',
            doc: frm.doc,
            callback: function(response) {
                if (response.message) {
                    var counts = response.message;
                    frm.set_value('total_items_in_stock', counts.in_stock);
                    frm.set_value('total_not_found_items', counts.not_found);
                    frm.set_value('total_not_in_stock_items', counts.not_in_stock);
                    frm.refresh_field(['total_items_in_stock', 'total_not_found_items', 'total_not_in_stock_items']);

                    frm.script_manager.trigger("populate_stock_items");
                }
            }
        });
    }
});

frappe.ui.form.on('Stock Audit', {
    populate_stock_items: function(frm) {
        frappe.call({
            method: 'get_serial_nos',
            doc: frm.doc,
            callback: function(response) {
                if (response.message) {
                    var serial_nos = response.message;
                    frm.clear_table('stock_items');
                    $.each(serial_nos, function(i, d) {
                        var row = frm.add_child('stock_items');
                        row.serial_nos = d.name;
                        row.item_code = d.item_code;
                    });
                    frm.refresh_field('stock_items');
                }
            }
        });
    }
});
