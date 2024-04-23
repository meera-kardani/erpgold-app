frappe.ui.form.on('Stock Audit', {
    onload: function(frm) {
        frappe.call({
            method: 'get_count',
            doc: frm.doc,
            callback: function(response) {
                if (response.message) {
                    var counts = response.message;
                    frm.set_value('total_items_in_stock', counts.in_stock);
                    frm.refresh_field(['total_items_in_stock']);

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
                    if (item.available !== 1) {
                        frappe.model.set_value(item.doctype ,item.name ,"available" , 1)
                        incrementAuditItemCountInStock(frm);
                    }
                    exists = true;
                    return false;
                }
            });
            if (!exists) {
                frappe.db.get_value('Serial No', { name: scan_barcode }, ['item_code', 'status'], function (response) {
                    if (response && response.item_code) {
                        if (response.status === 'Inactive') {
                            // Check if the serial number is already in frm.inactive_serials
                            if (!frm.inactive_serials || !frm.inactive_serials.includes(scan_barcode)) {
                                frm.inactive_serials = frm.inactive_serials || [];
                                frm.inactive_serials.push(scan_barcode);
                                frm.set_value('total_not_found_items', (frm.doc.total_not_found_items || 0) + 1);
                                frappe.msgprint('Serial number is inactive');
                            } else {
                                frappe.msgprint('Serial number is already marked as inactive');
                            }
                        } else if (response.status === 'Delivered') {
                            // Check if the serial number is already in not_in_stock table
                            var serialExistsInNotInStock = frm.doc.not_in_stock.some(function(item) {
                                return item.serial_nos === scan_barcode;
                            });
                            if (!serialExistsInNotInStock) {
                                var new_row = frm.add_child('not_in_stock');
                                new_row.serial_nos = scan_barcode;
                                new_row.item_code = response.item_code;
                                frm.refresh_field('not_in_stock');
                                frm.set_value('total_not_in_stock_items', frm.doc.not_in_stock.length);
                                frappe.msgprint('Serial number added to Not In Stock');
                            } else {
                                frappe.msgprint('Serial number already exists in Not In Stock');
                            }
                        } else {
                            frappe.msgprint('Serial number is not delivered');
                        }
                    } else {
                        frappe.msgprint('Failed to fetch serial details');
                    }
                });
            } else {
                frappe.msgprint('Serial number already exist in stock item table');
            }
        }

        setTimeout(function() {
            frm.set_value('scan_barcode', '');
            frm.refresh_field('scan_barcode');
        }, 120);

        console.log('Inactive Serials:', frm.inactive_serials);
    }
});

function incrementAuditItemCountInStock(frm) {
    var currentCount = frm.doc.total_audit_item_in_stock || 0;
    frm.set_value('total_audit_item_in_stock', currentCount + 1);
    frm.refresh_field('total_audit_item_in_stock');
}