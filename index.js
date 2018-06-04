var unselected_btn_class = "btn-floating waves-effect waves-light grey";
var selected_btn_class = "btn-floating waves-effect waves-light blue";
var btn_ids = ['#Origin_Btn', '#GDP_Btn', '#Integration_Btn']
var label_ids = ['#Origin_Label', '#GDP_Label', '#Integration_Label']

function reset_selected() {
  for (var i = 0; i < 3; i++)
  {
    $(btn_ids[i]).removeClass('blue');
    $(label_ids[i]).removeClass('label_selected');
  }
};

$('#Origin_Btn').click(function() {
  if ($(this).attr('class') == selected_btn_class) {
    console.log("HERE");
    reset_selected();
    $(this).addClass('blue');
    $('#Origin_Label').addClass('label_selected');
  }  
})

$('#GDP_Btn').click(function() {
  if (!$(this).attr('class') == selected_btn_class) {
    console.log("HERE");
    reset_selected();
    $(this).addClass('blue');
    $('#GDP_Label').addClass('label_selected');
  }
})

$('#Integration_Btn').click(function() {
  if (!$(this).attr('class') == selected_btn_class) {
    console.log("HERE");
    reset_selected();
    $(this).addClass('blue');
    $('#GDP_Label').addClass('label_selected');   
  }
})