
/*
 *  ExtractHexidecimalValue.js
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
// String to hold AS3 gradient values
var hexStr;
// Object on which our Palette UI will be built
var components;

// If there is a selection, begin operation
if (selectedItems.length > 0) {

    // Initialize strings
    hexStr = "";
    components = {};

    for (i = 0; i < selectedItems.length; i++) {

        // Get the selected object
        selectedItem = selectedItems[i];

        // Object to hold values for various components
        var values = {};
        
        if (selectedItem.fillColor) {
            if (typeof selectedItem.fillColor.gradient === "undefined") {
                if (typeof selectedItem.fillColor === "undefined") {
                    Dialog.alert("The selected object must have a fill.");
                } else {
                    
                    extractColors(selectedItem);
                
                    var as3Text = {
                        type : 'string',
                        label : 'AS3',
                        rows : 1,
                        multiline : false,
                        columns : 56,
                        value : hexStr
                    }
            
                    components['HexValue'] = as3Text;
            
                    var palette = new Palette('Hex Value', components);            
                }            
            } else {
                Dialog.alert("This script only works with solid colors.");
            }
        } else {
            Dialog.alert("The selected object must have a fill.");
        }        
    }
} else {
    Dialog.alert("You must select something first!");
}

/*
 * Extract red, green and blue values.
 * Convert red, green and blue values to hexidecimal.
 * Package our Arrays for further processing.
 */
function extractColors(item) {
    var red = item.fillColor.red * 255;
    var green = item.fillColor.green * 255;
    var blue = item.fillColor.blue * 255;
    
    hexStr = "0x"+rgbToHex(red, green, blue);
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