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

import { createNdarray } from './ndarray.js';
import floor from '@stdlib/math-base-special-floor';


// MAIN //

/**
* Flips image vertically.
*
* @param {ImageData} imageData - canvas image data
* @returns {ImageData} modified image data
*/
function flipVertical( imageData ) {
	const arr = createNdarray( imageData );
	const height = arr.shape[ 0 ];
	const width = arr.shape[ 1 ];

	for ( let row = 0; row < floor( height / 2 ); row++ ) {
		const bottomRow = height - 1 - row;
		for ( let col = 0; col < width; col++ ) {
			for ( let c = 0; c < 4; c++ ) {
				const temp = arr.get( row, col, c );
				arr.set( row, col, c, arr.get( bottomRow, col, c ) );
				arr.set( bottomRow, col, c, temp );
			}
		}
	}
	return imageData;
}


// EXPORTS //

export { flipVertical };
