



export function updateTooltips(hruData) {
    // let j = 0;

    window.map.eachLayer((layer) => {
        

        if (layer.feature?.properties?.HRUS) {

            //gets the name HRUS from the layers and uses it to select the lu_mgt but index as the layesr dont load in the same orders as the raw data
            let hru = parseInt(layer.feature.properties.HRUS)
           
            let hruLUM = hruData[hru - 1].lu_mgt.substr(0, hruData[hru-1].lu_mgt.length - 4).toUpperCase()
            layer.bindPopup(Object.keys(layer.feature.properties).map(function (k, i) {
                if (k === "Landuse") {
                    // console.log(hruData[j])
                    return k + ": " + hruLUM;

                } else {
                    return k + ": " + layer.feature.properties[k];
                }
            }).join("<br />"), {
                maxHeight: 200
            });
            // j++;
        }
    })
}

export default {
    updateTooltips
}