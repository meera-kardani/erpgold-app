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

frappe.ui.form.on('Stock Audit', {
    scan_barcode: function(frm) {
        var scan_barcode = frm.doc.scan_barcode;
        if (scan_barcode) {
            var exists = false;
            frm.doc.stock_items.forEach(function(item) {
                if (item.serial_nos === scan_barcode) {
                    exists = true;
                    return false;
                }
            });
            if (!exists) {
                frappe.db.get_value('Serial No', { name: scan_barcode }, 'item_code', function(response) {
                    if (response && response.item_code) {
                        var new_row = frm.add_child('not_in_stock');
                        new_row.serial_nos = scan_barcode;
                        new_row.item_code = response.item_code;
                        frm.refresh_field('not_in_stock');
                        frappe.msgprint('Serial number added to Not In Stock');
                    } else {
                        frappe.msgprint('Failed to fetch serial details');
                    }
                });
            } 
        }
        
        setTimeout(function() {
            frm.set_value('scan_barcode', '');
            frm.refresh_field('scan_barcode');
        }, 120);
    }
});
