$(document).ready(function() {
    $('select').material_select();
});

$('#showEdit').click(function () {
  $('#editForm').toggleClass('hidden');
})

$( ".studentDiv" ).draggable({
});

$("#notamember").click(function () {
  $(".login").toggleClass("hidden")
  $(".signup").toggleClass("hidden")
  $("#notamember").toggleClass("hidden")
})

$("#backtologin").click(function () {
  $(".login").toggleClass("hidden")
  $(".signup").toggleClass("hidden")
  $("#notamember").toggleClass("hidden")
})

// $('document').ready(function () {
//   window.setTimeout(function () {
//     $("#welcomeHeader").fadeOut('slow')
//   }, 1000)

//   $("#welcomeHeader").addClass('hidden')
// })

$(document).ready(function(){
   // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
   $('.modal-trigger').leanModal();
 });

$("#linkToGroup").click(function () {
  $("#groupForm").toggleClass("hidden")
})

$("#picture-dropzone").dropzone({ url: "/classes/:id" });

// $('#pushpin').bind('mouseenter', function(){
//      $(this).effect("bounce", { times:3 }, 1000);
// });
