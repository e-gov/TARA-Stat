function alusta() {

  /**
   * Päri statistika serveripoolelt ja kuva
   */
  $('#perioodiMuster').on('keydown', (e) => {
    if (e.keyCode == 13) {
      pariStatistika();
    }
  });
  
  $('#sooritaNupp').click(() => {
    pariStatistika();    
  });

  function pariStatistika() {
    function kuvaKirjed(kirjed) {
      var t = $('<table><tr>' +
      '<th>klientrakendus</th>' +
      '<th>autentimismeetod</th>' +
      '<th>pank</th>' +
      '<th>sündmus</th>' +
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
        .text(kirjed[i]._id.bank)
        .appendTo(r);
        $('<td></td>')
        .text(kirjed[i]._id.operation)
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
                  "operation": "START_AUTH", "ERROR" või ""SUCCESSFUL_AUTH"
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

  }
  
  function pariKirjeteArv() {
    var url = '/kirjeid';
    $.getJSON(url,
      (data, status, xhr) => {
        /* Saadud andmed on kujul
        { "kirjeid": 1 }
        */
       $('#Kirjeid').text(JSON.stringify(data.kirjeid));
      }
    );
  }

  pariKirjeteArv();
}