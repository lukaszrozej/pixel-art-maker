const canvas = $('#pixel_canvas');

$(function() {
	$("#sizePicker").submit(function(e) {
		const height = Number($('#input_height').val());
		const width = Number($('#input_width').val());
		makeGrid(width, height);
		e.preventDefault();
	});
});

function changeColor(e) {
	$(e.target).css('background-color', $('#colorPicker').val());
	console.log('bla')
}

function makeGrid(width, height) {
	canvas.empty();
	for(let i = 0; i < height; i++) {
		const row = $('<tr></tr>');
		for(let j = 0; j < width; j++) {
			const cell = $('<td></td>');
			cell.on('mousedown', changeColor);
			row.append(cell);
		}
		canvas.append(row);
	}
}