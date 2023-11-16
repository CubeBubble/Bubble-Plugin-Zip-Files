function(instance, properties, context) {

    instance.publishState("loading", true);
    
    const urls = properties.urls.get(0, properties.urls.length());
    const names = properties.names.get(0, properties.names.length());
    var newNames = []

    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    let promises = [];
    
    for (let i = 0; i < urls.length; i++) {
        promises.push(fetch(urls[i], requestOptions));
    }
    
    Promise.all(promises)
        .then(function handleData(data) {
        var zip = new JSZip();
        for (let j = 0; j < data.length; j++) {
            var name = names[j]
            while(newNames.includes(name)) {
                name = name.split('.')[0] + ' (1).' + name.split('.')[1]
            }
            newNames.push(name)
            zip.file(name, data[j].blob());
        }
        zip.generateAsync({type:"blob"})
            .then(function(content) {
            saveAs(content, properties.directoryName + ".zip");
   			instance.publishState("loading", false);

        });

    })
        .catch(function handleError(error) {
        console.log("Error : " + error);
    });



}