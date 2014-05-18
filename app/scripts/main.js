'use strict';

function timeSince(date) {
    
    date = new Date(date);

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);
    
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    var weekdays = [ 'Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday', 'Saturday'];


    if (interval > 1) {
        // return Nov 25, 2013 --- 
        var year = date.getFullYear();
        return months[date.getMonth()] + " " + date.getDate() + ", " + year;

    }

    // > 4 days
    interval = Math.floor(seconds / 345600);
    if (interval > 1) {
        // return Apr 9
        return months[date.getMonth()] + " " + date.getDate();
    }

    // > day
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      // return Thursday at 1:20am
      var day = date.getDay();
      var weekDay = (weekdays[day]);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      if (hours < 12) {
        // return Thursday at 10:00am
        return weekDay + ' at ' + hours + ":" + minutes + "am";
     
      } else if (hours > 12){
        //return Thursday at 1:00pm
        hours = hours - 12
        return weekDay + ' at ' + hours + ":" + minutes + "pm";

      } else if (hours == 12) {
        // return Thursday 12:00pm
        return weekDay + ' at ' + hours + ":" + minutes + "pm";
      }
      return interval + " days";
    }

    // > hour
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    
    // > minute
    if (interval > 1) {
        return interval + " minutes";
    }

    return Math.floor(seconds) + " seconds";
}



function formatDate (date) {
  date = new Date(date);
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December"];
  var month = date.getMonth();
  var usersMonth = (months[month]).substring(0,3);
  var day = date.getDate();
  var year = date.getFullYear();
  return usersMonth + " " + day + ", " + year;
}

var authorization = '?client_id=ae0e05f3a8dfef3795ed&client_secret=bcad8d8d0f8b5292fd0ffbbbec8d8c1b652b383a';

function setUserData (userData) {

  userData.joined_date = formatDate(userData.created_at);

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

  // Sort repos array
  reposData.sort(function (a, b) {
    if (a.pushed_at > b.pushed_at)
      return -1;
    if (a.pushed_at < b.pushed_at)
      return 1;
    // a must be equal to b
    return 0;
  });  

  var repoTemplate = $('#respository').html();
  // console.log(repoTemplate);
  
  var templateMethod = _.template(repoTemplate);


  reposData.forEach(function (repo){
    repo.updated_at = timeSince(repo.updated_at);

    // putting each repo in my template to be rendered 
    var rendered = templateMethod(repo);
    
    // actually rendering the content to div with the class repocontent.  
    $('.repocontent').append(rendered);
  });

}

$.getJSON('https://api.github.com/users/amler' + authorization ).done(setUserData);
