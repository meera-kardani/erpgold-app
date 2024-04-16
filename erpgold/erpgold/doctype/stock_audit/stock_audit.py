# Copyright (c) 2024, Meera and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class StockAudit(Document):
    def before_save(self):
        counts = self.get_count()
        self.total_items_in_stock = counts['in_stock']
        
    @frappe.whitelist()
    def get_count(self):
        total_items_in_stock = frappe.db.count('Serial No', filters={'status': 'Active'})
        
        return {
            'in_stock': total_items_in_stock,
        }

    @frappe.whitelist()
    def get_serial_nos(self):
        serial_nos = frappe.get_all('Serial No', filters={'status': 'Active'}, fields=['name', 'item_code'])
        return serial_nos