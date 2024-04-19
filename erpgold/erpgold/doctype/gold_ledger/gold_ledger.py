# Copyright (c) 2024, Meera and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class GoldLedger(Document):
    pass

def update_gold_ledger_on_stock_entry_submit(doc, method):
    """
    Update Gold Ledger on Stock Entry Submit
    """
    if doc.docstatus == 1: 
        if doc.doctype in ["Purchase Receipt"]:
            party_type = "supplier"
            party_name = doc.supplier 
        elif doc.doctype in ["Delivery Note"]:
            party_type = "customer"
            party_name = doc.customer
        else:
            party_type = ""
            party_name = ""

        stock_ledger_entries = frappe.get_all("Stock Ledger Entry", 
                                              filters={"voucher_no": doc.name},
                                              fields=["item_code", "stock_uom", "serial_no", "posting_date", "warehouse", "voucher_type", "voucher_no", "fiscal_year", "is_cancelled"])  
        for entry in stock_ledger_entries:
            for item in doc.items:
                gold_ledger_entry = frappe.get_doc({
                    "doctype": "Gold Ledger",
                    "posting_date": entry.posting_date,
                    "item_code": entry.item_code,
                    "uom": entry.stock_uom,
                    "purity": item.custom_purity,
                    "purity_percentage": item.custom_purity_percentage,
                    "serial_no": entry.serial_no,
                    "warehouse": entry.warehouse,
                    "voucher_type": entry.voucher_type,
                    "voucher_no": entry.voucher_no,
                    "fiscal_year": entry.fiscal_year,
                    "is_cancelled": entry.is_cancelled,
                    "debit_amount": item.custom_total_amount if doc.doctype in ["Delivery Note"] else 0,
                    "credit_amount": item.custom_total_amount if doc.doctype in ["Purchase Receipt"] else 0,
                    "debit_gold": item.custom_fine_weight if doc.doctype in ["Delivery Note"] else 0,
                    "credit_gold": item.custom_fine_weight if doc.doctype in ["Purchase Receipt"] else 0,
                    "party_type": party_type,
                    "party": party_name  
                })
                gold_ledger_entry.insert(ignore_permissions=True)  
                gold_ledger_entry.submit()
