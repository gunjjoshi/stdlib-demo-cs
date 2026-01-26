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


// MAIN //

/**
* Inverts image colors (negative).
*
* @param {ImageData} imageData - canvas image data
* @returns {ImageData} modified image data
*/
function invert( imageData ) {
	const arr = createNdarray( imageData );
	const height = arr.shape[ 0 ];
	const width = arr.shape[ 1 ];

	console.log('Inverting')

	for ( let row = 0; row < height; row++ ) {
		for ( let col = 0; col < width; col++ ) {
			arr.set( row, col, 0, 255 - arr.get( row, col, 0 ) );
			arr.set( row, col, 1, 255 - arr.get( row, col, 1 ) );
			arr.set( row, col, 2, 255 - arr.get( row, col, 2 ) );
		}
	}
	return imageData;
}


// EXPORTS //

export { invert };
