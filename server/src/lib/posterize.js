/**
* @license Apache-2.0
*
* Copyright (c) 2026 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

// MODULES //

import unary from '@stdlib/ndarray-base-unary';
import floor from '@stdlib/math-base-special-floor';


// MAIN //

/**
* Reduces color depth (posterize effect).
*
* @param {ImageData} imageData - canvas image data
* @param {number} levels - number of color levels (2-256)
* @returns {ImageData} modified image data
*/
function posterize( imageData, levels = 4 ) {
	const data = imageData.data;
	const numPixels = imageData.width * imageData.height;
	const step = 255 / ( levels - 1 );

	// Build lookup table for posterization:
	const lut = new Uint8Array( 256 );
	for ( let i = 0; i < 256; i++ ) {
		lut[ i ] = floor( i / step ) * step;
	}

	/**
	* Posterizes a single color value using lookup table.
	*
	* @private
	* @param {number} x - input value (0-255)
	* @returns {number} posterized value
	*/
	function posterizeValue( x ) {
		return lut[ x ];
	}

	const rChannel = {
		'dtype': 'uint8c',
		'data': data,
		'shape': [ numPixels ],
		'strides': [ 4 ],
		'offset': 0,
		'order': 'row-major'
	};
	const gChannel = {
		'dtype': 'uint8c',
		'data': data,
		'shape': [ numPixels ],
		'strides': [ 4 ],
		'offset': 1,
		'order': 'row-major'
	};
	const bChannel = {
		'dtype': 'uint8c',
		'data': data,
		'shape': [ numPixels ],
		'strides': [ 4 ],
		'offset': 2,
		'order': 'row-major'
	};

	unary( [ rChannel, rChannel ], posterizeValue );
	unary( [ gChannel, gChannel ], posterizeValue );
	unary( [ bChannel, bChannel ], posterizeValue );

	return imageData;
}


// EXPORTS //

export { posterize };
