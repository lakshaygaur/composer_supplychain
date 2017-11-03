/**
 * Track the trade of a commodity from one trader to another
 * @param {org.acme.mynetwork.UpdateStatusWarehouse} update - the trade to be processed
 * @transaction
 */
function updateStatus(update){
  update.carton.status = 'At '+update.carton.recipient ;
  update.carton.currentOwner = update.carton.recipient ; 
  update.carton.recipient = '' ;
  for(var i=0; i <update.carton.units.length ; i++) {
  	update.carton.units[i].status = 'At '+update.carton.recipient ;
  	update.carton.units[i].currentOwner = update.carton.recipient ;
    update.carton.units[i].recipient = '' ;
  	}
  return getAssetRegistry('org.acme.mynetwork.Carton')
        .then(function (assetRegistry) {

            // Update the asset in the asset registry.
            return assetRegistry.update(update.carton);
        }).then(function(){
   for(var i=0;i< update.carton.units.length; i++){
           return getAssetRegistry('org.acme.mynetwork.Unit').then(function (unitRegistry) {
           return unitRegistry.get(update.carton.units[i].unitId) ;
           }).then(function(unitobj){
           unitobj.status = 'At '+update.carton.recipient ;
             unitobj.currentOwner = update.carton.recipient ;
             unitobj.recipient = '';
             return getAssetRegistry('org.acme.mynetwork.Unit').then(function (unitreg) {
             unitreg.update(unitobj)})
           })
   }
})
}

