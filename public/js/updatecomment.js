'use strict';

//get comments for specific user
//display the comments on the page
  //include edit and delete buttons for each comment
//create patch for on click 'edit'
//create delete route on click 'delete'
//redraw the comments with the updated results

$(document).ready(function(){
  getComments();
  console.log("get comments");

function getComments(data){
  $.ajax({
    url:'http://localhost:8000/comments/users/1',
    jsonp: "callback",
    data: data,
    type: 'get',
    success: function (data){
      console.log(data);
      console.log('success');
      drawComments(data);
    },
    error: function(){
      console.log("error");
    }
  });
}


function drawComments(data){
  var i;
  var results = [];
  console.log(data);
  $('#comments').empty();
  for (i=0 ; i<data.length ; i++){
    results.push(
      '<div class="col s8 comments">' +
          '<div class="card-panel white">' +
      '<span class="black-text">"' + data[i].comment + '"</span>' +
      '<div class="row center">' +
      '</div>' +

           '<a class="modal-trigger waves-effect waves-light btn" href="#modal1">Update</a>' +
           '<a class="modal-trigger waves-effect waves-light btn" href="#modal1">Delete</a>' +
           '<div id="modal1" class="modal modal-fixed-footer">' +
             '<div class="modal-content">' +
               '<h4>Comments</h4>' +
               '<p>' + data[i].comment + '</p>' +
             '</div>' +
             '<div class="modal-footer">' +
               '<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat ">Save</a>' +
             '</div>' +
           '</div>' +
        '</div>' +
          '<div class="col s2 "></div>' +
        '</div>' +
      '</div>'
  );
}
  $('.modal1').modal();
  $('.comments').append(results.join(''));
}

$('#commentbutton').on('click', function(){
  console.log("I'm clicked");
  event.target.hide();
});


});
