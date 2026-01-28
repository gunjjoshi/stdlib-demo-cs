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

import clamp from '@stdlib/math-base-special-clamp';
import round from '@stdlib/math-base-special-round';
import sqrt from '@stdlib/math-base-special-sqrt';
import Uint8ClampedArray from '@stdlib/array-uint8c';


// VARIABLES //

// Sobel X kernel:
const SOBEL_X = [ -1, 0, 1, -2, 0, 2, -1, 0, 1 ];

// Sobel Y kernel:
const SOBEL_Y = [ -1, -2, -1, 0, 0, 0, 1, 2, 1 ];


// MAIN //

/**
* Applies edge detection using Sobel operator.
*
* @param {ImageData} imageData - canvas image data
* @returns {ImageData} modified image data
*/
function edgeDetect( imageData ) {
	const data = imageData.data;
	const width = imageData.width;
	const height = imageData.height;
	const rowBytes = width * 4;

	const original = new Uint8ClampedArray( data );

	for ( let row = 1; row < height - 1; row++ ) {
		for ( let col = 1; col < width - 1; col++ ) {
			let gx = 0;
			let gy = 0;

			// Apply Sobel operators:
			for ( let ky = -1; ky <= 1; ky++ ) {
				for ( let kx = -1; kx <= 1; kx++ ) {
					const ny = row + ky;
					const nx = col + kx;
					const idx = ( ny * rowBytes ) + ( nx * 4 );
					const ki = ( ( ky + 1 ) * 3 ) + ( kx + 1 );
					const r = original[ idx ];
					const g = original[ idx + 1 ];
					const b = original[ idx + 2 ];

					// Compute grayscale:
					const gray = round( ( 0.299 * r ) + ( 0.587 * g ) + ( 0.114 * b ) );
					gx += gray * SOBEL_X[ ki ];
					gy += gray * SOBEL_Y[ ki ];
				}
			}

			// Compute gradient magnitude:
			const mag = clamp( sqrt( ( gx * gx ) + ( gy * gy ) ), 0, 255 );
			const outIdx = ( row * rowBytes ) + ( col * 4 );
			data[ outIdx ] = mag;
			data[ outIdx + 1 ] = mag;
			data[ outIdx + 2 ] = mag;
		}
	}
	return imageData;
}


// EXPORTS //

export { edgeDetect };
