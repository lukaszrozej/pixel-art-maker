$(function() {
	$("#sizePicker").submit(function(e) {
		const height = Number($('#input_height').val());
		const width = Number($('#input_width').val());
		makeGrid(width, height);
		e.preventDefault();
	});
	$('#pixel_canvas').on('click', 'td', function(e) {
		$(e.target).css('background-color', $('#colorPicker').val());
	});
});

function makeGrid(width, height) {
	// const row = '<tr>' + '<td></td>'.repeat(width) + '</td>';
	// const rows = row.repeat(height);
	// $('#pixel_canvas').empty().append(rows);
	let rows = '';
	for(let i = 0; i < height; i++) {
		let row = '<tr>';
		for(let j = 0; j < width; j++) {
			row += '<td></td>';
		}
		row += '</tr>';
		rows += row;
	}
	let oldRows = $('#pixel_canvas').children();
	for(let i = 0; i < oldRows.length; i++) {
		oldRows[i].remove();
		console.log(i)
		console.log($('#pixel_canvas').children())
		console.log(oldRows)
	}	
	$('#pixel_canvas').append(rows);

}