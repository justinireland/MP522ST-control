// Required modules
var fs = require('fs'),
	net = require('net'),
	http = require('http'),
	paperboy = require('paperboy'),
	path = require('path'),
	nowjs = require("now");

//Global variables
var	
	PORT = 8080,
	WEBROOT = path.join(path.dirname(__filename), 'app'),

	// IP info for GC-100
	gatewayIP = "192.168.0.230",
	gatewayPort = 4998,
	
	// These values are defined by the GC-100 API
	connectorAddr = "2",
	ID = 1,
	IRcommand = null,
	IRcount = 1,
	IRfrequency = 38000,
	IRoffset = 1,
	IRrepeat = 1;

// start http server
var server = http.createServer(function(req, res) {
  var ip = req.connection.remoteAddress;
  paperboy
    .deliver(WEBROOT, req, res)
    .addHeader('Expires', 300)
    .addHeader('X-PaperRoute', 'Node')
    .before(function() {
      console.log('Received Request');
    })
    .after(function(statCode) {
      log(statCode, req.url, ip);
    })
    .error(function(statCode, msg) {
      res.writeHead(statCode, {'Content-Type': 'text/plain'});
      res.end("Error " + statCode);
      log(statCode, req.url, ip, msg);
    })
    .otherwise(function(err) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end("Error 404: File not found");
      log(404, req.url, ip, err);
    });
}).listen(PORT);

function log(statCode, url, ip, err) {
  var logStr = statCode + ' - ' + url + ' - ' + ip;
  if (err)
    logStr += ' - ' + err;
  console.log(logStr);
}

// Initialize now.js
var	everyone = nowjs.initialize(server);

// This function transmits the IR command to the GC-100
var sendIR = function(data) {
	var client = new net.Socket();
	client.connect(gatewayPort, gatewayIP, function() {

    //console.log('CONNECTED TO: ' + gatewayIP + ':' + gatewayPort);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    var sendData = "sendir,"+connectorAddr+":"+ID+","+IRrepeat+","+IRfrequency+","+IRcount+","+IRoffset+","+data+"\r";
	client.write(sendData);
	//console.log(sendData + " was sent to " + gatewayIP + ':' + gatewayPort);
	});

	// Add a 'data' event handler for the client socket
	// data is what the server sent to this socket
	client.on('data', function(data) {
    
    //console.log('DATA: ' + data);
    // Close the client socket completely
    client.destroy();
    
	});

	// Add a 'close' event handler for the client socket
	client.on('close', function() {
    	//console.log('Connection closed');
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