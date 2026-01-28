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
* Flips image vertically.
*
* @param {ImageData} imageData - canvas image data
* @returns {ImageData} modified image data
*/
function flipVertical( imageData ) {
	const data = imageData.data;
	const width = imageData.width;
	const height = imageData.height;
	const rowBytes = width * 4;
	const halfHeight = floor( height / 2 );

	// Swap entire rows from top to bottom:
	for ( let row = 0; row < halfHeight; row++ ) {
		const topOffset = row * rowBytes;
		const bottomOffset = ( height - 1 - row ) * rowBytes;

		// Swap all pixels in the row:
		for ( let i = 0; i < rowBytes; i++ ) {
			const temp = data[ topOffset + i ];
			data[ topOffset + i ] = data[ bottomOffset + i ];
			data[ bottomOffset + i ] = temp;
		}
	}
	return imageData;
}


// EXPORTS //

export { flipVertical };
