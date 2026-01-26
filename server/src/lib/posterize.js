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
import floor from '@stdlib/math-base-special-floor';


// MAIN //

/**
* Reduces color depth (posterize effect).
*
* @param {ImageData} imageData - canvas image data
* @param {number} levels - number of color levels (2-256)
* @returns {ImageData} modified image data
*/
function posterize( imageData, levels = 4 ) {
	const arr = createNdarray( imageData );
	const height = arr.shape[ 0 ];
	const width = arr.shape[ 1 ];
	const step = 255 / ( levels - 1 );

	for ( let row = 0; row < height; row++ ) {
		for ( let col = 0; col < width; col++ ) {
			const r = floor( arr.get( row, col, 0 ) / step ) * step;
			const g = floor( arr.get( row, col, 1 ) / step ) * step;
			const b = floor( arr.get( row, col, 2 ) / step ) * step;
			arr.set( row, col, 0, r );
			arr.set( row, col, 1, g );
			arr.set( row, col, 2, b );
		}
	}
	return imageData;
}


// EXPORTS //

export { posterize };
