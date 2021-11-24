var soap = require('soap');
var url = 'http://localhost:8000/wsdl?wsdl';

// Create client
soap.createClient(url, function (err, client) {
  if (err){
    throw err;
  }
  /*
  * Parameters of the service call: they need to be called as specified
  * in the WSDL file
  */
  var args = {
    //message: "id1:12:34:56:out42",
    //splitter: ":",
    id: "2",
    name: "it-consulting24.de",
    location: "Köln",
    businessType: "IT"
  };
  // call the service
  client.Company(args, function (err, res) {
    if (err)
      throw err;
    // print the service returned result
    console.log(res);
  });
});
