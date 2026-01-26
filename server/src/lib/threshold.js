/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
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

import { createNdarray } from './ndarray.js';
import round from '@stdlib/math-base-special-round';


// MAIN //

/**
* Applies threshold to create binary image.
*
* @param {ImageData} imageData - canvas image data
* @param {number} thresholdValue - threshold value (0-255)
* @returns {ImageData} modified image data
*/
function threshold( imageData, thresholdValue = 128 ) {
	const arr = createNdarray( imageData );
	const height = arr.shape[ 0 ];
	const width = arr.shape[ 1 ];

	for ( let row = 0; row < height; row++ ) {
		for ( let col = 0; col < width; col++ ) {
			const r = arr.get( row, col, 0 );
			const g = arr.get( row, col, 1 );
			const b = arr.get( row, col, 2 );
			const gray = round( ( 0.299 * r ) + ( 0.587 * g ) + ( 0.114 * b ) );
			const value = ( gray >= thresholdValue ) ? 255 : 0;
			arr.set( row, col, 0, value );
			arr.set( row, col, 1, value );
			arr.set( row, col, 2, value );
		}
	}
	return imageData;
}


// EXPORTS //

export { threshold };
