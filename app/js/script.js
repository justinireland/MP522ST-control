/* Author: 

*/
$(document).ready(function(){
	
	//Click handler for now.js module	
  	$(".device").click(function(){
    	now.buttonPress($(this).attr('device'),$(this).attr('id'));
  	});	
});