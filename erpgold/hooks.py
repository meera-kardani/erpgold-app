app_name = "erpgold"
app_title = "Erpgold"
app_publisher = "Meera"
app_description = "This is a app to information of gold in shop"
app_email = "kardanimeera@gmail.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/erpgold/css/erpgold.css"
# app_include_js = "/assets/erpgold/js/erpgold.js"
app_include_js = "/assets/erpgold/js/barcode_scanning.js"

# include js, css files in header of web template
# web_include_css = "/assets/erpgold/css/erpgold.css"
# web_include_js = "/assets/erpgold/js/erpgold.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "erpgold/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}

# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "erpgold.utils.jinja_methods",
# 	"filters": "erpgold.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "erpgold.install.before_install"
# after_install = "erpgold.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "erpgold.uninstall.before_uninstall"
# after_uninstall = "erpgold.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "erpgold.utils.before_app_install"
# after_app_install = "erpgold.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "erpgold.utils.before_app_uninstall"
# after_app_uninstall = "erpgold.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "erpgold.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }
doc_events = {
    "Stock Entry": {
        "on_submit": ["erpgold.override.serial_no_detail.custom_update_serial_nos_after_submit",
                    "erpgold.erpgold.doctype.gold_ledger.gold_ledger.update_gold_ledger_on_stock_entry_submit"]
    },
    "Purchase Receipt":{
        "on_submit": ["erpgold.override.serial_no_detail.custom_update_serial_nos_after_submit",
                    "erpgold.erpgold.doctype.gold_ledger.gold_ledger.update_gold_ledger_on_stock_entry_submit"]
    },
    "Purchase Invoice":{
        "on_submit": "erpgold.override.serial_no_detail.custom_update_serial_nos_after_submit"
    },
    "Delivery Note":{
        "on_submit" : "erpgold.erpgold.doctype.gold_ledger.gold_ledger.update_gold_ledger_on_stock_entry_submit",
        "on_cancel" : "erpgold.erpgold.doctype.gold_ledger.gold_ledger.update_gold_ledger_on_stock_entry_cancel"
    }
}


# hooks.py

# doc_events = {
#     "Stock Entry": {
#         "on_submit": "erpgold.override.stock_entry_detail.update_stock_entry_serial_no_details"
#     }
# }


# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"erpgold.tasks.all"
# 	],
# 	"daily": [
# 		"erpgold.tasks.daily"
# 	],
# 	"hourly": [
# 		"erpgold.tasks.hourly"
# 	],
# 	"weekly": [
# 		"erpgold.tasks.weekly"
# 	],
# 	"monthly": [
# 		"erpgold.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "erpgold.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "erpgold.event.get_events"
# }
override_whitelisted_methods = {
	# "frappe.desk.doctype.event.event.get_events": "goldapp.event.get_events"
	"erpnext.stock.utils.scan_barcode": "erpgold.override.fetch_serial_no_detail.custom_scan_barcode"
}

# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "erpgold.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["erpgold.utils.before_request"]
# after_request = ["erpgold.utils.after_request"]

# Job Events
# ----------
# before_job = ["erpgold.utils.before_job"]
# after_job = ["erpgold.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"erpgold.auth.validate"
# ]


doctype_js = {
            "Purchase Invoice" : "public/js/purchase_invoice_item.js",
            "Purchase Receipt" : "public/js/purchase_receipt_item.js",
            "Purchase Order" : "public/js/purchase_order_item.js",
            "Stock Entry" : "public/js/stock_entry_detail.js",
            "Delivery Note" : "public/js/delivery_note_item.js",
            "Sales Invoice" : "public/js/sales_invoice_item.js",
            "Sales Order" : "public/js/sales_order_item.js",
            "Item" : "public/js/custom_item.js"
            }

# add fixture
fixtures = ["Custom Field", ]