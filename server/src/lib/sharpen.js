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
import Uint8ClampedArray from '@stdlib/array-uint8c';


// VARIABLES //

// Sharpening kernel (3x3):
const KERNEL = [ 0, -1, 0, -1, 5, -1, 0, -1, 0 ];


// MAIN //

/**
* Applies sharpening filter to image.
*
* @param {ImageData} imageData - canvas image data
* @returns {ImageData} modified image data
*/
function sharpen( imageData ) {
	const data = imageData.data;
	const width = imageData.width;
	const height = imageData.height;
	const rowBytes = width * 4;

	const original = new Uint8ClampedArray( data );

	for ( let row = 1; row < height - 1; row++ ) {
		for ( let col = 1; col < width - 1; col++ ) {
			let sumR = 0;
			let sumG = 0;
			let sumB = 0;

			// Apply 3x3 convolution kernel:
			for ( let ky = -1; ky <= 1; ky++ ) {
				for ( let kx = -1; kx <= 1; kx++ ) {
					const ny = row + ky;
					const nx = col + kx;
					const idx = ( ny * rowBytes ) + ( nx * 4 );
					const ki = ( ( ky + 1 ) * 3 ) + ( kx + 1 );
					const w = KERNEL[ ki ];
					sumR += original[ idx ] * w;
					sumG += original[ idx + 1 ] * w;
					sumB += original[ idx + 2 ] * w;
				}
			}

			const outIdx = ( row * rowBytes ) + ( col * 4 );
			data[ outIdx ] = clamp( round( sumR ), 0, 255 );
			data[ outIdx + 1 ] = clamp( round( sumG ), 0, 255 );
			data[ outIdx + 2 ] = clamp( round( sumB ), 0, 255 );
		}
	}
	return imageData;
}


// EXPORTS //

export { sharpen };
