const canvas = $('#pixel_canvas');

let height = 0;
let width = 0;

let isPainting = false;
let tool = 'brush';

$(function() {
	$("#sizePicker").submit(function(e) {
		height = Number($('#input_height').val());
		width = Number($('#input_width').val());
		makeGrid(width, height);
		e.preventDefault();
	});
	$('#tools').on('change', function() {
	   tool = $('input[name=tool]:checked').val();
	   console.log(tool);
	});
	$('#undo').on('click', function() {
		console.log('undo');
	});
	$('#redo').on('click', function() {
		console.log('redo');
	});
	// mouseup on body to handle a situation
	// when user drags the mouse out of the table and then releases it
	$('body').on('mouseup', stopPainting);
});

function startPainting(e) {
	if (tool === 'brush') {
		isPainting = true;
		$(e.target).css('background-color', $('#colorPicker').val());
		console.log('START')
	}
	// to prevent firing drag events
	return false;
}

function paint(e) {
	if (isPainting) {
		$(e.target).css('background-color', $('#colorPicker').val());
	}
}

function stopPainting() {
	isPainting = false;
	console.log('STOP')
}

function fill(e) {
	if (tool != 'fill') {
		return true;
	}
	const firstCell = $(e.target);
	oldColor = firstCell.css('background-color');
	newColor = $('#colorPicker').val();
	if (newColor === oldColor) {
		return true;
	}
	const cellsToFill = [firstCell];
	while(cellsToFill.length > 0) {
		const currentCell = cellsToFill.pop();
		currentCell.css('background-color', newColor);
		[x, y] = currentCell
					.attr('id')
					.split('-')
					.map(Number);
		if (x > 0) {
			const leftCell = $('#' + (x-1) + '-' + y);
			if (leftCell.css('background-color') === oldColor) {
				cellsToFill.push(leftCell)
			}
		}
		if (x < width-1) {
			const rightCell = $('#' + (x+1) + '-' + y);
			if (rightCell.css('background-color') === oldColor) {
				cellsToFill.push(rightCell)
			}
		}
		if (y > 0) {
			const topCell = $('#' + x + '-' + (y-1));
			if (topCell.css('background-color') === oldColor) {
				cellsToFill.push(topCell)
			}
		}
		if (x < height-1) {
			const bottomCell = $('#' + x + '-' + (y+1));
			if (bottomCell.css('background-color') === oldColor) {
				cellsToFill.push(bottomCell)
			}
		}
	}
}

function makeGrid(width, height) {
	canvas.empty();
	for(let i = 0; i < height; i++) {
		const row = $('<tr></tr>');
		for(let j = 0; j < width; j++) {
			const cell = $('<td id="' + i + '-'  + j + '"></td>');
			cell.on('mousedown', startPainting);
			cell.on('mouseenter', paint);
			cell.on('mouseup', fill);
			row.append(cell);
		}
		canvas.append(row);
	}
}