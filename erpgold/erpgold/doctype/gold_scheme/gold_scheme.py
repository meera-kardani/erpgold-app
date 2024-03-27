# Copyright (c) 2024, Meera and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document

class GoldScheme(Document):
    # Your document definition here

    # Add this method to include the custom script file
    def get_js(self):
        return """
            frappe.require("/assets/myapp/js/gold_scheme_custom_script.js");
        """

