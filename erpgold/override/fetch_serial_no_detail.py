from typing import Dict, Optional
import frappe

# Define the custom type if it's not already defined
class BarcodeScanResult:
    # Define the structure of BarcodeScanResult if it's a custom type
    pass

@frappe.whitelist()
def custom_scan_barcode(search_value: str) -> BarcodeScanResult:
    def set_cache(data: BarcodeScanResult):
        frappe.cache().set_value(f"erpnext:barcode_scan:{search_value}", data, expires_in_sec=120)

    def get_cache() -> Optional[BarcodeScanResult]:
        return frappe.cache().get_value(f"erpnext:barcode_scan:{search_value}")

    if scan_data := get_cache():
        return scan_data

    barcode_data = frappe.db.get_value(
        "Item Barcode",
        {"barcode": search_value},
        ["barcode", "parent as item_code", "uom"],
        as_dict=True,
    )
    if barcode_data:
        _update_item_info(barcode_data)
        set_cache(barcode_data)
        return barcode_data

    serial_no_data = frappe.db.get_value(
        "Serial No",
        {"name": search_value, "status": "Active"},
        ["name as serial_no", "item_code", "custom_size", "batch_no", "custom_metal_type", "custom_purity",
         "custom_purity_percentage", "custom_gross_weight", "custom_less_weight", "custom_net_weight",
         "custom_westage", "custom_fine_weight", "custom_gold_rate", "custom_gold_value", "custom_mrp_rate",
         "custom_other_amount", "custom_sales_labour_amount",
         "custom_is_jewellery_item"],
        as_dict=True,
    )
    if serial_no_data:
        _update_item_info(serial_no_data)
        set_cache(serial_no_data)
        print("\n\n\n" + str(serial_no_data))
        return serial_no_data
    else:
        frappe.msgprint(f"{search_value} this serial no. not Active")

    batch_no_data = frappe.db.get_value(
        "Batch",
        search_value,
        ["name as batch_no", "item as item_code"],
        as_dict=True,
    )
    if batch_no_data:
        _update_item_info(batch_no_data)
        set_cache(batch_no_data)
        return batch_no_data

    return {}


def _update_item_info(scan_result: Dict[str, Optional[str]]) -> Dict[str, Optional[str]]:
    item_code = scan_result.get("item_code")
    if item_code:
        item_info = frappe.get_cached_value(
            "Item",
            item_code,
            ["has_batch_no", "has_serial_no"],
            as_dict=True,
        )
        if item_info:
            scan_result.update(item_info)
            print("scan_result--", scan_result)
    return scan_result
