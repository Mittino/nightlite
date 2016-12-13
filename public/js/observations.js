'use strict';
var obsID;

$(document).ready(function(){
  getObservations();
  getComments();
  // drawObservations(obsData);

  $(".information").on('click', function(event){
    // event.preventDefault();
    console.log(event.target);
    if ($(event.target).hasClass('commentsButton')) {
      console.log(event.target.getAttribute('attr'));
      obsID = event.target.getAttribute('attr');

      getComments();

      $('#modal1').modal('open');
    }
    if ($(event.target).hasClass('submit-button')) {
      console.log('submit');
      // $('#modal1').modal('open');
    }
  });

  $(".submit-button").on('click', function(event){
    event.preventDefault();
    console.log('submit clicked');
    //getObservations();
  });

  $(".commentsButton").on('click', function(event){
    // console.log($('.id'));
    console.log('submit clicked');
  });

});

  var obsData;
  var comments;

  function getObservations(data){
  $.ajax({
    // url: 'https://nightlited.herokuapp.com/observations',
    url:'http://localhost:8000/observations/',
    jsonp: "callback",
    data: data,
    type: 'get',
    success: function (data){
      // console.log(data, "OBSERVATIONS");
      // console.log('success');
      obsData = data;
      drawObservations(obsData);
      // getComments();
    },
    error: function(){
      console.log("error");
    }
  });
    //gets observation data
    //draws on page
  }

  function getComments(data){
    console.log("in HERE");
    $.ajax({
      // url: 'https://nightlited.herokuapp.com/observations',
      url:'http://localhost:8000/observations/comments/' + obsID,
      jsonp: "callback",
      data: data,
      type: 'get',
      success: function (data){
        console.log(data, "comments by ID");
        comments = data;
        // drawObservations(obsData);
        $('#content').append(JSON.stringify(data));
      },
      error: function(){
        console.log("error");
      }
    });
}


function drawObservations(data){
  console.log("DATA: ", data);
  // console.log(obsData, "in draw");
  // console.log(comments, "in draw");

  $('.information').empty();
  var template = [];
  template.push('<button id="testButton">TEST BUTTON</button>');

  for (var i = 0; i <data.length; i++){
    var date = data[i].updated_at
    date = date.substring(0, 10);

    template.push(
      '<div class="row">' +
        '<hr>' +
          '<div class="col s12">' +
              '<h5 class="black-text">' + data[i].name +'</h5>' +
              '<div class="black-text">Location: ' + data[i].name +'</div>' +
              '<div class="black-text">Description: ' + data[i].description + '</div>' +
              '<div class="black-text">Rating: ' + data[i].stars + '</div>' +
              '<div class="black-text">Coordinates:  Latitude:  ' + data[i].latitude + ' Longitude:  ' + data[i].longitude + '</div>' +
              '<div class="black-text">Date: ' + date + '</div>' +
              '<div class="black-text">Posted by: ' + data[i].username + '</div>' +
              '<div class="id black-text">ID: ' + data[i].id + '</div>' +

              '<div class="input-field s6 m6 l3">' +
                  '<input value="" type="text" class="validate comments">' +
                  '<label class="active black-text" for="comments">Comments: ' + '</label>' +
                  '<button class="submit-button" class="col s3 btn waves-effect waves-light blue lighten-1" type="button" name="make-comment">Add Comment</button>' +
                  '<button attr=' + data[i].id + ' class="commentsButton white-text col s6 btn waves-effect waves-light blue lighten-1" type="button" name="view-comment">View Comments</button>' +

                  '<div id="commentsDiv' + data[i].id +'">' +
                  '</div>' +
              '</div>' +
          '</div>' +
      '</div>'
      // '<button id="testButton">TEST BUTTON ' + i + '</button>'
    );
  }
  console.log("template: ", template);
  $('.information').append(template.join(''));
}
