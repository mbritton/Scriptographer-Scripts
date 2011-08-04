
/*
 *  ExtractGradientToFlash.js
 *  By Mike Britton
 *  http://www.mikebritton.com
 *  09/04/2011
 * 
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 * 
 */


// Get all selected objects
var selectedItems = document.selectedItems;
// Object that is the focus of extraction
var selectedItem;
// Array to hold the hex values
var hexAr;
// Array to hold ramp points
var rampAr;
// String to hold AS3 gradient values
var as3GradientStr;
// String to hold MXML gradient values
var mxmlGradientStr;
// Object on which our Palette UI will be built
var components;

// If there is a selection, begin operation
if (selectedItems.length > 0) {

    // Initialize strings
    as3GradientStr = "";
    mxmlGradientStr = "";
    components = {};

    for (i = 0; i < selectedItems.length; i++) {

        // Get the selected object
        selectedItem = selectedItems[i];

        // Clear Arrays
        rampAr = new Array();
        hexAr = new Array();

        // Object to hold values for various components
        var values = {};

        if (typeof selectedItem.fillColor.gradient === "undefined") {
            Dialog.alert("Extraction requires the selected object to contain a gradient.");
        } else {
            
            extractColors(selectedItem);
            buildStrings();
        
            var as3Text = {
                type : 'string',
                label : 'AS3',
                rows : hexAr.length,
                multiline : true,
                columns : 56,
                value : as3GradientStr
            }
    
            var mxmlText = {
                type : 'string',
                label : 'MXML',
                rows : hexAr.length,
                multiline : true,
                columns : 56,
                value : mxmlGradientStr
            }
    
            components['AS3'] = as3Text;
            components['MXML'] = mxmlText;
    
            var palette = new Palette('GradientEntries', components);            
        }
    }
} else {
    Dialog.alert("You must select something first!");
}

/*
 * Build AS3 and MXML strings.
 */
function buildStrings() {
    for (i = 0; i < hexAr.length; i++) {
        as3GradientStr += "var g" + i + ":GradientEntry = new GradientEntry(0x" + hexAr[i] + ", " + rampAr[i] + ", 1);";
        mxmlGradientStr += "<s:GradientEntry color='0x" + hexAr[i] + "' alpha='1' />";
    }
}

/*
 * Extract red, green and blue values.
 * Convert red, green and blue values to hexidecimal.
 * Package our Arrays for further processing.
 */
function extractColors(item) {
    for (i = 0; i < item.fillColor.gradient.stops.length; i++) {
        var red = item.fillColor.gradient.stops[i].color.red * 255;
        var green = item.fillColor.gradient.stops[i].color.green * 255;
        var blue = item.fillColor.gradient.stops[i].color.blue * 255;
        var hex = rgbToHex(red, green, blue);

        hexAr.push(hex);
        rampAr.push(item.fillColor.gradient.stops[i].rampPoint);
    }
}

/*
 * Convert RGB (0-255) values to hexidecimal.
 */
function rgbToHex(R, G, B) {
    return toHex(R) + toHex(G) + toHex(B)
}

/*
 * Create a hexidecimal number
 */
function toHex(n) {
    n = parseInt(n, 10);

    if (isNaN(n)) {
        return "00";
    }
    
    n = Math.max(0, Math.min(n, 255));

    return "0123456789ABCDEF".charAt(( n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
}