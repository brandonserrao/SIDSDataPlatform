function focusRandomCountry() {
  console.log("focusing on random country");
  //replaced with focusRandomCountry()
  //used to focus map on random country
  //randomly loads a country to start with from sidsNames.js
  //this has some issues I think, can be done better
  //TODO EVALUATE RANDOMSTART CODE AND EXCISE TO SEPARATE FILE

  // var rando;
  let rando;

  function getRandomNumber() {
    return Math.round(Math.random() * (names.length - 0) + 0);
  }

  do {
    rando = getRandomNumber();
    var boun = new mapboxgl.LngLatBounds([
      names[rando].bb[0],
      names[rando].bb[1],
    ]);
    map.fitBounds(boun, {
      linear: true,
      padding: 100,
    });
  } while (nogos.includes(rando));
  {
    rando = getRandomNumber();
  }

  if (!nogos.includes(rando)) {
    console.log(names[rando]);
    console.log(rando);

    var boun = new mapboxgl.LngLatBounds([
      names[rando].bb[0],
      names[rando].bb[1],
    ]);
    map.fitBounds(boun, {
      linear: true,
      padding: 100,
    });
  }
}
