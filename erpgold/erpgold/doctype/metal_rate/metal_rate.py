# Copyright (c) 2024, Meera and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class MetalRate(Document):
    pass

@frappe.whitelist()
def query(metal_type, purity, date):
    purity_match = purity.split('-')[0] 
    metal_type_match = purity.split('-')[1]
    date1 = frappe.db.get_list('Metal Rate', {'date': date}, 'date')
    
    # Check if the date exists in MetalRate doctype
    if date1:    
        if metal_type_match == metal_type:
            gold_rate = frappe.db.sql("""
                SELECT
                    rate
                FROM `tabDaily Metal Rate` AS dmr
                INNER JOIN `tabMetal Rate` AS mr
                ON dmr.parent = mr.name
                WHERE purity LIKE %s AND date = %s AND metal_type = %s
                """, ('%' + purity_match + '%', date, metal_type_match))

            # Return the fetched gold rate or 0 if not found
            return gold_rate if gold_rate else 0
        else:
            return "Metal rate is not available for the selected purity and metal type."
    else:
        frappe.msgprint("Data is not available")