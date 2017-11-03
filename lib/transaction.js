/**
 * Track the trade of a commodity from one trader to another
 * @param {org.acme.mynetwork.Send} send - the trade to be processed
 * @transaction
 */
function sendUnit(send) {

    // Update the asset with the new value.
    send.carton.recipient = send.recp;
    var today = new Date();
    var y = today.getFullYear();
    var m = today.getMonth();
    var d = today.getDate();
    send.carton.dateOfDeparture = d + '/' + m + '/' + y ;
    send.carton.status = 'Sending to ' + send.recp ;
  	var track = getFactory().newConcept('org.acme.mynetwork','Trackrecord');
    var trackarr = new Array(); 
  trackarr.push(send.carton.trackrecord);
     track.ownerId = send.carton.manufacturerId ;
  	track.timeStamp = d + '/' + m + '/' + y ;
  trackarr.push(track)
  for(var i=0; i < send.carton.units.length ; i++) {
  send.carton.units[i].dateOfDeparture = d + '/' + m + '/' + y ;
  send.carton.units[i].status = 'Sending to ' + send.recp ;  
  send.carton.units[i].trackrecord.push(track);
  }
              
  	send.carton.trackrecord= trackarr ;

    // Get the asset registry for the asset.
    return getAssetRegistry('org.acme.mynetwork.Carton')
        .then(function (assetRegistry) {

            // Update the asset in the asset registry.
            return assetRegistry.update(send.carton);

        }).then(function() {      
      for(var i=0;i< send.carton.units.length; i++){
           return getAssetRegistry('org.acme.mynetwork.Unit').then(function (unitRegistry) {
           return unitRegistry.get(send.carton.units[i].unitId) ;
           }).then(function(unitobj){
        unitobj.status = 'Sending to '+ send.recp;
             unitobj.dateOfDeparture = send.carton.dateOfDeparture ;
             unitobj.recipient = send.carton.recipient ;
             unitobj.trackrecord.push(track)
        return getAssetRegistry('org.acme.mynetwork.Unit').then(function (unitReg) {
        return unitReg.update(unitobj)
        })
           
         
    });
}
        })
}

/**
 * Track the trade of a commodity from one trader to another
 * @param {org.acme.mynetwork.MakeCarton} make - the trade to be processed
 * @transaction
 */


function makeCarton(make) {
var carton = getFactory().newResource('org.acme.mynetwork','Carton',make.Id);
 //carton.cartonId = make.Id ;
 /* var unitobjs = new Array() ;
   for(var i=0; i < make.unit.length ; i++) {
   var unitobj = getFactory().newResource('org.acme.mynetwork','Unit',make.unit[i].unitId) ;
     unitobj.cartonId = make.Id ;     
   unitobj = getFactory().newRelationship('org.acme.mynetwork','Unit',make.unit[i].unitId) ;
     unitobjs.push(unitobj) ;
   } */
  
  carton.units = make.unit //unitobjs ;
  
  // getFactory().newRelationship('org.acme.mynetwork','Unit',make.unit[i].unitId)
  //for(var i=0; i < make.unit.length ; i++) {  
  carton.manufacturerId= make.unit[0].manufacturerId ;
  carton.currentOwner = make.unit[0].currentOwner ;
  carton.status = 'At '+ make.unit[0].currentOwner ;
 // }
 
 
 return getAssetRegistry('org.acme.mynetwork.Carton').then(function (assetRegistry) {
    // Update the asset in the asset registry.
    return assetRegistry.add(carton).then(function() {
         for(var i=0; i < make.unit.length ; i++) {
           var unitobj ;
        return getAssetRegistry('org.acme.mynetwork.Unit').then(function (unitRegistry) {
           
               // var unitobj = getFactory().newResource('org.acme.mynetwork','Unit',make.unit[i].unitId) ;
            // var unitobj = getAssetRegistry('org.acme.mynetwork.Unit').then(function(unitobj){
        
          return unitRegistry.get(make.unit[i].unitId) ;
          
          //unitobj.cartonId = make.Id ;      
          //return unitRegistry.update(unitobj);
               })
               //unitRegistry.get(make.unit[i].unitId);         
        
          .then(function(unitobj){
        unitobj.cartonId = make.Id;
        return getAssetRegistry('org.acme.mynetwork.Unit').then(function (unitReg) {
        return unitReg.update(unitobj)
        })
          
          //return unitRegistry.update(unitobj);
        });
         }
    });
});
}