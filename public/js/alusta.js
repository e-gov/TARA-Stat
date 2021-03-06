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

// Peida kõik alad, v.a ala
function ava(kast, ala) {
  [ // { valikukast, ala }
    { k: 'v1', a: 'yldstatistikaala' } ,
    { k: 'v2', a: 'detailstatistikaala' },
    { k: 'v3', a: 'kustutaala' },
    { k: 'v4', a: 'abiala' }
  ].forEach((i) => {
    $('#' + i.k).removeClass('valitud');
    $('#' + i.a).addClass('peidetud');
  });
  $('#' + kast).addClass('valitud');
  $('#' + ala).removeClass('peidetud');
}

function seaValikualaNupukasitlejad() {
  // Valikukastide käsitlejad
  $('#v1Nupp').click(() => {
    ava('v1', 'yldstatistikaala');
  });
  $('#v2Nupp').click(() => {
    ava('v2', 'detailstatistikaala');
  });
  $('#v3Nupp').click(() => {
    ava('v3', 'kustutaala');
  });
  $('#v4Nupp').click(() => {
    ava('v4', 'abiala');
  });
}

function seaNupuKasitlejad() {

  // Teade
  $('#suleTeadeNupp').click(() => {
    $('#suleTeadeNupp').addClass('peidetud');
    $('#teateriba').addClass('peidetud');
  });

  // Üldstatistika
  $('#uuendaNupp').click(() => {
    pariYldstatistika();
  });

  // Detailstatistika
  $('#perioodiMusterOtsi').on('keydown', (e) => {
    if (e.keyCode == 13) {
      pariStatistika();
    }
  });

  $('#sooritaNupp').click(() => {
    pariStatistika();
  });

  // Kustuta
  $('#kustutaNupp').click(() => {
    // Küsi kinnitust
    $('#kinnituseriba').removeClass('peidetud');
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
  });

}

// Pärib baasist ja kuvab üldstatistika
function pariYldstatistika() {
  /** edukaid autentimisi täna:
   *  käesoleval kuul:
   *  kirjeid logibaasis:
   *  logi peetud alates:
   * Teeme kaks AJAX-päringut /standard otspunkti vastu
   * ja päringu /kirjeid otspunkti vastu
   */

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

  // Päri edukaid autentimisi täna
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

  // Päri edukaid autentimisi käimasoleval kuul
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

  // Päri kirjete koguarv
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

  // Päri vanim kirje
  $.ajax({
    url: '/alates',
    method: 'GET',
    dataType: "json",
    data: null,
    error: (jqXHR, textStatus, errorThrown) => {
      $('#logiAlates').text('?');
      console.log('Serveri poole pöördumine ebaõnnestus: ',
        textStatus, ': ', errorThrown);
      kuvaTeade('Serveri poole pöördumine ebaõnnestus', 'viga');
    },
    success: (data, status, xhr) => {
      /* Saadud andmed on kujul
      { err: null või veateade, alates: string }
      */
      if (data.err === null) {
        $('#logiAlates').
          text(data.alates);
      }
      else {
        $('#logiAlates').text('?');
        console.log('/alates: ' + data.err);
        kuvaTeade(data.err, 'viga');
      }
    }
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

  var perioodiMuster = $('#perioodiMusterOtsi').val();

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

// Kustutab kirjed vastavalt mustrile
function kustutaKirjed() {
  // Tee lisatakse allik-URL-le (origin)
  var url = '/kustuta';
  var perioodiMuster = $('#perioodiMusterKustuta').val();
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

function alusta() {
  seaValikualaNupukasitlejad();
  seaNupuKasitlejad();
  pariYldstatistika();
}