function alusta() {

  /**
   * Päri statistika serveripoolelt ja kuva
   */
  $('#sooritaNupp').click(() => {

    function kuvaKirjed(kirjed) {
      var t = $('<table><tr>' +
      '<th>klientrakendus</th>' +
      '<th>autentimismeetod</th>' +
      '<th>autentimisi</th>' +
      '</tr></table>');
      for (var i = 0; i < kirjed.length; i++) {
        var r = $('<tr></tr>');
        r.appendTo(t);
        $('<td></td>')
        .text(kirjed[i]._id.clientId)
        .appendTo(r);
        $('<td></td>')
        .text(kirjed[i]._id.method)
        .appendTo(r);
        $('<td></td>')
        .text(kirjed[i].kirjeteArv)
        .appendTo(r);
      }
      $('#Tulem').html(t);
    }

    var perioodiMuster = $('#perioodiMuster').val();

    /* Piisab tee andmisest. See lisatakse allik-URL-le (origin) */
    var url = '/stat';
    if (perioodiMuster && perioodiMuster.length > 0) {
      url = url + '?p=' + perioodiMuster;
    }
    // console.log('url: ' + url);

    // Puhasta eelmine tulem
    $('#Tulem').html('');

    $.getJSON(url,
      (data, status, xhr) => {
        /* Saadud andmed on kujul
          { "kirjed":
            [
              {
                "_id": {
                  "clientId": "klientrakendus A",
                  "method": "eIDAS"
                },
                "kirjeteArv": 1
              },
              ...
            ]
          }
        */
        var kirjed = data.kirjed;
        kuvaKirjed(kirjed);
      }
    );
    
  });

}