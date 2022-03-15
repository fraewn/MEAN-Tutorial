var soap = require('soap');
var url = 'http://localhost:8000/wsdl?wsdl';

// Create soap client
soap.createClient(url, function (err, client) {
  if (err){
    throw err;
  }
  var args = {
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
