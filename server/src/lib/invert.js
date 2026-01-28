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

import unary from '@stdlib/ndarray-base-unary';


// FUNCTIONS //

/**
* Inverts a single color value.
*
* @private
* @param {number} x - input value (0-255)
* @returns {number} inverted value (255 - x)
*/
function invertValue( x ) {
	return 255 - x;
}


// MAIN //

/**
* Inverts image colors (negative).
*
* @param {ImageData} imageData - canvas image data
* @returns {ImageData} modified image data
*/
function invert( imageData ) {
	const data = imageData.data;
	const numPixels = imageData.width * imageData.height;

	/*
	* Create ndarray-like objects for each RGB channel.
	*
	* Each channel is accessed with stride 4 (skipping RGBA to next RGBA).
	* The offset determines which channel: 0=R, 1=G, 2=B.
	*/
	const rChannel = {
		'dtype': 'uint8c',
		'data': data,
		'shape': [ numPixels ],
		'strides': [ 4 ],
		'offset': 0,
		'order': 'row-major'
	};
	const gChannel = {
		'dtype': 'uint8c',
		'data': data,
		'shape': [ numPixels ],
		'strides': [ 4 ],
		'offset': 1,
		'order': 'row-major'
	};
	const bChannel = {
		'dtype': 'uint8c',
		'data': data,
		'shape': [ numPixels ],
		'strides': [ 4 ],
		'offset': 2,
		'order': 'row-major'
	};

	unary( [ rChannel, rChannel ], invertValue );
	unary( [ gChannel, gChannel ], invertValue );
	unary( [ bChannel, bChannel ], invertValue );

	return imageData;
}


// EXPORTS //

export { invert };
