if (Meteor.isClient) {

  Template.stats.events({
    'click #parse': function () {
      // template data, if any, is available in 'this'
      parse();
      $('#n').html("<b>" + $('#name').val() + "</b");
      

    }
  });

function parse(){
  var username = $('#name').val();

  var lines = {total:0,additions:0,deletions:0};
  var commits = 0;


  nonasync("https://api.github.com/users/" + username + "/subscriptions", function(data){//dbs the user is subscribed to
    console.log(data);

    for(var i in data){
      console.log('NAME');
      console.log(data[i].name);
      
      var newURL = data[i].commits_url.replace("{/sha}", "");//commit urls
      console.log(newURL);

      
      nonasync(newURL, function(data2){
        console.log(2);
        console.log(data2);
        for(var j in data2){
          if(data2[j].author && data2[j].author.login == username){//if the commit belongs to this user...
            nonasync(newURL + "/" + data2[j].sha, function(data3){
              console.log(data3.stats)//stats
              addObjects(lines, data3.stats);
              commits++;
              console.log(data3);


              // nonasync



            })
          }
        }

      })
    }

  });

  console.log('x');
  console.log(lines);

  var ret = "";
  for(var i in lines)
    ret += i.charAt(0).toUpperCase() + i.slice(1) + ": <b>" + lines[i] + "</b>; ";

  ret+= "Commits: <b>" + commits + "</b>";
  $('#s').html(ret);
  return ret;



}

function nonasync(u, cb){//so it's only executed once last call has been rendered

  $.ajax({
    url: u + "?access_token=" + Meteor.user().services.github.accessToken,
    success: cb,
    async:false,
    error:function(){/*alert('something went wrong :(')*/}
  });

}

function addObjects(a,b){//where a is the running total and the one to be modified
  for(var i in a)
    a[i] += b[i];
  return a;

}





}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
