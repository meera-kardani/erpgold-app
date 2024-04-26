frappe.ui.form.on('Sales Invoice', {
    refresh: function(frm) {
        calculateTotalWeight(frm);
    },
});

frappe.ui.form.on('Sales Invoice Item', {
    custom_gross_weight: function (frm, cdt, cdn) {
        calculateNetWeight(frm, cdt, cdn);
        calculateTotalWeight(frm, cdt, cdn);
    },
    custom_less_weight: function (frm, cdt, cdn) {
        calculateNetWeight(frm, cdt, cdn);
        calculateTotalWeight(frm, cdt, cdn);
    },
    custom_purity_percentage: function (frm, cdt, cdn) {
        calculateFineWeight(frm, cdt, cdn);
    },
    custom_purity: function (frm, cdt, cdn) {
        fetchMetalRate(frm, cdt, cdn);
    },
    custom_gold_rate: function (frm, cdt, cdn) {
        calculateGoldValue(frm, cdt, cdn);
    },
    custom_labour_type: function (frm, cdt, cdn) {
        calculateLabourAmount(frm, cdt, cdn);
        calculateTotalAmount(frm, cdt, cdn);
    },
    custom_sales_labour_rate: function (frm, cdt, cdn) {
        calculateLabourAmount(frm, cdt, cdn);
        calculateTotalAmount(frm, cdt, cdn);
    },
    custom_other_amount: function (frm, cdt, cdn) {
        calculateTotalAmount(frm, cdt, cdn);
    },
    custom_discount: function (frm, cdt, cdn) {
        calculateTotalAmount(frm, cdt, cdn);
    },
    custom_gold_value: function (frm, cdt, cdn) {
        calculateTotalAmount(frm, cdt, cdn);
    },
    custom_sales_labour_amount: function (frm, cdt, cdn) {
        calculateLabourAmount(frm, cdt, cdn);
        calculateTotalAmount(frm, cdt, cdn);
    },
    custom_westage: function (frm, cdt, cdn){
        calculateGoldValue(frm, cdt, cdn)
    },
    qty: function (frm, cdt, cdn){
        calculateLabourAmount(frm, cdt,cdn)
        calculateTotalAmount(frm, cdt, cdn);
    }
});

function calculateNetWeight(frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    var grossWeight = child.custom_gross_weight || 0;
    var lessWeight = child.custom_less_weight || 0;

    var netWeight = grossWeight - lessWeight;
    frappe.model.set_value(cdt, cdn, 'custom_net_weight', netWeight);

    calculateFineWeight(frm, cdt, cdn);
    calculateTotalWeight(frm, cdt, cdn);
}

function calculateFineWeight(frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    var purityPercentage = child.custom_purity_percentage || 0;
    var netWeight = child.custom_net_weight || 0;

    var fineWeight = netWeight / (purityPercentage / 100);
    frappe.model.set_value(cdt, cdn, 'custom_fine_weight', fineWeight);

    calculateGoldValue(frm, cdt, cdn);
    calculateTotalWeight(frm, cdt, cdn);
}

function calculateGoldValue(frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    var goldRate = child.custom_gold_rate || 0;
    var netWeight = child.custom_net_weight || 0;
    var customWholesale = frm.doc.custom_wholesale || false; 

    var goldValue;

    if (customWholesale) {
        console.log("wholesale-----------")
        var westage = child.custom_westage || 0; 
        goldValue = (netWeight * goldRate) + westage;
    } else {
        goldValue = goldRate * netWeight;
    }

    console.log("goldValue---->", goldValue)
    frappe.model.set_value(cdt, cdn, 'custom_gold_value', goldValue);
}

function fetchMetalRate(frm, cdt, cdn) {
    var child_doc = locals[cdt][cdn];
    var custom_purity = child_doc.custom_purity;
    var posting_date = frm.doc.posting_date;
    var custom_metal_type = child_doc.custom_metal_type;

    frappe.call({
        method: 'erpgold.erpgold.doctype.metal_rate.metal_rate.query',
        args: {
            metal_type: custom_metal_type,
            purity: custom_purity,
            date: posting_date
        },
        callback: function (r) {
            if (r.message && typeof r.message !== 'string') {
                frappe.model.set_value(cdt, cdn, 'custom_gold_rate', r.message);
            } else {
                frappe.msgprint(r.message);
                frappe.model.set_value(cdt, cdn, 'custom_gold_rate', 0);
            }
        }
    });
}


function calculateLabourAmount(frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    var labourType = child.custom_labour_type;
    var labourRate = child.custom_sales_labour_rate || 0;
    var quantity = child.qty || 0;

    switch (labourType) {
        case "On Gross Weight Per Gram":
            var labourAmount = (labourRate * (child.custom_gross_weight || 0)) * quantity;
            console.log("labourAmount----", labourAmount)
            break;
        case "On Net Weight Per Gram":
            var labourAmount = (labourRate * (child.custom_net_weight || 0)) * quantity;
            break;
        case "Flat":
            var labourAmount = labourRate * quantity;
            break;
        case "On Gold Value Percentage":
            var labourAmount = (child.custom_gold_value || 0) * (labourRate/100)
            break;
        default:
            break;
    }

    frappe.model.set_value(cdt, cdn, 'custom_sales_labour_amount', labourAmount);
}


function calculateTotalAmount(frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    var goldValue = child.custom_gold_value || 0;
    var labourAmount = child.custom_sales_labour_amount || 0;
    var otherAmount = child.custom_other_amount || 0;
    var discount = child.custom_discount || 0;

    var totalAmount = goldValue + labourAmount + otherAmount - discount;
    frappe.model.set_value(cdt, cdn, 'custom_total_amount', totalAmount);
    frappe.model.set_value(cdt, cdn, 'rate', totalAmount);
}

function calculateTotalWeight(frm) {
    if (frm.doc.docstatus !== 1) { // Check if document is not submitted
        var net_weight = 0, fine_weight = 0, gross_weight = 0, less_weight = 0;
        frm.doc.items.forEach(function(row) {
            net_weight += row.custom_net_weight;
            fine_weight += row.custom_fine_weight;
            gross_weight += row.custom_gross_weight;
            less_weight += row.custom_less_weight;
        });       
        frm.set_value('custom_total_net_weight', net_weight);
        frm.set_value('custom_total_fine_weight', fine_weight);
        frm.set_value('custom_total_gross_weight', gross_weight);
        frm.set_value('custom_total_less_weight', less_weight);
    }
}