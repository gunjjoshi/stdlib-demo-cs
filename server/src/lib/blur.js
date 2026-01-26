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

import { createNdarray, ndarray } from './ndarray.js';
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
	const arr = createNdarray( imageData );
	const height = arr.shape[ 0 ];
	const width = arr.shape[ 1 ];

	// Create a copy of the original data as an ndarray:
	const originalData = new Uint8ClampedArray( arr.data );
	const original = new ndarray( 'uint8c', originalData, arr.shape, arr.strides, arr.offset, 'row-major' ); // eslint-disable-line max-len

	for ( let row = 0; row < height; row++ ) {
		for ( let col = 0; col < width; col++ ) {
			let sumR = 0;
			let sumG = 0;
			let sumB = 0;
			let count = 0;

			for ( let ky = -radius; ky <= radius; ky++ ) {
				for ( let kx = -radius; kx <= radius; kx++ ) {
					const ny = row + ky;
					const nx = col + kx;
					if ( ny >= 0 && ny < height && nx >= 0 && nx < width ) {
						sumR += original.get( ny, nx, 0 );
						sumG += original.get( ny, nx, 1 );
						sumB += original.get( ny, nx, 2 );
						count += 1;
					}
				}
			}
			arr.set( row, col, 0, round( sumR / count ) );
			arr.set( row, col, 1, round( sumG / count ) );
			arr.set( row, col, 2, round( sumB / count ) );
		}
	}
	return imageData;
}


// EXPORTS //

export { boxBlur };
