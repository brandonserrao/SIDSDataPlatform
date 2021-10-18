//changes opacity on slide

$('#opacity').on("change mousemove", function () {
    console.log($(this).val());
    map.setPaintProperty(currentGeojsonLayers.hexSize, 'fill-opacity', ($(this).val() * 0.01))
    if (map.getLayer('ocean')) {
        //console.log('hi');
        map.setPaintProperty('ocean', 'fill-opacity', ($(this).val() * 0.1))

    }
})