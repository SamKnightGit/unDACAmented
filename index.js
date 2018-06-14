$(document).ready(function() {
	draw_origin();
	var selected_btn_class = "btn-floating waves-effect waves-light blue";
	var btn_ids = ['#Origin_Btn', '#GDP_Btn', '#Integration_Btn'];
	var label_ids = ['#Origin_Label', '#GDP_Label', '#Integration_Label'];
	var div_ids = [''];

	function reset_selected() {
		for (var i = 0; i < 3; i++)
		{
			$( btn_ids[i] ).removeClass('blue');
			$( btn_ids[i] ).addClass('grey');
			$( label_ids[i] ).removeClass('label_selected');
			$( label_ids[i] ).addClass('labels');
		}
	}


	$( "#Origin_Btn" ).click(function() {
		if ($( this ).attr('class') != selected_btn_class) {
			reset_selected();
			$( this ).removeClass('grey');
			$( this ).addClass('blue');
			$( '#Origin_Label' ).removeClass('labels');
			$( '#Origin_Label' ).addClass('label_selected');
			draw_origin();
		}
	});

	$( "#Integration_Btn" ).click(function() {
		if ($( this ).attr('class') != selected_btn_class) {
			reset_selected();
			$( this ).removeClass('grey');
			$( this ).addClass('blue');
			$( '#Integration_Label' ).removeClass('labels');
			$( '#Integration_Label' ).addClass('label_selected');
			draw_integration();
		}
	});

	$( "#GDP_Btn" ).click(function() {
		if ($( this ).attr('class') != selected_btn_class) {
			reset_selected();
			$( this ).removeClass('grey');
			$( this ).addClass('blue');
			$( '#GDP_Label' ).removeClass('labels');
			$( '#GDP_Label' ).addClass('label_selected');
			console.log("gdp btn clicked");
			$("#visuals").toggle();
			$("#gdp_visuals").toggle();
			draw_gdp();
		}
	});

});
