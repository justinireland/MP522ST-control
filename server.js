var fs = require('fs');
var net = require('net');
var server = require('http').createServer(function(req, response){
  fs.readFile(__dirname+'app/client.html', function(err, data){
    response.writeHead(200, {'Content-Type':'text/html'}); 
    response.write(data);  
    response.end();
  });
});
server.listen(8080);

var nowjs = require("now");
var everyone = nowjs.initialize(server);

var gatewayIP = "192.168.0.230";
var gatewayPort = 4998;

// These values are defined by the GC-100 API
var connectorAddr = "2";
var ID = 1;
var IRcommand = null;
var IRcount = 1;
var IRfrequency = 38000;
var IRoffset = 1;
var IRrepeat = 1;

// This function transmits the IR command to the GC-100
var sendIR = function(data) {
	var client = new net.Socket();
	client.connect(gatewayPort, gatewayIP, function() {

    console.log('CONNECTED TO: ' + gatewayIP + ':' + gatewayPort);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    var sendData = "sendir,"+connectorAddr+":"+ID+","+IRrepeat+","+IRfrequency+","+IRcount+","+IRoffset+","+data+"\r";
	client.write(sendData);
	console.log(sendData + " was sent to " + gatewayIP + ':' + gatewayPort);
	});

	// Add a 'data' event handler for the client socket
	// data is what the server sent to this socket
	client.on('data', function(data) {
    
    console.log('DATA: ' + data);
    // Close the client socket completely
    client.destroy();
    
	});

	// Add a 'close' event handler for the client socket
	client.on('close', function() {
    	console.log('Connection closed');
	});
}

// This function determines what IR command to send based on what button is pressed
var whichCommand = function(command) {		
	switch(command) {
		case "power":			
			IRcommand = "341,169,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,63,21,63,21,20,21,20,21,20,21,63,21,20,21,20,21,20,21,20,21,20,21,20,21,63,21,20,21,63,21,63,21,63,21,63,21,63,21,63,21,760";
			break;
		case "play-pause":			
			IRcommand = "341,171,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,63,21,63,21,20,21,20,21,63,21,63,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,63,21,63,21,63,21,63,21,63,21,63,21,760";
			break;
		case "menu":			
			IRcommand = "342,170,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,64,22,64,22,20,22,20,22,64,22,64,22,64,22,64,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,64,22,64,22,64,22,64,22,760";
			break;
		case "up-arrow":			
			IRcommand = "342,169,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,62,22,62,22,20,22,20,22,62,22,62,22,20,22,62,22,20,22,20,22,20,22,20,22,20,22,20,22,62,22,20,22,62,22,62,22,62,22,62,22,760";
			break;
		case "down-arrow":			
			IRcommand = "342,168,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,63,22,63,22,21,22,21,22,21,22,21,22,63,22,63,22,21,22,21,22,21,22,21,22,63,22,63,22,21,22,21,22,63,22,63,22,63,22,63,22,760";
			break;
		case "left-arrow":			
			IRcommand = "341,170,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,63,21,63,21,21,21,21,21,63,21,21,21,63,21,63,21,21,21,21,21,21,21,21,21,21,21,63,21,21,21,21,21,63,21,63,21,63,21,63,21,760";
			break;
		case "right-arrow":			
			IRcommand = "342,168,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,62,22,62,22,21,22,21,22,21,22,62,22,62,22,62,22,21,22,21,22,21,22,21,22,62,22,21,22,21,22,21,22,62,22,62,22,62,22,62,22,760";
			break;
		case "auto":			
			IRcommand = "341,171,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,63,21,63,21,20,21,20,21,20,21,20,21,20,21,63,21,20,21,20,21,20,21,20,21,63,21,63,21,63,21,20,21,63,21,63,21,63,21,63,21,760";
			break;
		case "mode":			
			IRcommand = "342,169,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,22,63,22,63,22,21,22,21,22,21,22,21,22,21,22,21,22,63,22,21,22,21,22,21,22,63,22,63,22,63,22,63,22,21,22,63,22,63,22,63,22,760";
			break;
		case "blank":			
			IRcommand = "341,172,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,64,21,64,21,20,21,20,21,64,21,64,21,64,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,64,21,64,21,64,21,64,21,64,21,760";
			break;
		case "source":			
			IRcommand = "341,170,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,20,21,63,21,63,21,20,21,20,21,20,21,20,21,63,21,20,21,20,21,20,21,20,21,20,21,63,21,63,21,20,21,63,21,63,21,63,21,63,21,63,21,760";
			break;
		case "zoom+":			
			IRcommand = "342,170,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,63,22,63,22,20,22,20,22,20,22,20,22,20,22,63,22,63,22,20,22,20,22,20,22,63,22,63,22,63,22,20,22,20,22,63,22,63,22,63,22,760";
			break;
		case "zoom-":			
			IRcommand = "342,170,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,63,22,63,22,20,22,20,22,63,22,20,22,20,22,63,22,63,22,20,22,20,22,20,22,20,22,63,22,63,22,20,22,20,22,63,22,63,22,63,22,760";
			break;
		case "timer-on":			
			IRcommand = "341,169,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,63,21,63,21,21,21,21,21,63,21,21,21,63,21,21,21,21,21,21,21,21,21,21,21,21,21,63,21,21,21,63,21,63,21,63,21,63,21,63,21,760";
			break;
		case "timer-setup":			
			IRcommand = "342,169,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,20,22,63,22,63,22,20,22,20,22,20,22,63,22,63,22,20,22,20,22,20,22,20,22,20,22,63,22,20,22,20,22,63,22,63,22,63,22,63,22,63,22,760";
			break;	
	}
	//Send actual command to gateway
	sendIR(IRcommand);
}

everyone.now.buttonPress = function(button){
   console.log(button + " button pressed");
   //Determine which button was pressed
   whichCommand(button);
}

