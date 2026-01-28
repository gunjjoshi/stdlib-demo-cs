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


// MAIN //

/**
* Applies threshold to create binary image.
*
* @param {ImageData} imageData - canvas image data
* @param {number} thresholdValue - threshold value (0-255)
* @returns {ImageData} modified image data
*/
function threshold( imageData, thresholdValue = 128 ) {
	const data = imageData.data;
	const len = data.length;

	// Compute grayscale, then threshold:
	for ( let i = 0; i < len; i += 4 ) {
		const r = data[ i ];
		const g = data[ i + 1 ];
		const b = data[ i + 2 ];
		const gray = round( ( 0.299 * r ) + ( 0.587 * g ) + ( 0.114 * b ) );
		const value = ( gray >= thresholdValue ) ? 255 : 0;
		data[ i ] = value;
		data[ i + 1 ] = value;
		data[ i + 2 ] = value;
	}
	return imageData;
}


// EXPORTS //

export { threshold };
