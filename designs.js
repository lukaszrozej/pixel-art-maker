$(function() {

	// *************************************
	// DOM elements

	const canvas = $('#pixel-canvas');

	// *************************************
	// State

	// array of actions, used for undo and redo
	let history = [];

	// position in the  array above
	let momentInHistory = 0;

	// list of all pixel color changes for current action
	// array of objects with properties
	// cell, oldColor, newColor
	let currentAction;

	let newColor = hexToRGB($('#colorPicker').val());

	let height = 20;
	let width = 20;

	let isPainting = false;
	let tool = 'brush';

	// coordinates of the first point on the line
	let x0, y0;

	// *************************************
	// Helper functions

	function hexToRGB(hex) {
	    const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return "rgb(" + r + ", " + g + ", " + b + ")";
	}

	function coordinatesFromCell(cell) {
		return cell
				.attr('id')
				.split('-')
				.map(Number);
	}

	// *************************************
	// History functions

	function recordCurrentAction() {
		if (momentInHistory < history.length) {
			history.splice(momentInHistory)
		}
		history.push(currentAction);
		momentInHistory++;
		$('#undo').removeAttr('disabled');
		$('#redo').attr('disabled', 'disabled');
	}

	// *************************************
	// Painting functions

	function changeColor(cell, newColor) {
		const oldColor = cell.css('background-color');
		if (oldColor === newColor) {
			return;
		}
		cell.css('background-color', newColor);
		currentAction.push({cell: cell,
							oldColor: oldColor,
							newColor: newColor
							});
	}

	function startPainting(e) {
		isPainting = true;
		const cell = $(e.target);
		if (tool === 'brush') {
			currentAction = [];
			changeColor(cell, newColor);
		}
		if (tool === 'line') {
			[x0, y0] = coordinatesFromCell(cell);
			line(x0, y0, x0, y0);
		}
		// to prevent firing drag events
		return false;
	}

	function paint(e) {
		if (!isPainting) {
			return;
		}
		const cell = $(e.target);
		if (tool === 'brush') {
			changeColor(cell, newColor);
		}
		if (tool === 'line') {
			for(item of currentAction) {
				item.cell.css('background-color', item.oldColor);
			}
			const [x1, y1] = coordinatesFromCell(cell);
			line(x0, y0, x1, y1);
		}
	}

	function stopPainting() {
		if (isPainting)	{
			isPainting = false;
			recordCurrentAction();
		}
	}

	function fill(e) {
		if (tool != 'fill') {
			return true;
		}
		const firstCell = $(e.target);
		oldColor = firstCell.css('background-color');
		if (newColor === oldColor) {
			return true;
		}
		currentAction = [];
		recursiveFill(firstCell);

		function recursiveFill(cell) {
			changeColor(cell, newColor);
			const [x, y] = coordinatesFromCell(cell);
			if (x > 0) {
				const leftCell = $('#' + (x-1) + '-' + y);
				if (leftCell.css('background-color') === oldColor) {
					recursiveFill(leftCell);
				}
			}
			if (x < width-1) {
				const rightCell = $('#' + (x+1) + '-' + y);
				if (rightCell.css('background-color') === oldColor) {
					recursiveFill(rightCell);
				}
			}
			if (y > 0) {
				const topCell = $('#' + x + '-' + (y-1));
				if (topCell.css('background-color') === oldColor) {
					recursiveFill(topCell);
				}
			}
			if (y < height-1) {
				const bottomCell = $('#' + x + '-' + (y+1));
				if (bottomCell.css('background-color') === oldColor) {
					recursiveFill(bottomCell);
				}
			}
		}
	}

	// borrowed from:
	// https://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
	function line(x0, y0, x1, y1){
		const dx = Math.abs(x1-x0);
		const dy = Math.abs(y1-y0);
		const sx = (x0 < x1) ? 1 : -1;
		const sy = (y0 < y1) ? 1 : -1;

		let err = dx - dy;

		currentAction = [];
		changeColor($('#' + x0 + '-' + y0), newColor);

		while((x0 != x1) || (y0 != y1)) {
			let e2 = 2*err;
			if (e2 > -dy) {
				err -= dy;
				x0  += sx;
			}
			if (e2 < dx) {
				err += dx;
				y0  += sy;
			}
			changeColor($('#' + x0 + '-' + y0), newColor);
		}
	}

	// *************************************
	// make grid function

	function makeGrid(width, height) {
		momentInHistory = 0;
		history.splice(0)
		$('#undo').attr('disabled', 'disabled');
		$('#redo').attr('disabled', 'disabled');
		canvas.empty();
		for(let i = 0; i < height; i++) {
			const row = $('<tr></tr>');
			for(let j = 0; j < width; j++) {
				const cell = $('<td id="' + j + '-'  + i + '"></td>');
				cell.on('mousedown', startPainting);
				cell.on('mouseenter', paint);
				cell.on('mouseup', fill);
				row.append(cell);
			}
			canvas.append(row);
		}
	}

	// *************************************
	// Event listeners

	$('#new-grid').on('click', function() {
		$('#canvas-container').slideUp('slow', function() {
			$("#size-picker").slideDown('slow');
		});
	});

	$("#size-picker").submit(function(e) {
		height = Number($('#input_height').val());
		width = Number($('#input_width').val());
		makeGrid(width, height);
		$('#size-picker').slideUp('slow', function() {
			$('#canvas-container').slideDown('slow');
		});
		e.preventDefault();
	});

	$('#cancel').on('click', function() {
		$('#size-picker').slideUp('slow', function() {
			$('#canvas-container').slideDown('slow');
		});
	});

	$('#colorPicker').on('change', function() {
		newColor = hexToRGB($(this).val());
	});

	$('input[name=tool]').on('change', function() {
	   tool = $('input[name=tool]:checked').val();
	});

	$('#undo').on('click', function() {
		momentInHistory--;
		const action = history[momentInHistory];
		for(item of action) {
			item.cell.css('background-color', item.oldColor);
		}
		if (momentInHistory === 0) {
			$('#undo').attr('disabled', 'disabled');
		}
		$('#redo').removeAttr('disabled');
	});

	$('#redo').on('click', function() {
		const action = history[momentInHistory];
		for(item of action) {
			item.cell.css('background-color', item.newColor);
		}
		momentInHistory++;
		if (momentInHistory === history.length) {
			$('#redo').attr('disabled', 'disabled');
		}
		$('#undo').removeAttr('disabled');
	});

	// mouseup on body to handle a situation
	// when user drags the mouse out of the table and then releases it
	$('body').on('mouseup', stopPainting);


	makeGrid(width,height);
});