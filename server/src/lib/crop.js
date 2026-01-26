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
import { ImageData } from '../image-data.js';
import floor from '@stdlib/math-base-special-floor';
import max from '@stdlib/math-base-special-max';
import min from '@stdlib/math-base-special-min';
import Uint8ClampedArray from '@stdlib/array-uint8c';


// MAIN //

/**
* Crops image to specified region using ndarray slicing.
*
* @param {ImageData} imageData - source image data
* @param {number} cropX - x offset percentage (0-100)
* @param {number} cropY - y offset percentage (0-100)
* @param {number} cropWidth - width percentage (1-100)
* @param {number} cropHeight - height percentage (1-100)
* @returns {ImageData} cropped image data
*/
function crop( imageData, cropX, cropY, cropWidth, cropHeight ) {
	// Create ndarray from source image:
	const srcArr = createNdarray( imageData );
	const srcHeight = srcArr.shape[ 0 ];
	const srcWidth = srcArr.shape[ 1 ];

	// Convert percentage values to pixel coordinates:
	let startCol = floor( ( cropX / 100 ) * srcWidth );
	let startRow = floor( ( cropY / 100 ) * srcHeight );
	let actualWidth = floor( ( cropWidth / 100 ) * srcWidth );
	let actualHeight = floor( ( cropHeight / 100 ) * srcHeight );

	// Clamp values to valid range:
	startCol = max( 0, min( startCol, srcWidth - 1 ) );
	startRow = max( 0, min( startRow, srcHeight - 1 ) );
	actualWidth = max( 1, min( actualWidth, srcWidth - startCol ) );
	actualHeight = max( 1, min( actualHeight, srcHeight - startRow ) );

	// Create destination ndarray:
	const dstData = new Uint8ClampedArray( actualWidth * actualHeight * 4 );
	const dstArr = new ndarray( 'uint8c', dstData, [ actualHeight, actualWidth, 4 ], [ actualWidth * 4, 4, 1 ], 0, 'row-major' ); // eslint-disable-line max-len

	// Copy pixels using ndarray get/set methods:
	for ( let row = 0; row < actualHeight; row++ ) {
		for ( let col = 0; col < actualWidth; col++ ) {
			for ( let c = 0; c < 4; c++ ) {
				dstArr.set( row, col, c, srcArr.get( startRow + row, startCol + col, c ) ); // eslint-disable-line max-len
			}
		}
	}
	return new ImageData( dstData, actualWidth, actualHeight );
}


// EXPORTS //

export { crop };
