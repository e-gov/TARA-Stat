function alusta() {

  $('#sooritaNupp').click(() => {

    function kuvaKirjed(kirjed) {
      var t = $('<table><tr>' +
      '<th>klientrakendus</th>' +
      '<th>autentimisi</th>' +
      '</tr></table>');
      for (var i = 0; i < kirjed.length; i++) {
        var r = $('<tr></tr>');
        r.appendTo(t);
        $('<td></td>')
        .text(kirjed[i]._id)
        .appendTo(r);
        $('<td></td>')
        .text(kirjed[i].kirjeteArv)
        .appendTo(r);
      }
      $('#Tulem').html(t);
    }

    var perioodiMuster = $('#perioodiMuster').val();

    /* Piisab tee andmisest. See lisatakse allik-URL-le (origin) */
    var url = 'http://localhost:5000/stat';
    if (perioodiMuster && perioodiMuster.length > 0) {
      url = url + '?p=' + perioodiMuster;
    }
    console.log('url: ' + url);

    // Puhasta eelmine tulem
    $('#Tulem').html('');

    $.getJSON(url,
      (data, status, xhr) => {
        /* Saadud andmed on kujul
          {"kirjed":[{"_id":"e-teenusB","kirjeteArv":1},{"_id":"e-teenusA","kirjeteArv":1}]}
        */
        var kirjed = data.kirjed;
        kuvaKirjed(kirjed);
      }
    );
    
  });

}