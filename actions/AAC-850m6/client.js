function(properties, context) {

    const regex = /([^\/?#]+)(?=[?#]|$)/;
    var urls = properties.urls.get(0, properties.urls.length());
    console.log(urls);
    let filenames = [];

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };


    let promises = [];
    for (let i = 0; i < urls.length; i++) {
        filenames.push(urls[i].match(regex)[0]);
        promises.push(fetch(urls[i], requestOptions));
    }
    
    Promise.all(promises)
        .then(function handleData(data) {
        var zip = new JSZip();
        for (let j = 0; j < data.length; j++) {
            zip.file(filenames[j], data[j].blob());
        }
        zip.generateAsync({type:"blob"})
            .then(function(content) {
            saveAs(content, properties.filename + ".zip");
        });

    })
        .catch(function handleError(error) {
        console.log("Error : " + error);
    });



}