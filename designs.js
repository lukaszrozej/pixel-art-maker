const canvas = $('#pixel_canvas');

let isPainting = false;

$(function() {
	$("#sizePicker").submit(function(e) {
		const height = Number($('#input_height').val());
		const width = Number($('#input_width').val());
		makeGrid(width, height);
		e.preventDefault();
	});
});

function startPainting(e) {
	isPainting = true;
	$(e.target).css('background-color', $('#colorPicker').val());
}

function makeGrid(width, height) {
	canvas.empty();
	for(let i = 0; i < height; i++) {
		const row = $('<tr></tr>');
		for(let j = 0; j < width; j++) {
			const cell = $('<td></td>');
			cell.on('mousedown', startPainting);
			row.append(cell);
		}
		canvas.append(row);
	}
}