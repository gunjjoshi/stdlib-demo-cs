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

import clamp from '@stdlib/math-base-special-clamp';
import round from '@stdlib/math-base-special-round';


// MAIN //

/**
* Adjusts image saturation.
*
* @param {ImageData} imageData - canvas image data
* @param {number} amount - saturation adjustment (-100 to 100)
* @returns {ImageData} modified image data
*/
function saturation( imageData, amount ) {
	const data = imageData.data;
	const len = data.length;
	const factor = 1 + ( amount / 100 );

	// Compute grayscale, then interpolate between gray and original color:
	for ( let i = 0; i < len; i += 4 ) {
		const r = data[ i ];
		const g = data[ i + 1 ];
		const b = data[ i + 2 ];
		const gray = ( 0.299 * r ) + ( 0.587 * g ) + ( 0.114 * b );
		data[ i ] = clamp( round( gray + ( ( r - gray ) * factor ) ), 0, 255 );
		data[ i + 1 ] = clamp( round( gray + ( ( g - gray ) * factor ) ), 0, 255 );
		data[ i + 2 ] = clamp( round( gray + ( ( b - gray ) * factor ) ), 0, 255 );
	}
	return imageData;
}


// EXPORTS //

export { saturation };
