const canvas = $('#pixel_canvas');

let isPainting = false;

$(function() {
	$("#sizePicker").submit(function(e) {
		const height = Number($('#input_height').val());
		const width = Number($('#input_width').val());
		makeGrid(width, height);
		e.preventDefault();
	});
	// mouseup on body to handle a situation
	// when user drags the mouse out of the table and then releases it
	$('body').on('mouseup', stopPainting);
});

function startPainting(e) {
	isPainting = true;
	$(e.target).css('background-color', $('#colorPicker').val());
}

function paint(e) {
	if (isPainting) {
		$(e.target).css('background-color', $('#colorPicker').val());
	}
}

function stopPainting() {
	isPainting = false;
}

function makeGrid(width, height) {
	canvas.empty();
	for(let i = 0; i < height; i++) {
		const row = $('<tr></tr>');
		for(let j = 0; j < width; j++) {
			const cell = $('<td></td>');
			cell.on('mousedown', startPainting);
			cell.on('mouseenter', paint);
			row.append(cell);
		}
		canvas.append(row);
	}
}