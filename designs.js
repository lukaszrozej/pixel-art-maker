$(function() {
	$("#sizePicker").submit(function(e) {
		makeGrid();
		e.preventDefault();
	});
	$('#pixel_canvas').click(function(e) {
		$(e.target).css('background-color', $('#colorPicker').val());
	});
});

function makeGrid() {
	const height = Number($('#input_height').val());
	const width = Number($('#input_width').val());
	const row = '<tr>' + '<td></td>'.repeat(width) + '</td>';
	const rows = row.repeat(height);
	$('#pixel_canvas').empty().append(rows);
}