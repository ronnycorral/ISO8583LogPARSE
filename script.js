function displayText() {
// just gets the data, calls the main function, and displays the output
	var newtext = document.myform.inputtext.value;
        var textToDisplay = convertLogEntry(newtext);
	document.myform.outputtext.value = textToDisplay;
}

function convertLogEntry(text) {
// main loop of script to convert log entry
   var bitMapUpperHalf = "";
   var hexLine = convertToHex(text);
   // dropping BHNUMS and null character
   hexLine = hexLine.slice(14);
   // this tells me now many more characters to throw out
   var headerCount = parseInt(hexLine.slice(0,2),16);
   hexLine = hexLine.slice(2 + (headerCount * 2));

   var mtiCode = hexLine.slice(0,4);
   hexLine = hexLine.slice(4);
   var textToDisplay = "Transaction type - " + mtiCode + " (" + mti[mtiCode] + ")\n\n";

   var funcRet = hexToBinary(hexLine,16);
   var bitMap = funcRet[0];
   hexLine = funcRet[1];

//    console.log("binary bitmap is !" + bitMap + "!")
//    console.log("hex bitmap is !" + hexLine + "!")

    for (i=0; i < bitMap.length; i++) {
      if(bitMap.charAt(i) == '1') {
         var field = i+1
         switch(field) {
           case 1:
              funcRet = hexToBinary(hexLine,16);
              bitMapUpperHalf = funcRet[0];
           break;
           case 2:
              funcRet = varLenValue(hexLine,2);
              textToDisplay += field + ") Primary account number: \"" + funcRet[0] + "\"\n";
           break;
           case 3:
              funcRet = fixedLenValue(hexLine,6);
              textToDisplay += field + ") Processing code: \"" + funcRet[0] + "\" (" + processingcodetype[funcRet[0]] + ")\n";
           break;
           case 4:
              funcRet = fixedLenValue(hexLine,12);
              textToDisplay += field + ") Transaction amount: \"" + funcRet[0] + "\"\n";
           break;
           case 6:
              funcRet = fixedLenValue(hexLine,12);
              textToDisplay += field + ") Card holder billing amount: \"" + funcRet[0] + "\"\n";
           break;
           case 7:
              funcRet = fixedLenValue(hexLine,12);
              textToDisplay += field + ") Transaction date and time: \"" + funcRet[0] + "\"\n";
           break;
           case 10:
              funcRet = fixedLenValue(hexLine,8);
              var decimalCount = funcRet[0].slice(0,1)
              var conversionRate = funcRet[0].slice(1)
              conversionRate = conversionRate / Math.pow(10, decimalCount)
              textToDisplay += field + ") Cardholde billing conversion rate: \"" + conversionRate + "\"\n";
           break;
           case 11:
              funcRet = fixedLenValue(hexLine,6);
              textToDisplay += field + ") System trace audit number: \"" + funcRet[0] + "\"\n";
           break;
           case 12:
              funcRet = fixedLenValue(hexLine,6);
              textToDisplay += field + ") Local transaction time: \"" + funcRet[0] + "\"\n";
           break;
           case 13:
              funcRet = fixedLenValue(hexLine,6);
              textToDisplay += field + ") Local transaction date: \"" + funcRet[0] + "\"\n";
           break;
           case 18:
              funcRet = fixedLenValue(hexLine,4);
              textToDisplay += field + ") Merchent catagory code: \"" + funcRet[0] + "\" (" + mcctype[funcRet[0]] + ")\n";
           break;
           case 22:
              //throw away first char since we want 3 and hex values are only even numbers.
              hexLine = hexLine.slice(1);
              funcRet = fixedLenValue(hexLine,3);
              textToDisplay += field + ") POS entry code: \"" + funcRet[0] + "\" (" + posentrymodetype[funcRet[0]] + ")\n";
           break;
           case 28:
              funcRet = fixedLenValue(hexLine,12);
              textToDisplay += field + ") Transaction fee amount: \"" + funcRet[0] + "\"\n";
           break;
           case 32:
              funcRet = varLenValue(hexLine,2);
              textToDisplay += field + ") Acquiring institution number: \"" + funcRet[0] + "\"\n";
           break;
           case 35:
              funcRet = varLenValue(hexLine,2);
              textToDisplay += field + ") Track 2 data: \"" + funcRet[0] + "\"\n";
           break;
           case 37:
              funcRet = fixedLenValue(hexLine,24,1);
              textToDisplay += field + ") Retrieval reference number: \"" + funcRet[0] + "\"\n";
           break;
           case 38:
              funcRet = fixedLenValue(hexLine,12,1);
              textToDisplay += field + ") Auth authentication response: \"" + funcRet[0] + "\"\n";
           break;
           case 39:
              funcRet = fixedLenValue(hexLine,4,1);
              textToDisplay += field + ") Response code: \"" + funcRet[0] + "\" (" + responsecodetypes[funcRet[0]] + ")\n";
           break;
           case 41:
              funcRet = fixedLenValue(hexLine,32,1);
              textToDisplay += field + ") Merchent terminal ID: \"" + funcRet[0] + "\"\n";
           break;
           case 42:
              funcRet = fixedLenValue(hexLine,30,1);
              textToDisplay += field + ") Merchent ID: \"" + funcRet[0] + "\"\n";
           break;
           case 43:
              funcRet = fixedLenValue(hexLine,80,1);
              textToDisplay += field + ") Merchent location: \"" + funcRet[0] + "\"\n";
           break;
           case 49:
              //throw away first char since we want 3 and hex values are only even numbers.
              hexLine = hexLine.slice(1);
              funcRet = fixedLenValue(hexLine,3);
              textToDisplay += field + ") Transaction currency code: \"" + funcRet[0] + "\" (" + currencycodetype[funcRet[0]] + ")\n";
           break;
           case 51:
              //throw away first char since we want 3 and hex values are only even numbers.
              hexLine = hexLine.slice(1);
              funcRet = fixedLenValue(hexLine,3);
              textToDisplay += field + ") Card holder billing currency code: \"" + funcRet[0] + "\" (" + currencycodetype[funcRet[0]] + ")\n";
           break;
           case 62:
              funcRet = parseField62(hexLine);
              textToDisplay += funcRet[0];
           break;
           case 63:
              funcRet = parseField63(hexLine);
              textToDisplay += funcRet[0];
           break;
           default:
              textToDisplay += "I don't know what to do with " + field + ", show this to Ron\n";
           break;
         }
      }
    hexLine = funcRet[1];
    }


    for (i=0; i < bitMapUpperHalf.length; i++) {
      if(bitMapUpperHalf.charAt(i) == '1') {
         var field = i+65
         switch(field) {
           case 70:
              hexLine = hexLine.slice(1);
              funcRet = fixedLenValue(hexLine,3);
              textToDisplay += field + ") Network managemet code: \"" + funcRet[0] + "\" (" + networkmanagementcodetype[funcRet[0]] + ")\n";
           break;
           case 120:
              funcRet = parseField120(hexLine);
              textToDisplay += funcRet[0];
           break;
           case 121:
              funcRet = varLenValue(hexLine,4);
              textToDisplay += field + ") Terms and conditions: \"" + funcRet[0] + "\"\n";
           break;
           default:
              textToDisplay += "I don't know what to do with " + field + ", show this to Ron\n";
           break;
         }
       }
    hexLine = funcRet[1];
    }


   return textToDisplay;
}

function varLenValue(text,lenOfLen) {
    var ret = '', hexS = '';
// gets a variable length value from the hex string
    var lenOfString = parseInt(text.slice(0,lenOfLen),16) * 2;
    text = text.slice(lenOfLen)
    ret = hex2a(text.slice(0,lenOfString));
    hexS = text.slice(lenOfString);
    return  [ ret, hexS ] ;
}

function varLenValueHex(text,lenOfLen) {
    var ret = '', hexS = '';
// gets a variable length value from the hex string
    var lenOfString = parseInt(text.slice(0,lenOfLen),16) * 2;
    text = text.slice(lenOfLen)
    ret = text.slice(0,lenOfString);
    hexS = text.slice(lenOfString);
    return  [ ret, hexS ] ;
}

function fixedLenValue(text,lenOfValue,convertToAscii) {
    var ret = text.slice(0,lenOfValue);
    var hexS = text.slice(lenOfValue);
    if (convertToAscii) {
      ret = hex2a(ret);
    }
    return  [ ret, hexS ] ;
}

function convertToHex(text) {
// converts line log entry to a line of HEX data
   var singleLines = text.split('\n');
   var numberOfLines = singleLines.length;
   var BHNUMS = '42 48 4E 55 4D 53';
   var firstLine = singleLines[0];
   var hexData = firstLine.slice(firstLine.indexOf(BHNUMS),firstLine.indexOf(BHNUMS) + 48);
   for (var i = 1; i < numberOfLines; i++) {
     var startOfHex = singleLines[i].search(/  \b/);
     if (startOfHex > 0) {
        hexData += singleLines[i].slice(startOfHex, startOfHex+50);
     }
   }
   hexData=hexData.replace(/\s/g,'');
   return hexData;
}

function hexToBinary(h,l) {
    var i, k, part, ret = '', hexS = '';
    s = h.slice(0,l)
    hexS = h.slice(l)
 
    // lookup table for easier conversion. '0' characters are padded for '1' to '7'
    var lookupTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
        'e': '1110', 'f': '1111',
        'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101',
        'E': '1110', 'F': '1111'
    };
    for (i = 0; i < s.length; i += 1) {
            ret += lookupTable[s[i]];
    }
    return  [ ret, hexS ];
}

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function parseField63(text) {
    var ret = "63) Additional transaction fields\n";
    //throw away 4 chars for length we don't use
    text = text.slice(4);
    var funcRet = hexToBinary(text,16);
    var bitMap = funcRet[0];
    var hexS = funcRet[1];

    for (var i=0; i < bitMap.length; i++) {
      if(bitMap.charAt(i) == '1') {
         var field = i+1
         switch(field) {
           case 2:
              funcRet = varLenValue(hexS,2);
              ret += "  " + field + ") Product ID: \"" + funcRet[0] + "\"\n";
           break;
           case 3:
              var balancelen = 10;
              funcRet = fixedLenValue(hexS,2);
              var dorc = funcRet[0];
              hexS = funcRet[1];
              if ( dorc == '43' || dorc == '44') {
                 balancelen = 12;
                 dorc = hex2a(dorc);
              }
              funcRet = fixedLenValue(hexS,balancelen);
              ret += "  " + field + ") Balance Amount: \"" + dorc + funcRet[0] + "\"\n";
           break;
           case 4:
              funcRet = fixedLenValue(hexS,32,1);
              ret += "  " + field + ") Redemption pin: \"" + funcRet[0] + "\"\n";
           break;
           case 5:
              funcRet = varLenValue(hexS,2);
              ret += "  " + field + ") Phone number: \"" + funcRet[0] + "\"\n";
           break;
           case 6:
              funcRet = varLenValue(hexS,2);
              ret += "  " + field + ") Redemption account number: \"" + funcRet[0] + "\"\n";
           break;
           case 7:
              funcRet = varLenValue(hexS,2);
              ret += "  " + field + ") External account number: \"" + funcRet[0] + "\"\n";
           break;
//           case 13:
//console.log("field 13 " + hexS)
//           break;
           case 18:
              funcRet = fixedLenValue(hexS,52,1);
              ret += "  " + field + ") Transaction unique  ID: \"" + funcRet[0] + "\"\n";
           break;
           case 19:
              funcRet = fixedLenValue(hexS,52,1);
              ret += "  " + field + ") Correlated transaction unique  ID: \"" + funcRet[0] + "\"\n";
           break;
           default:
              ret += "  I don't know what to do with " + field + ", show this to Ron\n";
           break;
         }
      }
    hexS = funcRet[1];
    }
    

    return  [ ret, hexS ];
}


function parseField62(text) {
    var ret = "62) Additional support fields\n";
    //throw away 4 chars for length we don't use
    text = text.slice(4);
    var funcRet = hexToBinary(text,16);
    var bitMap = funcRet[0];
    var hexS = funcRet[1];

    for (var i=0; i < bitMap.length; i++) {
      if(bitMap.charAt(i) == '1') {
         var field = i+1
         switch(field) {
           case 3:
              funcRet = parseSecondaryAccounts(hexS);
              ret += "  " + field + ") Secondary account Numbers: \n" + funcRet[0];
           break;
           case 4:
              funcRet = varLenValue(hexS,2);
              ret += "  " + field + ") Blackhawk order ID: \"" + funcRet[0] + "\"\n";
           break;
           case 5:
              funcRet = varLenValue(hexS,2);
              ret += "  " + field + ") External order ID: \"" + funcRet[0] + "\"\n";
           break;
           case 6:
              funcRet = fixedLenValue(hexS,6);
              ret += "  " + field + ") Shipment date: \"" + funcRet[0] + "\"\n";
           break;
           case 7:
              funcRet = fixedLenValue(hexS,20,1);
              ret += "  " + field + ") BHN Shipment Carrier Code: \"" + funcRet[0] + "\"\n";
           break;
           case 8:
              funcRet = varLenValue(hexS,2);
              ret += "  " + field + ") BHN Shipment Method Name: \"" + funcRet[0] + "\"\n";
           break;
           case 9:
              funcRet = varLenValue(hexS,2);
              ret += "  " + field + ") External Shipment Method Name: \"" + funcRet[0] + "\"\n";
           break;
           case 10:
              funcRet = varLenValue(hexS,2);
              ret += "  " + field + ") Shipment address: \"" + funcRet[0] + "\"\n";
           break;
           case 11:
              funcRet = fixedLenValue(hexS,12);
              ret += "  " + field + ") Shipment cost: \"" + funcRet[0] + "\"\n";
           break;
           case 12:
              funcRet = varLenValue(hexS,2);
              ret += "  " + field + ") Shipment tracking number: \"" + funcRet[0] + "\"\n";
           break;
           case 13:
              funcRet = varLenValue(hexS,2);
              ret += "  " + field + ") BHN PO number: \"" + funcRet[0] + "\"\n";
           break;
           case 17:
              funcRet = fixedLenValue(hexS,12);
              ret += "  " + field + ") Sales tax: \"" + funcRet[0] + "\"\n";
           break;
           case 18:
              funcRet = fixedLenValue(hexS,12);
              ret += "  " + field + ") Purchase fee: \"" + funcRet[0] + "\"\n";
           break;
           case 19:
              funcRet = fixedLenValue(hexS,12);
              ret += "  " + field + ") Customization fee: \"" + funcRet[0] + "\"\n";
           break;
           default:
              ret += "  I don't know what to do with " + field + ", show this to Ron\n";
           break;
         }
      }
    hexS = funcRet[1];
    }

    return  [ ret, hexS ];
}


function parseField120(text) {
    var ret = "120) Receipts fields\n";
    var funcRet = varLenValueHex(text,4);
    var hexS = funcRet[1];
    // throw out unused field count
    var receiptFields = funcRet[0].slice(16);

    while (receiptFields.length > 0) {
      funcRet = varLenValue(receiptFields,2)
      ret += "  " + funcRet[0] + "\n";
      receiptFields = funcRet[1];
    } 


    return  [ ret, hexS ];
}


function parseSecondaryAccounts(text) {
    var ret = '', hexS = '';
    //dump first 4 chars header, not sure what they do
    hexS = text.slice(4)
    var funcRet = hexToBinary(hexS,2);
    //find the number of '1's in the "bit map"
    var cardCount = (funcRet[0].split("1").length - 1 )
    hexS = funcRet[1];

    for (var i=1; i <= cardCount; i++) {
       ret += "      Secondary account #" + i + "\n"
       //throw away unused header
       hexS = hexS.slice(20)

       //get account number
       funcRet = varLenValue(hexS,2)
       ret += "        Account number: \"" + funcRet[0] + "\"\n";
       hexS = funcRet[1];

       //get amount
       funcRet = fixedLenValue(hexS,12)
       ret += "        Amount: \"" + funcRet[0] + "\"\n";
       hexS = funcRet[1];

       //get currency code
       hexS = hexS.slice(1)
       funcRet = fixedLenValue(hexS,3)
       ret += "        Currency code: \"" + funcRet[0] + "\" (" + currencycodetype[funcRet[0]] + ")\n"
       hexS = funcRet[1];

       //get secondary product id
       funcRet = varLenValue(hexS,2)
       ret += "        Product ID: \"" + funcRet[0] + "\"\n";
       hexS = funcRet[1];
    }

    return  [ ret, hexS ];
}
