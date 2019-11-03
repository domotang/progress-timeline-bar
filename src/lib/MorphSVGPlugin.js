/*!
 * VERSION: 0.9.2
 * DATE: 2019-08-13
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
 * MorphSVGPlugin is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit http://greensock.com/club/ to sign up or get more details.
 * This work is subject to the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
/* eslint-disable */

import { _gsScope } from "gsap/TweenLite.js";

	var _PI = Math.PI,
		_DEG2RAD = _PI / 180,
		_svgPathExp = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
		_numbersExp = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
		_selectorExp = /(^[#\.][a-z]|[a-y][a-z])/i,
		_commands = /[achlmqstvz]/ig,
		_scientific = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/ig,
		_atan2 = Math.atan2,
		_cos = Math.cos,
		_sin = Math.sin,
		_sqrt = Math.sqrt,
		_2PI = _PI * 2,
		_angleMin = _PI * 0.3,
		_angleMax = _PI * 0.7,
		_bigNum = 1e20,
		_lastLinkedAnchor,
		TweenLite = _gsScope._gsDefine.globals.TweenLite,

		_log = function(message) {
			if (_gsScope.console) {
				console.log(message);
			}
		},

		// translates SVG arc data into an array of cubic beziers
		_arcToBeziers = function(lastX, lastY, rx, ry, angle, largeArcFlag, sweepFlag, x, y) {
			if (lastX === x && lastY === y) {
				return;
			}
			rx = Math.abs(rx);
			ry = Math.abs(ry);
			var angleRad = (angle % 360) * _DEG2RAD,
				cosAngle = _cos(angleRad),
				sinAngle = _sin(angleRad),
				dx2 = (lastX - x) / 2,
				dy2 = (lastY - y) / 2,
				x1 = (cosAngle * dx2 + sinAngle * dy2),
				y1 = (-sinAngle * dx2 + cosAngle * dy2),
				x1_sq = x1 * x1,
				y1_sq = y1 * y1,
				radiiCheck = x1_sq / (rx * rx) + y1_sq / (ry * ry);
			if (radiiCheck > 1) {
				rx = _sqrt(radiiCheck) * rx;
				ry = _sqrt(radiiCheck) * ry;
			}
			var rx_sq = rx * rx,
				ry_sq = ry * ry,
				sq = ((rx_sq * ry_sq) - (rx_sq * y1_sq) - (ry_sq * x1_sq)) / ((rx_sq * y1_sq) + (ry_sq * x1_sq));
			if (sq < 0) {
				sq = 0;
			}
			var coef = ((largeArcFlag === sweepFlag) ? -1 : 1) * _sqrt(sq),
				cx1 = coef * ((rx * y1) / ry),
				cy1 = coef * -((ry * x1) / rx),
				sx2 = (lastX + x) / 2,
				sy2 = (lastY + y) / 2,
				cx = sx2 + (cosAngle * cx1 - sinAngle * cy1),
				cy = sy2 + (sinAngle * cx1 + cosAngle * cy1),
				ux = (x1 - cx1) / rx,
				uy = (y1 - cy1) / ry,
				vx = (-x1 - cx1) / rx,
				vy = (-y1 - cy1) / ry,
				temp = ux * ux + uy * uy,
				angleStart = ((uy < 0) ? -1 : 1) * Math.acos(ux / _sqrt(temp)),
				angleExtent = ((ux * vy - uy * vx < 0) ? -1 : 1) * Math.acos((ux * vx + uy * vy) / _sqrt(temp * (vx * vx + vy * vy)));
			if (isNaN(angleExtent)) { //rare edge case. Math.cos(-1) is NaN.
				angleExtent = _PI;
			}
			if (!sweepFlag && angleExtent > 0) {
				angleExtent -= _2PI;
			} else if (sweepFlag && angleExtent < 0) {
				angleExtent += _2PI;
			}
			angleStart %= _2PI;
			angleExtent %= _2PI;
			var segments = Math.ceil(Math.abs(angleExtent) / (_2PI / 4)),
				rawPath = [],
				angleIncrement = angleExtent / segments,
				controlLength = 4 / 3 * _sin(angleIncrement / 2) / (1 + _cos(angleIncrement / 2)),
				ma = cosAngle * rx,
				mb = sinAngle * rx,
				mc = sinAngle * -ry,
				md = cosAngle * ry,
				i;
			for (i = 0; i < segments; i++) {
				angle = angleStart + i * angleIncrement;
				x1 = _cos(angle);
				y1 = _sin(angle);
				ux = _cos(angle += angleIncrement);
				uy = _sin(angle);
				rawPath.push(x1 - controlLength * y1, y1 + controlLength * x1, ux + controlLength * uy, uy - controlLength * ux, ux, uy);
			}
			//now transform according to the actual size of the ellipse/arc (the beziers were noramlized, between 0 and 1 on a circle).
			for (i = 0; i < rawPath.length; i+=2) {
				x1 = rawPath[i];
				y1 = rawPath[i+1];
				rawPath[i] = x1 * ma + y1 * mc + cx;
				rawPath[i+1] = x1 * mb + y1 * md + cy;
			}
			rawPath[i-2] = x; //always set the end to exactly where it's supposed to be
			rawPath[i-1] = y;
			return rawPath;
		},

		//Spits back an array of cubic Bezier segments that use absolute coordinates. Each segment starts with a "moveTo" command (x coordinate, then y) and then 2 control points (x, y, x, y), then anchor. The goal is to minimize memory and maximize speed.
		_stringToRawPath = function(d) {
			var a = (d + "").replace(_scientific, function(m) { var n = +m; return (n < 0.0001 && n > -0.0001) ? 0 : n; }).match(_svgPathExp) || [], //some authoring programs spit out very small numbers in scientific notation like "1e-5", so make sure we round that down to 0 first.
				path = [],
				relativeX = 0,
				relativeY = 0,
				twoThirds = 2 / 3,
				elements = a.length,
				points = 0,
				errorMessage = "ERROR: malformed path: " + d,
				line = function(sx, sy, ex, ey) {
					difX = (ex - sx) / 3;
					difY = (ey - sy) / 3;
					segment.push(sx + difX, sy + difY, ex - difX, ey - difY, ex, ey);
				},
				i, j, x, y, command, isRelative, segment, startX, startY, difX, difY, beziers, prevCommand;
			if (!d || !isNaN(a[0]) || isNaN(a[1])) {
				_log(errorMessage);
				return path;
			}
			for (i = 0; i < elements; i++) {
				prevCommand = command;
				if (isNaN(a[i])) {
					command = a[i].toUpperCase();
					isRelative = (command !== a[i]); //lower case means relative
				} else { //commands like "C" can be strung together without any new command characters between.
					i--;
				}
				x = +a[i + 1];
				y = +a[i + 2];
				if (isRelative) {
					x += relativeX;
					y += relativeY;
				}
				if (!i) {
					startX = x;
					startY = y;
				}

				// "M" (move)
				if (command === "M") {
					if (segment) {
						if (segment.length < 8) { //if the path data was funky and just had a M with no actual drawing anywhere, skip it.
							path.length -= 1;
						} else {
							points += segment.length;
						}
					}
					relativeX = startX = x;
					relativeY = startY = y;
					segment = [x, y];
					path.push(segment);
					i += 2;
					command = "L"; //an "M" with more than 2 values gets interpreted as "lineTo" commands ("L").

				// "C" (cubic bezier)
				} else if (command === "C") {
					if (!segment) {
						segment = [0, 0];
					}
					if (!isRelative) {
						relativeX = relativeY = 0;
					}
					//note: "*1" is just a fast/short way to cast the value as a Number. WAAAY faster in Chrome, slightly slower in Firefox.
					segment.push(x,	y, relativeX + a[i + 3] * 1, relativeY + a[i + 4] * 1, (relativeX += a[i + 5] * 1),	(relativeY += a[i + 6] * 1));
					i += 6;

				// "S" (continuation of cubic bezier)
				} else if (command === "S") {
					difX = relativeX;
					difY = relativeY;
					if (prevCommand === "C" || prevCommand === "S") {
						difX += relativeX - segment[segment.length - 4];
						difY += relativeY - segment[segment.length - 3];
					}
					if (!isRelative) {
						relativeX = relativeY = 0;
					}
					segment.push(difX, difY, x,	y, (relativeX += a[i + 3] * 1), (relativeY += a[i + 4] * 1));
					i += 4;

				// "Q" (quadratic bezier)
				} else if (command === "Q") {
					difX = relativeX + (x - relativeX) * twoThirds;
					difY = relativeY + (y - relativeY) * twoThirds;
					if (!isRelative) {
						relativeX = relativeY = 0;
					}
					relativeX += a[i + 3] * 1;
					relativeY += a[i + 4] * 1;
					segment.push(difX, difY, relativeX + (x - relativeX) * twoThirds, relativeY + (y - relativeY) * twoThirds, relativeX, relativeY);
					i += 4;

				// "T" (continuation of quadratic bezier)
				} else if (command === "T") {
					difX = relativeX - segment[segment.length - 4];
					difY = relativeY - segment[segment.length - 3];
					segment.push(relativeX + difX, relativeY + difY, x + ((relativeX + difX * 1.5) - x) * twoThirds, y + ((relativeY + difY * 1.5) - y) * twoThirds, (relativeX = x), (relativeY = y));
					i += 2;

				// "H" (horizontal line)
				} else if (command === "H") {
					line(relativeX, relativeY, (relativeX = x), relativeY);
					i += 1;

				// "V" (vertical line)
				} else if (command === "V") {
					//adjust values because the first (and only one) isn't x in this case, it's y.
					line(relativeX, relativeY, relativeX, (relativeY = x + (isRelative ? relativeY - relativeX : 0)));
					i += 1;

				// "L" (line) or "Z" (close)
				} else if (command === "L" || command === "Z") {
					if (command === "Z") {
						x = startX;
						y = startY;
						segment.closed = true;
					}
					if (command === "L" || Math.abs(relativeX - x) > 0.5 || Math.abs(relativeY - y) > 0.5) {
						line(relativeX, relativeY, x, y);
						if (command === "L") {
							i += 2;
						}
					}
					relativeX = x;
					relativeY = y;

				// "A" (arc)
				} else if (command === "A") {
					beziers = _arcToBeziers(relativeX, relativeY, +a[i+1], +a[i+2], +a[i+3], +a[i+4], +a[i+5], (isRelative ? relativeX : 0) + a[i+6]*1, (isRelative ? relativeY : 0) + a[i+7]*1);
					if (beziers) {
						for (j = 0; j < beziers.length; j++) {
							segment.push(beziers[j]);
						}
					}
					relativeX = segment[segment.length-2];
					relativeY = segment[segment.length-1];
					i += 7;

				} else {
					_log(errorMessage);
				}
			}
			i = segment.length;
			if (i < 6) { //in case there's odd SVG like a M0,0 command at the very end.
				path.pop();
				i = 0;
			} else if (segment[0] === segment[i-2] && segment[1] === segment[i-1]) {
				segment.closed = true;
			}
			path.totalPoints = points + i;
			return path;
		},

		//adds a certain number of Beziers while maintaining the path shape (so that the start/end values can have a matching quantity of points to animate). Only pass in ONE segment of the Bezier at a time. Format: [xAnchor, yAnchor, xControlPoint1, yControlPoint1, xControlPoint2, yControlPoint2, xAnchor, yAnchor, xControlPoint1, etc...]
		_subdivideSegment = function(segment, quantity) {
			var tally = 0,
				max = 0.999999,
				l = segment.length,
				newPointsPerSegment = quantity / ((l - 2) / 6),
				ax, ay, cp1x, cp1y, cp2x, cp2y, bx, by,
				x1, y1, x2, y2, i, t;
			for (i = 2; i < l; i += 6) {
				tally += newPointsPerSegment;
				while (tally > max) { //compare with 0.99999 instead of 1 in order to prevent rounding errors
					ax = segment[i-2];
					ay = segment[i-1];
					cp1x = segment[i];
					cp1y = segment[i+1];
					cp2x = segment[i+2];
					cp2y = segment[i+3];
					bx = segment[i+4];
					by = segment[i+5];
					t = 1 / ((Math.floor(tally) || 1) + 1); //progress along the bezier (value between 0 and 1)
					x1 = ax + (cp1x - ax) * t;
					x2 = cp1x + (cp2x - cp1x) * t;
					x1 += (x2 - x1) * t;
					x2 += ((cp2x + (bx - cp2x) * t) - x2) * t;

					y1 = ay + (cp1y - ay) * t;
					y2 = cp1y + (cp2y - cp1y) * t;
					y1 += (y2 - y1) * t;
					y2 += ((cp2y + (by - cp2y) * t) - y2) * t;

					segment.splice(i, 4,
						ax + (cp1x - ax) * t,   //first control point
						ay + (cp1y - ay) * t,
						x1,                     //second control point
						y1,
						x1 + (x2 - x1) * t,     //new fabricated anchor on line
						y1 + (y2 - y1) * t,
						x2,                     //third control point
						y2,
						cp2x + (bx - cp2x) * t, //fourth control point
						cp2y + (by - cp2y) * t
					);
					i += 6;
					l += 6;
					tally--;
				}
			}
			return segment;
		},
		_rawPathToString = function(rawPath, precision) {
			var s = "",
				space = " ",
				l = rawPath.length,
				rnd = Math.pow(10, precision || 2),
				i, j, segment;
			for (j = 0; j < rawPath.length; j++) {
				segment = rawPath[j];
				l = segment.length;
				s += "M" + (((segment[0] * rnd) | 0) / rnd) + space + (((segment[1] * rnd) | 0) / rnd) + " C";
				for (i = 2; i < l; i++) { //this is actually faster than just doing a join() on the array, possibly because the numbers have so many decimal places
					s += (((segment[i] * rnd) | 0) / rnd) + space;
				}
				if (segment.closed) {
					s += "z";
				}
			}
			return s;
		},
		_reverseBezier = function(segment) {
			var a = [],
				i = segment.length - 1,
				l = 0;
			while (--i > -1) {
				a[l++] = segment[i];
				a[l++] = segment[i+1];
				i--;
			}
			for (i = 0; i < l; i++) {
				segment[i] = a[i];
			}
			segment.reversed = !segment.reversed;
		},
		_getAverageXY = function(segment) {
			var l = segment.length,
				x = 0,
				y = 0,
				i;
			for (i = 0; i < l; i++) {
				x += segment[i++];
				y += segment[i];
			}
			return [x / (l / 2), y / (l / 2)];
		},
		_getSize = function(segment) { //rough estimate of the bounding box (based solely on the anchors) of a single segment. sets "size", "centerX", and "centerY" properties on the bezier array itself, and returns the size (width * height)
			var l = segment.length,
				xMax = segment[0],
				xMin = xMax,
				yMax = segment[1],
				yMin = yMax,
				x, y, i;
			for (i = 6; i < l; i+=6) {
				x = segment[i];
				y = segment[i+1];
				if (x > xMax) {
					xMax = x;
				} else if (x < xMin) {
					xMin = x;
				}
				if (y > yMax) {
					yMax = y;
				} else if (y < yMin) {
					yMin = y;
				}
			}
			segment.centerX = (xMax + xMin) / 2;
			segment.centerY = (yMax + yMin) / 2;
			return (segment.size = (xMax - xMin) * (yMax - yMin));
		},
		_getTotalSize = function(rawPath, samplesPerBezier) { //rough estimate of the bounding box of the entire list of Bezier segments (based solely on the anchors). sets "size", "centerX", and "centerY" properties on the bezier array itself, and returns the size (width * height)
			samplesPerBezier = samplesPerBezier || 3;
			var j = rawPath.length,
				xMax = rawPath[0][0],
				xMin = xMax,
				yMax = rawPath[0][1],
				yMin = yMax,
				inc = 1 / samplesPerBezier,
				l, x, y, i, segment, k, t, inv, x1, y1, x2, x3, x4, y2, y3, y4;
			while (--j > -1) {
				segment = rawPath[j];
				l = segment.length;
				for (i = 6; i < l; i+=6) {
					x1 = segment[i];
					y1 = segment[i+1];
					x2 = segment[i+2] - x1;
					y2 = segment[i+3] - y1;
					x3 = segment[i+4] - x1;
					y3 = segment[i+5] - y1;
					x4 = segment[i+6] - x1;
					y4 = segment[i+7] - y1;
					k = samplesPerBezier;
					while (--k > -1) {
						t = inc * k;
						inv = 1 - t;
						x = (t * t * x4 + 3 * inv * (t * x3 + inv * x2)) * t + x1;
						y = (t * t * y4 + 3 * inv * (t * y3 + inv * y2)) * t + y1;
						if (x > xMax) {
							xMax = x;
						} else if (x < xMin) {
							xMin = x;
						}
						if (y > yMax) {
							yMax = y;
						} else if (y < yMin) {
							yMin = y;
						}
					}
				}
			}
			rawPath.centerX = (xMax + xMin) / 2;
			rawPath.centerY = (yMax + yMin) / 2;
			rawPath.left = xMin;
			rawPath.width = (xMax - xMin);
			rawPath.top = yMin;
			rawPath.height = (yMax - yMin);
			return (rawPath.size = (xMax - xMin) * (yMax - yMin));
		},
		_sortByComplexity = function(a, b) {
			return b.length - a.length;
		},
		_sortBySize = function(a, b) {
			var sizeA = a.size || _getSize(a),
				sizeB = b.size || _getSize(b);
			return (Math.abs(sizeB - sizeA) < (sizeA + sizeB) / 20) ? (b.centerX - a.centerX) || (b.centerY - a.centerY) : sizeB - sizeA; //if the size is within 10% of each other, prioritize position from left to right, then top to bottom.
		},
		_offsetSegment = function(segment, shapeIndex) {
			var a = segment.slice(0),
				l = segment.length,
				wrap = l - 2,
				i, index;
			shapeIndex = shapeIndex | 0;
			for (i = 0; i < l; i++) {
				index = (i + shapeIndex) % wrap;
				segment[i++] = a[index];
				segment[i] = a[index+1];
			}
		},
		_getTotalMovement = function(sb, eb, shapeIndex, offsetX, offsetY) {
			var l = sb.length,
				d = 0,
				wrap = l - 2,
				index, i, x, y;
			shapeIndex *= 6;
			for (i = 0; i < l; i += 6) {
				index = (i + shapeIndex) % wrap;
				y = sb[index] - (eb[i] - offsetX);
				x = sb[index+1] - (eb[i+1] - offsetY);
				d += _sqrt(x * x + y * y);
			}
			return d;
		},
		_getClosestShapeIndex = function(sb, eb, checkReverse) { //finds the index in a closed cubic bezier array that's closest to the angle provided (angle measured from the center or average x/y).
			var l = sb.length,
				sCenter = _getAverageXY(sb), //when comparing distances, adjust the coordinates as if the shapes are centered with each other.
				eCenter = _getAverageXY(eb),
				offsetX = eCenter[0] - sCenter[0],
				offsetY = eCenter[1] - sCenter[1],
				min = _getTotalMovement(sb, eb, 0, offsetX, offsetY),
				minIndex = 0,
				copy, d, i;
			for (i = 6; i < l; i += 6) {
				d = _getTotalMovement(sb, eb, i / 6, offsetX, offsetY);
				if (d < min) {
					min = d;
					minIndex = i;
				}
			}
			if (checkReverse) {
				copy = sb.slice(0);
				_reverseBezier(copy);
				for (i = 6; i < l; i += 6) {
					d = _getTotalMovement(copy, eb, i / 6, offsetX, offsetY);
					if (d < min) {
						min = d;
						minIndex = -i;
					}
				}
			}
			return minIndex / 6;
		},
		_getClosestAnchor = function(rawPath, x, y) { //finds the x/y of the anchor that's closest to the provided x/y coordinate (returns an array, like [x, y]). The bezier should be the top-level type that contains an array for each segment.
			var j = rawPath.length,
				closestDistance = _bigNum,
				closestX = 0,
				closestY = 0,
				segment, dx, dy, d, i, l;
			while (--j > -1) {
				segment = rawPath[j];
				l = segment.length;
				for (i = 0; i < l; i += 6) {
					dx = segment[i] - x;
					dy = segment[i+1] - y;
					d = _sqrt(dx * dx + dy * dy);
					if (d < closestDistance) {
						closestDistance = d;
						closestX = segment[i];
						closestY = segment[i+1];
					}
				}
			}
			return [closestX, closestY];
		},
		_getClosestSegment = function(bezier, pool, startIndex, sortRatio, offsetX, offsetY) { //matches the bezier to the closest one in a pool (array) of beziers, assuming they are in order of size and we shouldn't drop more than 20% of the size, otherwise prioritizing location (total distance to the center). Extracts the segment out of the pool array and returns it.
			var l = pool.length,
				index = 0,
				minSize = Math.min(bezier.size || _getSize(bezier), pool[startIndex].size || _getSize(pool[startIndex])) * sortRatio, //limit things based on a percentage of the size of either the bezier or the next element in the array, whichever is smaller.
				min = _bigNum,
				cx = bezier.centerX + offsetX,
				cy = bezier.centerY + offsetY,
				size, i, dx, dy, d;
			for (i = startIndex; i < l; i++) {
				size = pool[i].size || _getSize(pool[i]);
				if (size < minSize) {
					break;
				}
				dx = pool[i].centerX - cx;
				dy = pool[i].centerY - cy;
				d = _sqrt(dx * dx + dy * dy);
				if (d < min) {
					index = i;
					min = d;
				}
			}
			d = pool[index];
			pool.splice(index, 1);
			return d;
		},
		_equalizeSegmentQuantity = function(start, end, shapeIndex, map, fillSafe) { //returns an array of shape indexes, 1 for each segment.
			var dif = end.length - start.length,
				longer = dif > 0 ? end : start,
				shorter = dif > 0 ? start : end,
				added = 0,
				sortMethod = (map === "complexity") ? _sortByComplexity : _sortBySize,
				sortRatio = (map === "position") ? 0 : (typeof(map) === "number") ? map : 0.8,
				i = shorter.length,
				shapeIndices = (typeof(shapeIndex) === "object" && shapeIndex.push) ? shapeIndex.slice(0) : [shapeIndex],
				reverse = (shapeIndices[0] === "reverse" || shapeIndices[0] < 0),
				log = (shapeIndex === "log"),
				eb, sb, b, x, y, offsetX, offsetY;
			if (!shorter[0]) {
				return;
			}
			if (longer.length > 1) {
				start.sort(sortMethod);
				end.sort(sortMethod);
				offsetX = longer.size || _getTotalSize(longer); //ensures centerX and centerY are defined (used below).
				offsetX = shorter.size || _getTotalSize(shorter);
				offsetX = longer.centerX - shorter.centerX;
				offsetY = longer.centerY - shorter.centerY;
				if (sortMethod === _sortBySize) {
					for (i = 0; i < shorter.length; i++) {
						longer.splice(i, 0, _getClosestSegment(shorter[i], longer, i, sortRatio, offsetX, offsetY));
					}
				}
			}
			if (dif) {
				if (dif < 0) {
					dif = -dif;
				}
				if (longer[0].length > shorter[0].length) { //since we use shorter[0] as the one to map the origination point of any brand new fabricated segments, do any subdividing first so that there are more points to choose from (if necessary)
					_subdivideSegment(shorter[0], ((longer[0].length - shorter[0].length)/6) | 0);
				}
				i = shorter.length;
				while (added < dif) {
					x = longer[i].size || _getSize(longer[i]); //just to ensure centerX and centerY are calculated which we use on the next line.
					b = _getClosestAnchor(shorter, longer[i].centerX, longer[i].centerY);
					x = b[0];
					y = b[1];
					shorter[i++] = [x, y, x, y, x, y, x, y];
					shorter.totalPoints += 8;
					added++;
				}
			}
			for (i = 0; i < start.length; i++) {
				eb = end[i];
				sb = start[i];
				dif = eb.length - sb.length;
				if (dif < 0) {
					_subdivideSegment(eb, (-dif/6) | 0);
				} else if (dif > 0) {
					_subdivideSegment(sb, (dif/6) | 0);
				}
				if (reverse && fillSafe !== false && !sb.reversed) {
					_reverseBezier(sb);
				}
				shapeIndex = (shapeIndices[i] || shapeIndices[i] === 0) ? shapeIndices[i] : "auto";
				if (shapeIndex) {
					//if start shape is closed, find the closest point to the start/end, and re-organize the bezier points accordingly so that the shape morphs in a more intuitive way.
					if (sb.closed || (Math.abs(sb[0] - sb[sb.length - 2]) < 0.5 && Math.abs(sb[1] - sb[sb.length - 1]) < 0.5)) {
						if (shapeIndex === "auto" || shapeIndex === "log") {
							shapeIndices[i] = shapeIndex = _getClosestShapeIndex(sb, eb, (!i || fillSafe === false));
							if (shapeIndex < 0) {
								reverse = true;
								_reverseBezier(sb);
								shapeIndex = -shapeIndex;
							}
							_offsetSegment(sb, shapeIndex * 6);

						} else if (shapeIndex !== "reverse") {
							if (i && shapeIndex < 0) { //only happens if an array is passed as shapeIndex and a negative value is defined for an index beyond 0. Very rare, but helpful sometimes.
								_reverseBezier(sb);
							}
							_offsetSegment(sb, (shapeIndex < 0 ? -shapeIndex : shapeIndex) * 6);
						}
					//otherwise, if it's not a closed shape, consider reversing it if that would make the overall travel less
					} else if (!reverse && (shapeIndex === "auto" && (Math.abs(eb[0] - sb[0]) + Math.abs(eb[1] - sb[1]) + Math.abs(eb[eb.length - 2] - sb[sb.length - 2]) + Math.abs(eb[eb.length - 1] - sb[sb.length - 1]) > Math.abs(eb[0] - sb[sb.length - 2]) + Math.abs(eb[1] - sb[sb.length - 1]) + Math.abs(eb[eb.length - 2] - sb[0]) + Math.abs(eb[eb.length - 1] - sb[1])) || (shapeIndex % 2))) {
						_reverseBezier(sb);
						shapeIndices[i] = -1;
						reverse = true;
					} else if (shapeIndex === "auto") {
						shapeIndices[i] = 0;
					} else if (shapeIndex === "reverse") {
						shapeIndices[i] = -1;
					}
					if (sb.closed !== eb.closed) { //if one is closed and one isn't, don't close either one otherwise the tweening will look weird (but remember, the beginning and final states will honor the actual values, so this only affects the inbetween state)
						sb.closed = eb.closed = false;
					}
				}
			}
			if (log) {
				_log("shapeIndex:[" + shapeIndices.join(",") + "]");
			}
			start.shapeIndex = shapeIndices;
			return shapeIndices;
		},
		_pathFilter = function(a, shapeIndex, map, precompile, fillSafe) {
			var start = _stringToRawPath(a[0]),
				end = _stringToRawPath(a[1]);
			if (!_equalizeSegmentQuantity(start, end, (shapeIndex || shapeIndex === 0) ? shapeIndex : "auto", map, fillSafe)) {
				return; //malformed path data or null target
			}
			a[0] = _rawPathToString(start);
			a[1] = _rawPathToString(end);
			if (precompile === "log" || precompile === true) {
				_log('precompile:["' + a[0] + '","' + a[1] + '"]');
			}
		},
		/*
		_buildPathFilter = function(shapeIndex, map, precompile) {
			return (map || precompile || shapeIndex || shapeIndex === 0) ? function(a) {
				_pathFilter(a, shapeIndex, map, precompile);
			} : _pathFilter;
		},
		*/
		_offsetPoints = function(text, offset) {
			if (!offset) {
				return text;
			}
			var a = text.match(_numbersExp) || [],
				l = a.length,
				s = "",
				inc, i, j;
			if (offset === "reverse") {
				i = l-1;
				inc = -2;
			} else {
				i = (((parseInt(offset, 10) || 0) * 2 + 1) + l * 100) % l;
				inc = 2;
			}
			for (j = 0; j < l; j += 2) {
				s += a[i-1] + "," + a[i] + " ";
				i = (i + inc) % l;
			}
			return s;
		},
		//adds a certain number of points while maintaining the polygon/polyline shape (so that the start/end values can have a matching quantity of points to animate). Returns the revised string.
		_equalizePointQuantity = function(a, quantity) {
			var tally = 0,
				x = parseFloat(a[0]),
				y = parseFloat(a[1]),
				s = x + "," + y + " ",
				max = 0.999999,
				newPointsPerSegment, i, l, j, factor, nextX, nextY;
			l = a.length;
			newPointsPerSegment = quantity * 0.5 / (l * 0.5 - 1);
			for (i = 0; i < l-2; i += 2) {
				tally += newPointsPerSegment;
				nextX = parseFloat(a[i+2]);
				nextY = parseFloat(a[i+3]);
				if (tally > max) { //compare with 0.99999 instead of 1 in order to prevent rounding errors
					factor = 1 / (Math.floor(tally) + 1);
					j = 1;
					while (tally > max) {
						s += (x + (nextX - x) * factor * j).toFixed(2) + "," + (y + (nextY - y) * factor * j).toFixed(2) + " ";
						tally--;
						j++;
					}
				}
				s += nextX + "," + nextY + " ";
				x = nextX;
				y = nextY;
			}
			return s;
		},
		_pointsFilter = function(a) {
			var startNums = a[0].match(_numbersExp) || [],
				endNums = a[1].match(_numbersExp) || [],
				dif = endNums.length - startNums.length;
			if (dif > 0) {
				a[0] = _equalizePointQuantity(startNums, dif);
			} else {
				a[1] = _equalizePointQuantity(endNums, -dif);
			}
		},
		_buildPointsFilter = function(shapeIndex) {
			return !isNaN(shapeIndex) ? function(a) {
				_pointsFilter(a);
				a[1] = _offsetPoints(a[1], parseInt(shapeIndex, 10));
			} : _pointsFilter;
		},
		_createPath = function(e, ignore) {
			var path = _gsScope.document.createElementNS("http://www.w3.org/2000/svg", "path"),
				attr = Array.prototype.slice.call(e.attributes),
				i = attr.length,
				name;
			ignore = "," + ignore + ",";
			while (--i > -1) {
				name = attr[i].nodeName.toLowerCase(); //in Microsoft Edge, if you don't set the attribute with a lowercase name, it doesn't render correctly! Super weird.
				if (ignore.indexOf("," + name + ",") === -1) {
					path.setAttributeNS(null, name, attr[i].nodeValue);
				}
			}
			return path;
		},
		_typeAttrs = {
			rect:"rx,ry,x,y,width,height",
			circle:"r,cx,cy",
			ellipse:"rx,ry,cx,cy",
			line:"x1,x2,y1,y2"
		},
		_attrToObj = function(e, attrs) {
			var props = attrs ? attrs.split(",") : [],
				obj = {},
				i = props.length;
			while (--i > -1) {
				obj[props[i]] = +e.getAttribute(props[i]) || 0;
			}
			return obj;
		},
		_convertToPath = function(e, swap) {
			var type = e.tagName.toLowerCase(),
				circ = 0.552284749831,
				data, x, y, r, ry, path, rcirc, rycirc, points, w, h, x2, x3, x4, x5, x6, y2, y3, y4, y5, y6, attr;
			if (type === "path" || !e.getBBox) {
				return e;
			}
			path = _createPath(e, "x,y,width,height,cx,cy,rx,ry,r,x1,x2,y1,y2,points");
			attr = _attrToObj(e, _typeAttrs[type]);
			if (type === "rect") {
				r = attr.rx;
				ry = attr.ry;
				x = attr.x;
				y = attr.y;
				w = attr.width - r * 2;
				h = attr.height - ry * 2;
				if (r || ry) { //if there are rounded corners, render cubic beziers
					x2 = x + r * (1 - circ);
					x3 = x + r;
					x4 = x3 + w;
					x5 = x4 + r * circ;
					x6 = x4 + r;
					y2 = y + ry * (1 - circ);
					y3 = y + ry;
					y4 = y3 + h;
					y5 = y4 + ry * circ;
					y6 = y4 + ry;
					data = "M" + x6 + "," + y3 + " V" + y4 + " C" + [x6, y5, x5, y6, x4, y6, x4 - (x4 - x3) / 3, y6, x3 + (x4 - x3) / 3, y6, x3, y6, x2, y6, x, y5, x, y4, x, y4 - (y4 - y3) / 3, x, y3 + (y4 - y3) / 3, x, y3, x, y2, x2, y, x3, y, x3 + (x4 - x3) / 3, y, x4 - (x4 - x3) / 3, y, x4, y, x5, y, x6, y2, x6, y3].join(",") + "z";
				} else {
					data = "M" + (x + w) + "," + y + " v" + h + " h" + (-w) + " v" + (-h) + " h" + w + "z";
				}

			} else if (type === "circle" || type === "ellipse") {
				if (type === "circle") {
					r = ry = attr.r;
					rycirc = r * circ;
				} else {
					r = attr.rx;
					ry = attr.ry;
					rycirc = ry * circ;
				}
				x = attr.cx;
				y = attr.cy;
				rcirc = r * circ;
				data = "M" + (x+r) + "," + y + " C" + [x+r, y + rycirc, x + rcirc, y + ry, x, y + ry, x - rcirc, y + ry, x - r, y + rycirc, x - r, y, x - r, y - rycirc, x - rcirc, y - ry, x, y - ry, x + rcirc, y - ry, x + r, y - rycirc, x + r, y].join(",") + "z";
			} else if (type === "line") {
				data = "M" + attr.x1 + "," + attr.y1 + " L" + attr.x2 + "," + attr.y2; //previously, we just converted to "Mx,y Lx,y" but Safari has bugs that cause that not to render properly when using a stroke-dasharray that's not fully visible! Using a cubic bezier fixes that issue.
			} else if (type === "polyline" || type === "polygon") {
				points = (e.getAttribute("points") + "").match(_numbersExp) || [];
				x = points.shift();
				y = points.shift();
				data = "M" + x + "," + y + " L" + points.join(",");
				if (type === "polygon") {
					data += "," + x + "," + y + "z";
				}
			}
			path.setAttribute("d", _rawPathToString(path._gsRawPath = _stringToRawPath(data)));
			if (swap && e.parentNode) {
				e.parentNode.insertBefore(path, e);
				e.parentNode.removeChild(e);
			}

			return path;
		},
		_parseShape = function(shape, forcePath, target) {
			var isString = typeof(shape) === "string",
				e, type;
			if (!isString || _selectorExp.test(shape) || (shape.match(_numbersExp) || []).length < 3) {
				e = isString ? TweenLite.selector(shape) : (shape && shape[0]) ? shape : [shape]; //allow array-like objects like jQuery objects.
				if (e && e[0]) {
					e = e[0];
					type = (e.nodeName + "").toUpperCase();
					if (forcePath && type !== "PATH") { //if we were passed an element (or selector text for an element) that isn't a path, convert it.
						e = _convertToPath(e, false);
						type = "PATH";
					}
					shape = e.getAttribute(type === "PATH" ? "d" : "points") || "";
					if (e === target) { //if the shape matches the target element, the user wants to revert to the original which should have been stored in the data-original attribute
						shape = e.getAttributeNS(null, "data-original") || shape;
					}
				} else {
					_log("WARNING: invalid morph to: " + shape);
					shape = false;
				}
			}
			return shape;
		},
		//adds an "isSmooth" array to each segment and populates it with a boolean value indicating whether or not it's smooth (the control points have basically the same slope). For any smooth control points, it converts the coordinates into angle (x, in radians) and length (y) and puts them into the same index value in a smoothData array.
		_populateSmoothData = function(rawPath, tolerance) {
			var j = rawPath.length,
				limit = 0.2 * (tolerance || 1),
				smooth, segment, x, y, x2, y2, i, l, a, a2, isSmooth, smoothData;
			while (--j > -1) {
				segment = rawPath[j];
				isSmooth = segment.isSmooth = segment.isSmooth || [0, 0, 0, 0];
				smoothData = segment.smoothData = segment.smoothData || [0, 0, 0, 0];
				isSmooth.length = 4;
				l = segment.length - 2;
				for (i = 6; i < l; i += 6) {
					x = segment[i] - segment[i - 2];
					y = segment[i + 1] - segment[i - 1];
					x2 = segment[i + 2] - segment[i];
					y2 = segment[i + 3] - segment[i + 1];
					a = _atan2(y, x);
					a2 = _atan2(y2, x2);
					smooth = (Math.abs(a - a2) < limit);
					if (smooth) {
						smoothData[i - 2] = a;
						smoothData[i + 2] = a2;
						smoothData[i - 1] = _sqrt(x * x + y * y);
						smoothData[i + 3] = _sqrt(x2 * x2 + y2 * y2);
					}
					isSmooth.push(smooth, smooth, 0, 0, smooth, smooth);
				}
				//if the first and last points are identical, check to see if there's a smooth transition. We must handle this a bit differently due to their positions in the array.
				if (segment[l] === segment[0] && segment[l+1] === segment[1]) {
					x = segment[0] - segment[l-2];
					y = segment[1] - segment[l-1];
					x2 = segment[2] - segment[0];
					y2 = segment[3] - segment[1];
					a = _atan2(y, x);
					a2 = _atan2(y2, x2);
					if (Math.abs(a - a2) < limit) {
						smoothData[l-2] = a;
						smoothData[2] = a2;
						smoothData[l-1] = _sqrt(x * x + y * y);
						smoothData[3] = _sqrt(x2 * x2 + y2 * y2);
						isSmooth[l-2] = isSmooth[l-1] = true; //don't change indexes 2 and 3 because we'll trigger everything from the END, and this will optimize file size a bit.
					}
				}
			}
			return rawPath;
		},
		_parseOriginFactors = function(v) {
			var a = v.trim().split(" "),
				x = (v.indexOf("left") >= 0) ? 0 : (v.indexOf("right") >= 0) ? 100 : isNaN(parseFloat(a[0])) ? 50 : parseFloat(a[0]),
				y = (v.indexOf("top") >= 0) ? 0 : (v.indexOf("bottom") >= 0) ? 100 : isNaN(parseFloat(a[1])) ? 50 : parseFloat(a[1]);
			return {x:x / 100, y:y / 100};
		},
		_shortAngle = function(dif) {
			return (dif !== dif % _PI) ? dif + ((dif < 0) ? _2PI : -_2PI) : dif;
		},
		_morphMessage = "Use MorphSVGPlugin.convertToPath(elementOrSelectorText) to convert to a path before morphing.",



		MorphSVGPlugin = _gsScope._gsDefine.plugin({
			propName: "morphSVG",
			API: 2,
			global: true,
			version: "0.9.2",

			//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
			init: function(target, value, tween, index) {
				var cs = target.nodeType ? window.getComputedStyle(target) : {},
					fill = cs.fill + "",
					fillSafe = !(fill === "none" || (fill.match(_numbersExp) || [])[3] === "0" || cs.fillRule === "evenodd"),
					origins = (value.origin || "50 50").split(","),
					type, p, pt, shape, isPoly, shapeIndex, map, startSmooth, endSmooth, start, end, i, j, l, startSeg, endSeg, precompiled, sData, eData, originFactors, useRotation, offset;
				if (typeof(value) === "function") {
					value = value(index, target);
				}
				type = (target.nodeName + "").toUpperCase();
				isPoly = (type === "POLYLINE" || type === "POLYGON");
				if (type !== "PATH" && !isPoly && !value.prop) {
					_log("WARNING: cannot morph a <" + type + "> element. " + _morphMessage);
					return false;
				}
				p = (type === "PATH") ? "d" : "points";
				if (typeof(value) === "string" || value.getBBox || value[0]) {
					value = {shape:value};
				}
				if (!value.prop && typeof(target.setAttribute) !== "function") {
					return false;
				}
				shape = _parseShape(value.shape || value.d || value.points || "", (p === "d"), target);
				if (isPoly && _commands.test(shape)) {
					_log("WARNING: a <" + type + "> cannot accept path data. " + _morphMessage);
					return false;
				}
				shapeIndex = (value.shapeIndex || value.shapeIndex === 0) ? value.shapeIndex : "auto";
				map = value.map || MorphSVGPlugin.defaultMap;
				this._prop = value.prop;
				this._render = value.render || MorphSVGPlugin.defaultRender;
				this._apply = ("updateTarget" in value) ? value.updateTarget : MorphSVGPlugin.defaultUpdateTarget;
				this._rnd = Math.pow(10, isNaN(value.precision) ? 2 : +value.precision);
				this._tween = tween;
				if (shape) {
					this._target = target;
					precompiled = (typeof(value.precompile) === "object");
					start = this._prop ? target[this._prop] : target.getAttribute(p);
					if (!this._prop && !target.getAttributeNS(null, "data-original")) {
						target.setAttributeNS(null, "data-original", start); //record the original state in a data-original attribute so that we can revert to it later.
					}
					if (p === "d" || this._prop) {
						start = _stringToRawPath(precompiled ? value.precompile[0] : start);
						end = _stringToRawPath(precompiled ? value.precompile[1] : shape);
						if (!precompiled && !_equalizeSegmentQuantity(start, end, shapeIndex, map, fillSafe)) {
							return false; //malformed path data or null target
						}
						if (value.precompile === "log" || value.precompile === true) {
							_log('precompile:["' + _rawPathToString(start) + '","' + _rawPathToString(end) + '"]');
						}

						useRotation = (value.type || MorphSVGPlugin.defaultType) !== "linear";

						if (useRotation) {
							start = _populateSmoothData(start, value.smoothTolerance);
							end = _populateSmoothData(end, value.smoothTolerance   );
							if (!start.size) {
								_getTotalSize(start); //adds top/left/width/height values
							}
							if (!end.size) {
								_getTotalSize(end);
							}
							originFactors = _parseOriginFactors(origins[0]);
							this._origin = start.origin = {x:start.left + originFactors.x * start.width, y:start.top + originFactors.y * start.height};
							if (origins[1]) {
								originFactors = _parseOriginFactors(origins[1]);
							}
							this._eOrigin = {x:end.left + originFactors.x * end.width, y:end.top + originFactors.y * end.height};
						}

						this._rawPath = target._gsRawPath =  start;

						j = start.length;
						while (--j > -1) {
							startSeg = start[j];
							endSeg = end[j];
							startSmooth = startSeg.isSmooth || [];
							endSmooth = endSeg.isSmooth || [];
							l = startSeg.length;
							_lastLinkedAnchor = 0; //reset; we use _lastLinkedAnchor in the _tweenRotation() method to help make sure that close points don't get ripped apart and rotate opposite directions. Typically we want to go the shortest direction, but if the previous anchor is going a different direction, we override this logic (within certain thresholds)
							for (i = 0; i < l; i+=2) {
								if (endSeg[i] !== startSeg[i] || endSeg[i+1] !== startSeg[i+1]) {
									if (useRotation) {
										if (startSmooth[i] && endSmooth[i]) { //if BOTH starting and ending values are smooth (meaning control points have basically the same slope), interpolate the rotation and length instead of the coordinates (this is what makes things smooth).
											sData = startSeg.smoothData;
											eData = endSeg.smoothData;
											offset = i + ((i === l - 4) ? 7 - l : 5); //helps us accommodate wrapping (like if the end and start anchors are identical and the control points are smooth).
											this._controlPT = {_next:this._controlPT, i:i, j:j, l1s:sData[i+1], l1c:eData[i+1] - sData[i+1], l2s:sData[offset], l2c:eData[offset] - sData[offset]};
											pt = this._tweenRotation(startSeg, endSeg, i+2);
											this._tweenRotation(startSeg, endSeg, i, pt);
											this._tweenRotation(startSeg, endSeg, offset-1, pt);
											i+=4;
										} else {
											this._tweenRotation(startSeg, endSeg, i);
										}
									} else {
										pt = this._addTween(startSeg, i, startSeg[i], endSeg[i]);
										pt = this._addTween(startSeg, i+1, startSeg[i+1], endSeg[i+1]) || pt;
									}
								}
							}
						}
					} else {
						pt = this._addTween(target, "setAttribute", target.getAttribute(p) + "", shape + "", "morphSVG", false, p, _buildPointsFilter(shapeIndex));
					}

					if (useRotation) {
						this._addTween(this._origin, "x", this._origin.x, this._eOrigin.x);
						pt = this._addTween(this._origin, "y", this._origin.y, this._eOrigin.y);
					}

					if (pt) {
						this._overwriteProps.push("morphSVG");
						pt.end = shape;
						pt.endProp = p;
					}
				}
				return true;
			},

			set: function(ratio) {
				var rawPath = this._rawPath,
					controlPT = this._controlPT,
					anchorPT = this._anchorPT,
					rnd = this._rnd,
					target = this._target,
					s, space, easeInOut, pt, segment, l, angle, i, j, x, y, sin, cos, offset;
				this._super.setRatio.call(this, ratio);
				if (ratio === 1 && this._apply) {
					pt = this._firstPT;
					while (pt) {
						if (pt.end) {
							if (this._prop) {
								target[this._prop] = pt.end;
							} else {
								target.setAttribute(pt.endProp, pt.end); //make sure the end value is exactly as specified (in case we had to add fabricated points during the tween)
							}
						}
						pt = pt._next;
					}
				} else if (rawPath) {

					//rotationally position the anchors
					while (anchorPT) {
						angle = anchorPT.sa + ratio * anchorPT.ca;
						l = anchorPT.sl + ratio * anchorPT.cl;    //length
						anchorPT.t[anchorPT.i] = this._origin.x + _cos(angle) * l;
						anchorPT.t[anchorPT.i + 1] = this._origin.y + _sin(angle) * l;
						anchorPT = anchorPT._next;
					}

					//smooth out the control points
					easeInOut = ratio < 0.5 ? 2 * ratio * ratio : (4 - 2 * ratio) * ratio - 1;
					while (controlPT) {
						i = controlPT.i;
						segment = rawPath[controlPT.j];
						offset = i + ((i === segment.length - 4) ? 7 - segment.length : 5); //accommodates wrapping around of smooth points, like if the start and end anchors are on top of each other and their handles are smooth.
						angle = _atan2(segment[offset] - segment[i+1], segment[offset-1] - segment[i]); //average the angles
						sin = _sin(angle);
						cos = _cos(angle);
						x = segment[i+2];
						y = segment[i+3];
						l = controlPT.l1s + easeInOut * controlPT.l1c;    //length
						segment[i] = x - cos * l;
						segment[i+1] = y - sin * l;
						l = controlPT.l2s + easeInOut * controlPT.l2c;
						segment[offset-1] = x + cos * l;
						segment[offset] = y + sin * l;
						controlPT = controlPT._next;
					}

					target._gsRawPath = rawPath;

					if (this._apply) {
						s = "";
						space = " ";
						for (j = 0; j < rawPath.length; j++) {
							segment = rawPath[j];
							l = segment.length;
							s += "M" + (((segment[0] * rnd) | 0) / rnd) + space + (((segment[1] * rnd) | 0) / rnd) + " C";
							for (i = 2; i < l; i++) { //this is actually faster than just doing a join() on the array, possibly because the numbers have so many decimal places
								s += (((segment[i] * rnd) | 0) / rnd) + space;
							}
						}
						if (this._prop) {
							target[this._prop] = s;
						} else {
							target.setAttribute("d", s);
						}
					}
				}
				if (this._render && rawPath) {
					this._render.call(this._tween, rawPath, target);
				}
			}
		});


	MorphSVGPlugin.prototype._tweenRotation = function(start, end, i, linkedPT) {
		var so = this._origin,              //starting origin
			eo = this._eOrigin,             //ending origin
			dx = start[i] - so.x,
			dy = start[i+1] - so.y,
			d = _sqrt(dx * dx + dy * dy),   //length from starting origin to starting point
			sa = _atan2(dy, dx),
			angleDif, short;
		dx = end[i] - eo.x;
		dy = end[i+1] - eo.y;
		angleDif = _atan2(dy, dx) - sa;
		short = _shortAngle(angleDif);
		//in the case of control points, we ALWAYS link them to their anchor so that they don't get torn apart and rotate the opposite direction. If it's not a control point, we look at the most recently linked point as long as they're within a certain rotational range of each other.
		if (!linkedPT && _lastLinkedAnchor && Math.abs(short + _lastLinkedAnchor.ca) < _angleMin) {
			linkedPT = _lastLinkedAnchor;
		}
		return (this._anchorPT = _lastLinkedAnchor = {
			_next:this._anchorPT,
			t:start,
			sa:sa,                              //starting angle
			ca:(linkedPT && short * linkedPT.ca < 0 && Math.abs(short) > _angleMax) ? angleDif : short,  //change in angle
			sl:d,                               //starting length
			cl:_sqrt(dx * dx + dy * dy) - d,    //change in length
			i:i
		});
	};

	MorphSVGPlugin.pathFilter = _pathFilter;
	MorphSVGPlugin.pointsFilter = _pointsFilter;
	MorphSVGPlugin.getTotalSize = _getTotalSize;
	MorphSVGPlugin.subdivideRawBezier = MorphSVGPlugin.subdivideSegment = _subdivideSegment;
	MorphSVGPlugin.rawPathToString = _rawPathToString;
	MorphSVGPlugin.defaultType = "linear";
	MorphSVGPlugin.defaultUpdateTarget = true;
	MorphSVGPlugin.defaultMap = "size";
	MorphSVGPlugin.stringToRawPath = MorphSVGPlugin.pathDataToRawBezier = function(data) {
		return _stringToRawPath(_parseShape(data, true));
	};
	MorphSVGPlugin.equalizeSegmentQuantity = _equalizeSegmentQuantity;

	MorphSVGPlugin.convertToPath = function(targets, swap) {
		if (typeof(targets) === "string") {
			targets = TweenLite.selector(targets);
		}
		var a = (!targets || targets.length === 0) ? [] : (targets.length && targets[0] && targets[0].nodeType) ? Array.prototype.slice.call(targets, 0) : [targets],
			i = a.length;
		while (--i > -1) {
			a[i] = _convertToPath(a[i], (swap !== false));
		}
		return a;
	};

	MorphSVGPlugin.pathDataToBezier = function(data, vars) { //converts SVG path data into an array of {x, y} objects that can be plugged directly into a bezier tween. You can optionally pass in a 2D matrix like [a, b, c, d, tx, ty] containing numbers that should transform each point.
		var bezier = _stringToRawPath(_parseShape(data, true))[0] || [],
			prefix = 0,
			a, i, l, matrix, offsetX, offsetY, bbox, e;
		vars = vars || {};
		e = vars.align || vars.relative;
		matrix = vars.matrix || [1,0,0,1,0,0];
		offsetX = vars.offsetX || 0;
		offsetY = vars.offsetY || 0;
		if (e === "relative" || e === true) {
			offsetX -= bezier[0] * matrix[0] + bezier[1] * matrix[2];
			offsetY -= bezier[0] * matrix[1] + bezier[1] * matrix[3];
			prefix = "+=";
		} else {
			offsetX += matrix[4];
			offsetY += matrix[5];
			if (e) {
				e = (typeof(e) === "string") ? TweenLite.selector(e) : (e && e[0]) ? e : [e]; //allow array-like objects like jQuery objects.
				if (e && e[0]) {
					bbox = e[0].getBBox() || {x:0, y:0};
					offsetX -= bbox.x;
					offsetY -= bbox.y;
				}
			}
		}
		a = [];
		l = bezier.length;
		if (matrix && matrix.join(",") !== "1,0,0,1,0,0") {
			for (i = 0; i < l; i+=2) {
				a.push({x:prefix + (bezier[i] * matrix[0] + bezier[i+1] * matrix[2] + offsetX), y:prefix + (bezier[i] * matrix[1] + bezier[i+1] * matrix[3] + offsetY)});
			}
		} else {
			for (i = 0; i < l; i+=2) {
				a.push({x:prefix + (bezier[i] + offsetX), y:prefix + (bezier[i+1] + offsetY)});
			}
		}
		return a;
	};



export { MorphSVGPlugin, MorphSVGPlugin as default };