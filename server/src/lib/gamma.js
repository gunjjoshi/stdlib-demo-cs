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
import pow from '@stdlib/math-base-special-pow';


// MAIN //

/**
* Applies gamma correction to image.
*
* @param {ImageData} imageData - canvas image data
* @param {number} gammaValue - gamma value (0.1-5.0)
* @returns {ImageData} modified image data
*/
function gamma( imageData, gammaValue = 1.0 ) {
	const arr = createNdarray( imageData );
	const height = arr.shape[ 0 ];
	const width = arr.shape[ 1 ];
	const gammaCorrection = 1.0 / gammaValue;

	for ( let row = 0; row < height; row++ ) {
		for ( let col = 0; col < width; col++ ) {
			const r = 255 * pow( arr.get( row, col, 0 ) / 255, gammaCorrection );
			const g = 255 * pow( arr.get( row, col, 1 ) / 255, gammaCorrection );
			const b = 255 * pow( arr.get( row, col, 2 ) / 255, gammaCorrection );
			arr.set( row, col, 0, r );
			arr.set( row, col, 1, g );
			arr.set( row, col, 2, b );
		}
	}
	return imageData;
}


// EXPORTS //

export { gamma };
