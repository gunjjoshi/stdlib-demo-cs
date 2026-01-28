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

import floor from '@stdlib/math-base-special-floor';


// MAIN //

/**
* Rotates image 180 degrees.
*
* @param {ImageData} imageData - canvas image data
* @returns {ImageData} modified image data
*/
function rotate180( imageData ) {
	const data = imageData.data;
	const numPixels = imageData.width * imageData.height;
	const halfPixels = floor( numPixels / 2 );

	// Swap pixels from the beginning and end of the buffer:
	for ( let i = 0; i < halfPixels; i++ ) {
		const startIdx = i * 4;
		const endIdx = ( numPixels - 1 - i ) * 4;

		const tempR = data[ startIdx ];
		const tempG = data[ startIdx + 1 ];
		const tempB = data[ startIdx + 2 ];
		const tempA = data[ startIdx + 3 ];

		data[ startIdx ] = data[ endIdx ];
		data[ startIdx + 1 ] = data[ endIdx + 1 ];
		data[ startIdx + 2 ] = data[ endIdx + 2 ];
		data[ startIdx + 3 ] = data[ endIdx + 3 ];

		data[ endIdx ] = tempR;
		data[ endIdx + 1 ] = tempG;
		data[ endIdx + 2 ] = tempB;
		data[ endIdx + 3 ] = tempA;
	}
	return imageData;
}


// EXPORTS //

export { rotate180 };
