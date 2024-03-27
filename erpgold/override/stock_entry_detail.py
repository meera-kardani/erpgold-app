import frappe

def fetch_custom_fields(doc, method):
    if method == "on_submit":
        # Fetch all fields from Stock Entry Detail doctype
        stock_entry_detail_fields = frappe.get_meta("Stock Entry Detail").fields

        # Fetch Stock Entry Details
        stock_entry_details = frappe.get_all("Stock Entry Detail", filters={"parent": doc.name}, fields=["*"])

        for detail in stock_entry_details:
            # Create a new Serial No record
            serial_no_doc = frappe.new_doc("Serial No")
            serial_no_doc.update({
                "parent": doc.name,
            })

            # Set values dynamically based on Stock Entry Detail fields
            for field in stock_entry_detail_fields:
                fieldname = field.fieldname
                if fieldname in detail:
                    serial_no_doc.set(fieldname, detail[fieldname])

            serial_no_doc.insert()

# Hook this function to the Stock Entry doctype's on_submit event
frappe.event("on_submit", "Stock Entry")(fetch_custom_fields)
