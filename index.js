var tx = require("text-encoding");

/**
  * Converts a string to the properly escaped version according to the Matrix specs on mapping from other
  * character sets ( http://matrix.org/docs/spec/intro.html#mapping-from-other-character-sets ). Does not
  * enforce length limits from said specification.
  * @param {string} input : The input string. Any UTF-8 string is valid here.
  * @param {boolean} [escapeUpper=true] : Do we want to preserve uppercase information?
  */
module.exports.toMxid = function(input, escapeUpper=true) {
	let chars = Array.from(input);
	let result = "";
	
	for (let i = 0; i < chars.length; ++i) {
		if (chars[i] >= 'A' && chars[i] <= 'Z') {
			if (escapeUpper) {
				result += "_";
			}
			result += chars[i].toLowerCase();
		}
		else if (/[a-z0-9.-]/.test(chars[i])) {
			result += chars[i];
		}
		else if (chars[i] === '_') {
			if (escapeUpper) {
				result += "_";
			}
			result += "_";
		}
		else {
			var uint8array = new tx.TextEncoder().encode(chars[i]);
			
			for (let j = 0; j < uint8array.length; ++j) {
				let hex = uint8array[j].toString(16);
				result += "=" + (hex.length === 1 ? '0' + hex : hex);
			}
		}
	}
	return result;
}

/**
  * Converts a string from the properly escaped version according to the Matrix specs on mapping from other
  * character sets ( http://matrix.org/docs/spec/intro.html#mapping-from-other-character-sets ) back to UTF-8.
  * @param {string} input : The mapped MXID
  * @param {boolean} [escapeUpper=true] : Was the original string encoded preserving uppercase information?
  */
exports.fromMxid = function(input, escapeUpper=true) {
	let chars = Array.from(input);
	var bytes = [];
	
	for (let i = 0; i < chars.length; ++i) {
		if (/[a-z0-9.-]/.test(chars[i])) {
			bytes.push(chars[i].charCodeAt(0));
		}
		else if (chars[i] === '_') {
			if (escapeUpper) {
				++i;
				if (chars[i] >= 'a' && chars[i] <= 'z') {
					bytes.push(chars[i].toUpperCase().charCodeAt(0));
				}
				else if (chars[i] === '_') {
					bytes.push('_'.charCodeAt(0));
				}
				else {
					throw new Error('Error: Underscore escaped an invalid character: ' + chars[i]
						+ " in [" + input + "]");
				}
			} else {
				bytes.push(chars[i].charCodeAt(0));
			}
		}
		else if (chars[i] === '=') {
			let char_val = parseInt(chars[i + 1] + "" + chars[i + 2], 16);
			bytes.push(char_val);
			i += 2;
		}
		else {
			throw new Error('Error: Underscore escaped an invalid character: ' + chars[i]
				+ " in [" + input + "]");
		}
	}
	return new tx.TextDecoder("utf-8").decode(new Uint8Array(bytes));
}
