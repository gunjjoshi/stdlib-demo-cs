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

import { ImageData } from '../image-data.js';
import floor from '@stdlib/math-base-special-floor';
import max from '@stdlib/math-base-special-max';
import min from '@stdlib/math-base-special-min';
import Uint8ClampedArray from '@stdlib/array-uint8c';


// MAIN //

/**
* Crops image to specified region.
*
* @param {ImageData} imageData - source image data
* @param {number} cropX - x offset percentage (0-100)
* @param {number} cropY - y offset percentage (0-100)
* @param {number} cropWidth - width percentage (1-100)
* @param {number} cropHeight - height percentage (1-100)
* @returns {ImageData} cropped image data
*/
function crop( imageData, cropX, cropY, cropWidth, cropHeight ) {
	const srcData = imageData.data;
	const srcWidth = imageData.width;
	const srcHeight = imageData.height;

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

	// Create destination buffer:
	const dstData = new Uint8ClampedArray( actualWidth * actualHeight * 4 );
	const srcRowBytes = srcWidth * 4;
	const dstRowBytes = actualWidth * 4;

	for ( let row = 0; row < actualHeight; row++ ) {
		const srcRowOffset = ( ( startRow + row ) * srcRowBytes ) + ( startCol * 4 );
		const dstRowOffset = row * dstRowBytes;
		for ( let i = 0; i < dstRowBytes; i++ ) {
			dstData[ dstRowOffset + i ] = srcData[ srcRowOffset + i ];
		}
	}
	return new ImageData( dstData, actualWidth, actualHeight );
}


// EXPORTS //

export { crop };
