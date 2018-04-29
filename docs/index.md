# Mikroteenuste arhitektuuri poole

Päev 1

TARA-Stat on eksperimentaalne mikroteenus TARA statistika tootmiseks ja vaatamiseks.

## Statistikakasutaja UI

<img src='docs/Capture.PNG' width= "650">

## Üldistatud arhitektuur

<img src='docs/Arhi.PNG' width= "500">

Vt ka [TARA kasutusstatistika](https://e-gov.github.io/TARA-Doku/Statistika) (spetsifikatsioon).

## Logikirje lisamine

Saata `POST` päring `localhost:5000` (või paigaldusaadressil), mille kehas on JSON kujul

`{ "aeg": ..., "klient": ..., "meetod": ... }`

Näiteks, [httpie](https://httpie.org/) abil:

`http POST :5000 aeg=2018-04-29T00:00:30 klient=e-teenusA meetod=mobileID`

## Statistika arvutamine

- Statistikakasutaja sirvikus avada leht `localhost:5000` (või paigaldusaadressil).
- Määrata periood (võib jääda ka tühjaks)
  - sisestades regulaaravaldise
  - nt `2018-04` valib 2018. a aprilli logikirjed
  - vajutada nupule
  - kuvatakse autentimiste arv perioodi jooksul klientrakenduste lõikes

## Elutukse

Päringu `localhost:5000/status` saamisel kontrollitakse logibaasi ülevalolekut. Kui logibaas on üleval, siis tagastatakse HTTP vastus `200` `OK`, vastasel korral `500` `Internal Server Error`.