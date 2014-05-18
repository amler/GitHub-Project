'use strict';


var authorization = '?client_id=ae0e05f3a8dfef3795ed&client_secret=bcad8d8d0f8b5292fd0ffbbbec8d8c1b652b383a';

function setUserData (userData) {


  // add joinedDate to userData
  var date = new Date(userData.created_at );
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December"];
  var month = date.getMonth();
  var usersMonth = (months[month]).substring(0,3);
  var day = date.getDate();
  var year = date.getFullYear();
  userData.joined_date = usersMonth + " " + day + ", " + year;


  // get string of template (getting all of the markup as a string by selecting class of script)
  var userTemplate = $('#userInfo').html();

  // render my template with my data object
  var userHtml = _.template(userTemplate, userData);

  // adding my rendered html to the body
  $('body').append(userHtml);


  // get repository data
     $.getJSON(userData.repos_url + authorization).done(setReposData);

}



function setReposData (reposData) {

  // creating an array of total starred count
  var starredArray = reposData.map(function(repo) {
    return repo.stargazers_count;
  });
  
  // reducing all the values in my array to a single value.
  var totalStarred = starredArray.reduce(function(firstvalue, secondvalue) {
    return (firstvalue + secondvalue);
  });
  // aprarently there is a shorter way to do this other than map and reduce.
  $('.starred-count').html(totalStarred);

  var repoTemplate = $('#respository').html();
 // console.log(repoTemplate);
  
  var templateMethod = _.template(repoTemplate);

  reposData.forEach(function (repo){
    /// getting last updated day of the week.
    var date = new Date(repo.updated_at);
    var weekdays = [ 'Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday', 'Saturday'];
    var day = date.getDay();
    var weekDay = (weekdays[day]);
    var timeStamp = date.setHours(15);;
    console.log(timeStamp);
    //var year = date.getFullYear();
    //userData[] = Day + " at " + time ;

    // putting each repo in my template to be rendered 
    var rendered = templateMethod(repo);
    
    // actually rendering the content to div with the class repocontent.  
    $('.repocontent').append(rendered);
    


  });

}

$.getJSON('https://api.github.com/users/amler' + authorization ).done(setUserData);
