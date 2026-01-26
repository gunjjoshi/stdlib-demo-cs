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
import clamp from '@stdlib/math-base-special-clamp';
import round from '@stdlib/math-base-special-round';
import sqrt from '@stdlib/math-base-special-sqrt';
import Uint8ClampedArray from '@stdlib/array-uint8c';


// VARIABLES //

const SOBEL_X = [
	-1,
	0,
	1,
	-2,
	0,
	2,
	-1,
	0,
	1
];

const SOBEL_Y = [
	-1,
	-2,
	-1,
	0,
	0,
	0,
	1,
	2,
	1
];


// MAIN //

/**
* Applies edge detection using Sobel operator.
*
* @param {ImageData} imageData - canvas image data
* @returns {ImageData} modified image data
*/
function edgeDetect( imageData ) {
	const arr = createNdarray( imageData );
	const height = arr.shape[ 0 ];
	const width = arr.shape[ 1 ];

	// Create a copy of the original data as an ndarray:
	const originalData = new Uint8ClampedArray( arr.data );
	const original = new ndarray( 'uint8c', originalData, arr.shape, arr.strides, arr.offset, 'row-major' ); // eslint-disable-line max-len

	for ( let row = 1; row < height - 1; row++ ) {
		for ( let col = 1; col < width - 1; col++ ) {
			let gx = 0;
			let gy = 0;

			for ( let ky = -1; ky <= 1; ky++ ) {
				for ( let kx = -1; kx <= 1; kx++ ) {
					const ny = row + ky;
					const nx = col + kx;
					const ki = ( ( ky + 1 ) * 3 ) + ( kx + 1 );
					const r = original.get( ny, nx, 0 );
					const g = original.get( ny, nx, 1 );
					const b = original.get( ny, nx, 2 );
					const gray = round( ( 0.299 * r ) + ( 0.587 * g ) + ( 0.114 * b ) );
					gx += gray * SOBEL_X[ ki ];
					gy += gray * SOBEL_Y[ ki ];
				}
			}
			const mag = clamp( sqrt( ( gx * gx ) + ( gy * gy ) ), 0, 255 );
			arr.set( row, col, 0, mag );
			arr.set( row, col, 1, mag );
			arr.set( row, col, 2, mag );
		}
	}
	return imageData;
}


// EXPORTS //

export { edgeDetect };
