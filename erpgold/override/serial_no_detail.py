import frappe

@frappe.whitelist()
def custom_update_serial_nos_after_submit(controller, parentfield):
    field = ["custom_size", "custom_metal_type", "custom_purity", "custom_purity_percentage", "custom_gross_weight",
             "custom_less_weight", "custom_net_weight", "custom_westage", "custom_fine_weight", "custom_gold_rate",
             "custom_gold_value", "custom_mrp_rate", "custom_other_amount", "custom_labour_type",
             "custom_labour_rate", "custom_labour_amount", "custom_is_jewellery_item"]

    sle = frappe.db.get_all('Stock Ledger Entry', filters={"voucher_no": controller.name, "voucher_type": controller.doctype}, fields=['serial_no'])

    if "Stock Entry" == controller.doctype:
        data = frappe.db.get_all('Stock Entry Detail', filters={"parent": controller.name}, fields=field)
    elif "Purchase Receipt" == controller.doctype:
        data = frappe.db.get_all('Purchase Receipt Item', filters={"parent": controller.name}, fields=field)
    elif "Purchase Invoice" == controller.doctype:
        data = frappe.db.get_all('Purchase Invoice Item', filters={"parent": controller.name}, fields=field)
    else:
        frappe.msgprint("Serial Numbers not available for this doctype")
        return

    for sle_record in sle:
        serial_nos = sle_record['serial_no'].split('\n')
        for serial_no in serial_nos:
            if serial_no:
                for record in data:
                    target_doc = frappe.get_doc('Serial No', serial_no.strip())
                    target_doc.custom_size = record.get('custom_size')
                    target_doc.custom_metal_type = record.get('custom_metal_type')
                    target_doc.custom_purity = record.get('custom_purity')
                    target_doc.custom_purity_percentage = record.get('custom_purity_percentage')
                    target_doc.custom_gross_weight = record.get('custom_gross_weight')
                    target_doc.custom_less_weight = record.get('custom_less_weight')
                    target_doc.custom_net_weight = record.get('custom_net_weight')
                    target_doc.custom_westage = record.get('custom_westage')
                    target_doc.custom_fine_weight = record.get('custom_fine_weight')
                    target_doc.custom_gold_rate = record.get('custom_gold_rate')
                    target_doc.custom_gold_value = record.get('custom_gold_value')
                    target_doc.custom_mrp_rate = record.get('custom_mrp_rate')
                    target_doc.custom_other_amount = record.get('custom_other_amount')
                    target_doc.custom_labour_type = record.get('custom_labour_type')
                    target_doc.custom_sales_labour_rate = record.get('custom_labour_rate')
                    target_doc.custom_sales_labour_amount = record.get('custom_labour_amount')
                    target_doc.custom_is_jewellery_item = record.get('custom_is_jewellery_item')
                    target_doc.save()
            else:
                frappe.msgprint("Serial No not found for an item.")
