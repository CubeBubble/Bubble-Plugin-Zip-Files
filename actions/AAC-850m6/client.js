function(properties, context) {

    const regex = /([^\/?#]+)(?=[?#]|$)/;
    var urls = properties.fileUrls.get(0, properties.fileUrls.length());
    let fileNames = [];

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };


    let promises = [];
    for (let i = 0; i < urls.length; i++) {
        fileNames.push(urls[i].match(regex)[0]);
        promises.push(fetch(urls[i], requestOptions));
    }
    
    Promise.all(promises)
        .then(function handleData(data) {
        var zip = new JSZip();
        for (let j = 0; j < data.length; j++) {
            zip.file(fileNames[j], data[j].blob());
        }
        zip.generateAsync({type:"blob"})
            .then(function(content) {
            saveAs(content, properties.directory + ".zip");
        });

    })
        .catch(function handleError(error) {
        console.log("Error : " + error);
    });



}