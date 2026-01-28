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

import round from '@stdlib/math-base-special-round';
import Uint8ClampedArray from '@stdlib/array-uint8c';


// MAIN //

/**
* Applies box blur to image.
*
* @param {ImageData} imageData - canvas image data
* @param {number} radius - blur radius (1-10)
* @returns {ImageData} modified image data
*/
function boxBlur( imageData, radius = 1 ) {
	const data = imageData.data;
	const width = imageData.width;
	const height = imageData.height;
	const rowBytes = width * 4;

	const original = new Uint8ClampedArray( data );

	for ( let row = 0; row < height; row++ ) {
		for ( let col = 0; col < width; col++ ) {
			let sumR = 0;
			let sumG = 0;
			let sumB = 0;
			let count = 0;

			// Accumulate values from neighboring pixels:
			for ( let ky = -radius; ky <= radius; ky++ ) {
				const ny = row + ky;
				if ( ny >= 0 && ny < height ) {
					for ( let kx = -radius; kx <= radius; kx++ ) {
						const nx = col + kx;
						if ( nx >= 0 && nx < width ) {
							const idx = ( ny * rowBytes ) + ( nx * 4 );
							sumR += original[ idx ];
							sumG += original[ idx + 1 ];
							sumB += original[ idx + 2 ];
							count += 1;
						}
					}
				}
			}

			// Write averaged values:
			const outIdx = ( row * rowBytes ) + ( col * 4 );
			data[ outIdx ] = round( sumR / count );
			data[ outIdx + 1 ] = round( sumG / count );
			data[ outIdx + 2 ] = round( sumB / count );
		}
	}
	return imageData;
}


// EXPORTS //

export { boxBlur };
