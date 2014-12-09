Mobile-fe
=========

Frontend repo for mobile project

## Backend Github repo
https://github.com/ofrendo/Mobile


## Ionic - Grundeinstellungen:

Ionic installieren:
Console �ffnen
```
npm install -g ionic
```
eingeben und ausf�hren

Anschlie�end Projekt aus dem Git clonen.
Jetzt kann bereits eine Webversion angezeigt werden. Hierzu wird der Projektpfad in der Console ge�ffnet.
```
ionic serve 
```
Beim ersten Starten muss festegelegt werden, wo der Server laufen soll. Die Option "2" als lokaler Server ist zu empfehlen.

Anschlie�end wird die App als WebSite im Standardbrowser ge�ffnet.

Um das Projekt in Eclipse importieren zu k�nnen muss einmalig die Android platform hinzugef�gt werden.
Dazu den Projektordnerpfad in der Console �ffnen und anschlie�enden Befehl ausf�hren.
```
ionic platform add android
```
Jetzt kann das Projekt in eclipse importiert werden.

�nderungen werden NICHT im asset/www Ordner vollzogen, sondern im www Ordner!
Bei �nderungen am Coding �ndert sich automatisch auch die Website, wenn die App im Browser ge�ffnet wurde.

Um eine lauff�hige Android-App zu erstellen, sollte zun�chst eclipse geschlossen werden um Zugriffskonflikte zu vermeiden.
Anschlie�end wird der Projektordnerpfad in der Console ge�ffnet. 
```
ionic build android
```

Mit diesem Befehl wird die App gebaut und kann anschlie�end getestet werden.