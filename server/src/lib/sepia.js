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

import min from '@stdlib/math-base-special-min';
import round from '@stdlib/math-base-special-round';


// MAIN //

/**
* Applies sepia tone effect to image.
*
* @param {ImageData} imageData - canvas image data
* @returns {ImageData} modified image data
*/
function sepia( imageData ) {
	const data = imageData.data;
	const len = data.length;

	// Apply sepia matrix transformation:
	for ( let i = 0; i < len; i += 4 ) {
		const r = data[ i ];
		const g = data[ i + 1 ];
		const b = data[ i + 2 ];
		const newR = min( 255, round( ( r * 0.393 ) + ( g * 0.769 ) + ( b * 0.189 ) ) );
		const newG = min( 255, round( ( r * 0.349 ) + ( g * 0.686 ) + ( b * 0.168 ) ) );
		const newB = min( 255, round( ( r * 0.272 ) + ( g * 0.534 ) + ( b * 0.131 ) ) );
		data[ i ] = newR;
		data[ i + 1 ] = newG;
		data[ i + 2 ] = newB;
	}
	return imageData;
}


// EXPORTS //

export { sepia };
