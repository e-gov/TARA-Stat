---
permalink: Arhiiv
---

[httpie](https://httpie.org/) - HTTP käsureaklient.
- kasulik REST API-de uurimisel ja silumisel. Väidetavalt parem kui curl.
- eeldab: Python.
- käivimine: CLI-s http
- [dok-n](https://httpie.org/doc)

[RESTHEart](http://restheart.org/) - MongoDB veebiliides
- rakendus, mis ühendub MongoDB külge ja võimaldab REST API kaudu andmebaasi kasutada
- GNU Affero General Public License v3.0
- suhteliselt populaarne - [GitHub](https://github.com/softinstigate/restheart); dok-n enam-vähem
- sisaldab lihtsat UI-d (HAL Browser)
  - lokaalsesse masinasse paigaldamisel `http://127.0.0.1:8080/browser/`´
- endpoint lokaalses masinas: `localhost:8080` v `http://127.0.0.1:8080/`
- eeldab:
  - Java 8+ (kontrolli: `java -version`)
  - MongoDB (kontrolli: `mongod --version`)
- [paigaldusjuhend](http://restheart.org/learn/setup/#manual-installation-and-configuration) (käsitsi, mitte Docker-ga)
- [turvalisus: kliendi ühendamine RESTHeart-ga](http://restheart.org/learn/security/)


  const leiaKirjed = function (db, callback) {
    const collection = db.collection(COLLECTION);
    collection.find({}).toArray(function (err, kirjed) {
      if (err === null) {
        callback(kirjed);
      }
      else {
        console.log('ERR-02: Viga logibaasist lugemisel');
        res.render('pages/viga', { veateade: "ERR-02: Viga logibaasist lugemisel" });
      }
    });
  }

  const leiaKokku = function (db, callback) {
    const collection = db.collection(COLLECTION);
    collection.aggregate([{
      $count: "autentimisi"
    }])
      .toArray(function (err, kirjed) {
        if (err === null) {
          callback(kirjed);
        }
        else {
          console.log('ERR-02: Viga logibaasist lugemisel');
          res.render('pages/viga', { veateade: "ERR-02: Viga logibaasist lugemisel" });
        }
      });
  }


    $.ajax({
      url: url,
      type: "get",
      data: {
        p: perioodiMuster
      },
      success: (response) => {
        console.log('Edu');
      },
      error: (xhr) => {
        console.log('Viga');
      }
    });

    return;

    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(saadudJSON => {
        console.log('saadudJSON: ' + JSON.stringify(saadudJSON));
      })
      .catch(error => {
        console.log('Andmete saamine ebaõnnestus');
      });
    
    return;
    
 <i class="ikoon material-icons">show_chart</i>