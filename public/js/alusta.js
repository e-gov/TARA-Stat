function alusta() {

  // Nuppude käsitlejad
  $('#perioodiMuster').on('keydown', (e) => {
    if (e.keyCode == 13) {
      pariStatistika();
    }
  });

  $('#standardstatNupp').click(() => {
    pariStandarStat();
  });

  $('#sooritaNupp').click(() => {
    pariStatistika();
  });

  $('#abiteabeNupp').click(() => {
    $('#abiteave').removeClass('peidetud');
  });

  $('#sulgeAbiteaveNupp').click(() => {
    $('#abiteave').addClass('peidetud');
  });

  $('#suleTeadeNupp').click(() => {
    $('#suleTeadeNupp').addClass('peidetud');
    $('#teateriba').addClass('peidetud');
    pariKirjeteArv();
  });

  $('#uuendaNupp').click(() => {
    pariKirjeteArv();
  });

  $('#kustutaNupp').click(() => {
    // Küsi kinnitust
    $('#teade')
      .removeClass('info')
      .addClass('viga')
      .text('Logikirjete kustutamist ei saa tagasi võtta. ' +
        'Kinnita, et tahad kustutada');
    $('#uuendaNupp').addClass('peidetud');
    $('#kinnitusNupp').removeClass('peidetud');
    $('#tyhistusNupp').removeClass('peidetud');
    $('#teateriba').removeClass('peidetud');
  });

  $('#kinnitusNupp').click(() => {
    $('#kinnitusNupp').addClass('peidetud');
    $('#tyhistusNupp').addClass('peidetud');
    kustutaKirjed();
    $('#teateriba').addClass('peidetud');
  });

  $('#tyhistusNupp').click(() => {
    $('#uuendaNupp').removeClass('peidetud');
    $('#kinnitusNupp').addClass('peidetud');
    $('#tyhistusNupp').addClass('peidetud');
    $('#teade')
      .removeClass('viga')
      .addClass('info')
      .text('');
    $('#teateriba').addClass('peidetud');
    pariKirjeteArv();
  });

  function pariStatistika() {

    function kuvaAutentimisteArv(kirjed) {
      var a = 0;
      for (var i = 0; i < kirjed.length; i++) {
        if (kirjed[i]._id.operation == 'SUCCESSFUL_AUTH') {
          a = a + parseInt(kirjed[i].kirjeteArv);
        }
      }
      $('#AutentimisteArv').text('Edukaid autentimisi kokku: ' +
        JSON.stringify(a));
    }

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

    // Puhasta eelmine tulem
    $('#Tulem').text('');
    $('#AutentimisteArv').text('');

    $.getJSON(url,
      (data, status, xhr) => {
        /* Saadud andmed on kujul
          { "kirjed":
            [
              {
                "_id": {
                  "clientId": "klientrakendus A",
                  "method": "eIDAS"
                  "operation": "START_AUTH", "ERROR" või "SUCCESSFUL_AUTH"
                },
                "kirjeteArv": 1
              },
              ...
            ]
          }
        */
        var kirjed = data.kirjed;
        kuvaKirjed(kirjed);
        kuvaAutentimisteArv(kirjed);
      }
    );

  }

  /** Päring logibaasist edukate autentimiste arvu jooksval 
   * päeval ja jooksval kuul ning kuvab kasutajale.
   * 
   */
  function pariStandarStat() {
    // Teeme kaks AJAX-päringut /standard otspunkti vastu.

    var d = new Date(Date.now());
    // getMonth() annab 0..11
    var k = (parseInt(d.getMonth()) + 1).toString();
    // Vajadusel lisa esinull
    if (k.length == 1) { k = '0' + k }
    // getDate() annab 1..31
    var p = d.getDate().toString();
    // Vajadusel lisa esinull
    if (p.length == 1) { p = '0' + p }
    var paevaMuster = d.getFullYear() + '-' +
      k + '-' + p;

    $.getJSON('/standard?p=' + paevaMuster,
      (data, status, xhr) => {
        if (status == "success") {
          /* Saadud andmed on kujul
          { "kirjeid": 1 }
          */
          $('#edukaidTana').text(JSON.stringify(data.kirjeid));
        }
        else {
          // Päring ebaõnnestus, tühjenda andmed
          $('#edukaidTana').text('');
        }
      }
    );

    var kuuMuster = d.getFullYear() + '-' + k;

    $.getJSON('/standard?p=' + kuuMuster,
      (data, status, xhr) => {
        if (status == "success") {
          /* Saadud andmed on kujul
          { "kirjeid": 1 }
          */
          $('#edukaidKuul').text(JSON.stringify(data.kirjeid));
        }
        else {
          // Päring ebaõnnestus, tühjenda andmed
          $('#edukaidKuul').text('');
        }
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
        $('#kirjeidLogibaasis').
          text(JSON.stringify(data.kirjeid));
      }
    );
  }

  function kustutaKirjed() {
    /* Piisab tee andmisest. See lisatakse allik-URL-le (origin) */
    var url = '/kustuta';
    var perioodiMuster = $('#perioodiMuster').val();
    if (perioodiMuster && perioodiMuster.length > 0) {
      url = url + '?p=' + perioodiMuster;
    }

    // Puhasta eelmine tulem
    $('#Tulem').text('');
    $('#AutentimisteArv').text('');

    $.getJSON(url,
      (data, status, xhr) => {
        /* Saadud andmed on kujul
        { "kustutati": 1 }
        */
        $('#teade')
          .removeClass('viga')
          .addClass('info')
          .text('Kustutati ' +
            data.kustutati.toString() +
            ' kirjet.');
        $('#suleTeadeNupp').removeClass('peidetud');
        $('#teateriba').removeClass('peidetud');
      }
    );
  }

  pariKirjeteArv();
  pariStandarStat();
}