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
import pow from '@stdlib/math-base-special-pow';
import round from '@stdlib/math-base-special-round';


// MAIN //

/**
* Applies gamma correction to image.
*
* @param {ImageData} imageData - canvas image data
* @param {number} gammaValue - gamma value (0.1-5.0)
* @returns {ImageData} modified image data
*/
function gamma( imageData, gammaValue = 1.0 ) {
	const data = imageData.data;
	const numPixels = imageData.width * imageData.height;
	const gammaCorrection = 1.0 / gammaValue;

	// Build lookup table for gamma correction:
	const lut = new Uint8Array( 256 );
	for ( let i = 0; i < 256; i++ ) {
		lut[ i ] = round( 255 * pow( i / 255, gammaCorrection ) );
	}

	/**
	* Applies gamma correction to a single color value using lookup table.
	*
	* @private
	* @param {number} x - input value (0-255)
	* @returns {number} gamma-corrected value
	*/
	function gammaCorrect( x ) {
		return lut[ x ];
	}

	// Create ndarray-like objects for each RGB channel:
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

	unary( [ rChannel, rChannel ], gammaCorrect );
	unary( [ gChannel, gChannel ], gammaCorrect );
	unary( [ bChannel, bChannel ], gammaCorrect );

	return imageData;
}


// EXPORTS //

export { gamma };
