function kuvaTeade(teade, teateTyyp) {
  /** Kuva teade
   * @param teade
   * @param teateTyyp valikuline ('info' | 'viga')
   */
  $('#teade')
    .text(teade).removeClass('viga').addClass('info');
  if (teateTyyp && teateTyyp == 'viga') {
    $('#teade').removeClass('info').addClass('viga');
  }
  $('#suleTeadeNupp').removeClass('peidetud');
  $('#teateriba').removeClass('peidetud');
}

function seaNuppudeKasitlejad() {
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
}

// Pärib ja kuvab täieliku statistika, perioodimustri järgi
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

  // AJAX-päringutes parem kasutada ajax meetodit
  $.ajax({
    url: url,
    method: 'GET',
    dataType: "json",
    data: null,
    error: (jqXHR, textStatus, errorThrown) => {
      console.log('Serveri poole pöördumine ebaõnnestus: ',
        textStatus, ': ', errorThrown);
      kuvaTeade('Serveri poole pöördumine ebaõnnestus', 'viga');
    },
    success: (data, status, xhr) => {
      /* Saadud andmed on kujul
        { err: null või veateade,
          kirjed:
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
      if (data.err === null) {
        kuvaKirjed(data.kirjed);
        kuvaAutentimisteArv(data.kirjed);
      }
      else {
        console.log('/stat: ' + data.err);
        kuvaTeade(data.err, 'viga');
      }
    }
  });
}

// Päring kirjete koguarvu ja kuvab kasutajale
function pariKirjeteArv() {
  // AJAX-päringutes parem kasutada ajax meetodit
  $.ajax({
    url: '/kirjeid',
    method: 'GET',
    dataType: "json",
    data: null,
    error: (jqXHR, textStatus, errorThrown) => {
      $('#kirjeidLogibaasis').text('?');
      console.log('Serveri poole pöördumine ebaõnnestus: ',
        textStatus, ': ', errorThrown);
      kuvaTeade('Serveri poole pöördumine ebaõnnestus', 'viga');
    },
    success: (data, status, xhr) => {
      /* Saadud andmed on kujul
      { err: null või veateade, kirjeid: 1 }
      */
      if (data.err === null) {
        $('#kirjeidLogibaasis').
          text(JSON.stringify(data.kirjeid));
      }
      else {
        $('#kirjeidLogibaasis').text('?');
        console.log('/kirjeid: ' + data.err);
        kuvaTeade(data.err, 'viga');
      }
    }
  });
}

// Kustutab kirjed vastavalt mustrile
function kustutaKirjed() {
  // Tee lisatakse allik-URL-le (origin)
  var url = '/kustuta';
  var perioodiMuster = $('#perioodiMuster').val();
  if (perioodiMuster && perioodiMuster.length > 0) {
    url = url + '?p=' + perioodiMuster;
  }
  // Puhasta eelmine tulem
  $('#Tulem').text('');
  $('#AutentimisteArv').text('');

  // AJAX-päringutes parem kasutada ajax meetodit
  $.ajax({
    url: url,
    method: 'DELETE',
    dataType: "json",
    data: null,
    error: (jqXHR, textStatus, errorThrown) => {
      console.log('Serveri poole pöördumine ebaõnnestus: ',
        textStatus, ': ', errorThrown);
      kuvaTeade('Serveri poole pöördumine ebaõnnestus', 'viga');
    },
    success: (data, status, xhr) => {
      /* Saadud andmed on kujul
      { err: null v veateade,
        kustutati: 1 }
      */
      if (data.err === null) {
        kuvaTeade('Kustutati ' + data.kustutati.toString() +
          ' kirjet.', 'info');
      }
      else {
        console.log('/kustuta: ' + data.err);
        kuvaTeade(data.err, 'viga');
      }
    }
  });
}

/** Pärib baasist edukate autentimiste arvu jooksval 
 * päeval ja jooksval kuul ning kuvab kasutajale. */
function pariStandardStat() {
  // Teeme kaks AJAX-päringut /standard otspunkti vastu.

  // Koosta perioodimustrid (päeva ja kuu jaoks)
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
  var kuuMuster = d.getFullYear() + '-' + k;

  // AJAX-päringutes parem kasutada ajax meetodit
  $.ajax({
    url: '/standard?p=' + paevaMuster,
    method: 'GET',
    dataType: "json",
    data: null,
    error: (jqXHR, textStatus, errorThrown) => {
      $('#kirjeidLogibaasis').text('?');
      console.log('Serveri poole pöördumine ebaõnnestus: ',
        textStatus, ': ', errorThrown);
      kuvaTeade('Serveri poole pöördumine ebaõnnestus', 'viga');
      $('#edukaidTana').text('');
    },
    success: (data, status, xhr) => {
      /* Saadud andmed on kujul
      { err: null v veateade, kirjeid: 1 }
      */
      if (data.err === null) {
        $('#edukaidTana').text(JSON.stringify(data.kirjeid));
      }
      else {
        console.log('/standard: ' + data.err);
        kuvaTeade(data.err, 'viga');
      }
    }
  });

  // AJAX-päringutes parem kasutada ajax meetodit
  $.ajax({
    url: '/standard?p=' + kuuMuster,
    method: 'GET',
    dataType: "json",
    data: null,
    error: (jqXHR, textStatus, errorThrown) => {
      $('#kirjeidLogibaasis').text('?');
      console.log('Serveri poole pöördumine ebaõnnestus: ',
        textStatus, ': ', errorThrown);
      kuvaTeade('Serveri poole pöördumine ebaõnnestus', 'viga');
      $('#edukaidKuul').text('');
    },
    success: (data, status, xhr) => {
      /* Saadud andmed on kujul
      { err: null v veateade, kirjeid: 1 }
      */
      if (data.err === null) {
        $('#edukaidKuul').text(JSON.stringify(data.kirjeid));
      }
      else {
        console.log('/standard: ' + data.err);
        kuvaTeade(data.err, 'viga');
      }
    }
  });
}

function alusta() {
  seaNuppudeKasitlejad();
  pariKirjeteArv();
  pariStandardStat();
}