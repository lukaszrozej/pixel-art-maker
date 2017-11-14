$("#sizePicker").submit(makeGrid);

function makeGrid() {
	const height = Number($('#input_height').val());
	const width = Number($('#input_width').val());
	const row = '<tr>' + '<td></td>'.repeat(width) + '</td>';
	const rows = row.repeat(height);
	$('#pixel_canvas').empty().append(rows);
}