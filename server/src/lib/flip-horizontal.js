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
* Flips image horizontally (mirror).
*
* @param {ImageData} imageData - canvas image data
* @returns {ImageData} modified image data
*/
function flipHorizontal( imageData ) {
	const data = imageData.data;
	const width = imageData.width;
	const height = imageData.height;
	const rowBytes = width * 4;
	const halfWidth = floor( width / 2 );

	// Process each row and swap pixels from left to right:
	for ( let row = 0; row < height; row++ ) {
		const rowOffset = row * rowBytes;
		for ( let col = 0; col < halfWidth; col++ ) {
			const leftIdx = rowOffset + ( col * 4 );
			const rightIdx = rowOffset + ( ( width - 1 - col ) * 4 );

			const tempR = data[ leftIdx ];
			const tempG = data[ leftIdx + 1 ];
			const tempB = data[ leftIdx + 2 ];
			const tempA = data[ leftIdx + 3 ];

			data[ leftIdx ] = data[ rightIdx ];
			data[ leftIdx + 1 ] = data[ rightIdx + 1 ];
			data[ leftIdx + 2 ] = data[ rightIdx + 2 ];
			data[ leftIdx + 3 ] = data[ rightIdx + 3 ];

			data[ rightIdx ] = tempR;
			data[ rightIdx + 1 ] = tempG;
			data[ rightIdx + 2 ] = tempB;
			data[ rightIdx + 3 ] = tempA;
		}
	}
	return imageData;
}


// EXPORTS //

export { flipHorizontal };
