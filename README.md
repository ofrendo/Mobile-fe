Mobile-fe
=========

Frontend repo for mobile project

## Dokumentation
Für unser Projekt "Rum" (Reisen und Mehr) haben wir eine Android-App entwickelt. Diese beruht auf den Frameworks Apache Cordova / Phonegap, AngularJS und Ionic. Zudem einen Heroku-Server mit Node.js als Backend. 

Die App soll es dem Nutzer ermöglichen, eine Reise zu planen. Dabei kann er einer Reise verschiedene Städte und, in den Städten, einzelne Sehenswürdigkeiten hinzufügen, die er besuchen möchte. Zusätzliche Funktionen sind unter anderem eine Benutzerverwaltung (Login/Register), das Hinzufügen weiterer Personen zu der Reise (die diese dann mitbearbeiten können), ein Chat für jede Reise, ein Kalenderexport, das automatische Vorschlagen von Sehenswürdigkeiten in den Städten und die automatische Optimierung einer Route.

Um die einzelnen Funktionalitäten der Applikation näher zu erläutern, gehen wir das Ganze an einem Beispiel durch:

###Login/Register
Der Einstiegspunkt der App ist der Login-View, auf dem der Nutzer den Benutzernamen und Password eines bereits existierenden Nutzers eingeben und sich mit dem Klick auf "Login" anmelden kann. Dabei wird im 'loginController' überprüft, ob ein Name und Password eingegeben sind [verfiyLoginButton()], woraufhin der Nutzer eingeloggt wird [login()].
Für das eigentliche Anmelden am Server wird allerdings der 'loginService' verwendet. Dieser nimmt die Daten auf und schickt die login-Anfrage an das Backend [login()]. Im Backend wird eine Session für den Nutzer erstellt, sodass dieser sich nicht bei jedem Öffnen der App neu anmelden muss (wenn die Session noch nicht abgelaufen ist). Außerdem setzt der 'loginService' die Logout-Funktion um, die den Nutzer beim Server abmeldet und die Session beendet.
Für den ersten Gebrauch muss ein neuer Nutzer registriert werden. Dazu geht man zur Registrierung (register.html und registerController.js). Auf diesem Bildschirm werden nun alle Nutzerdaten eingegeben werden und die Registrierung getriggert [register()]. Diese Funktion überprüft zunächst, ob die optionalen Daten angegeben wurden (Telefonnummer) und fragt gegebenenfalls, ob der Nutzer diese noch ändern möchte. Danach wird der eigentliche Registrierungsvorgang gestartet [doRegistration], der den Nutzer im Backend registriert und einloggt. Zusätzlich wird vom Controller verifiziert, ob alle notwendigen Daten angegeben wurden, ob die Email ein gültiges Format besitzt und ob die beiden Passwörter übereinstimmen [verifyRegisterButton]. 

### Menü
Alle folgenden Views haben eine gemeinsame Header-Leiste, sowie ein Menü auf der linken Seite und einen Chat auf der Rechten Seite (erst nachdem Trip asugewählt ist). Diese Gemeinsamkeit ist im menu.html und menuController.js. 
In der Kopfzeile, der ion-nav-bar, wird zunächst auf der linken Seite ein Button zum Öffnen des Menüs angezeigt. Dieses Menü ist ein Side-Menu, auf der linken Seite, dass jederzeit durch den Nutzer von links reingeslided werden kann. Dieses enthält Funktionen, wie die Navigation zum Home-Screen (tripList), zu der Einstellungsseite (auf dieser kann die sprache in Englisch oder Deutsch geändert werden; die komplette App ist in beide Sprachen übersetzt) und einen Logout-Button.
Sobald eine Navigation durchgeführt wurde, ersetzt ein Back-Button den Button für das Menü (dieses ist noch über das Sliden erreichbar). Der Back-Button ermöglicht es dem Nutzer zum vorherigen Screen zurückzukehren. Lediglich der Login und Register-Screen ist über diesen nicht erreichbar.
Auf der Rechten Seite der Ion-Nav-Bar befindet sich ein Button für das Kontext Menü, dieses ermöglicht das Reordern und optimale Andordnen von Einträgen (wenn eine Liste angezeigt wird) und die Navigation zum Kalenderexport (sobald ein Trip ausgewählt wurde;siehe Kalenderexport).
Ein weiterer Button auf der Rechten Seite ermöglicht das aufsliden des rechten Side-Menu, in dem sich ein Chat befindet [ siehe Chat]. Dieser wird ebenfalls nur angezeigt sobald ein Trip asugewählt wurde.

### triplist
Nachdem der Nutzer eingeloggt ist, kommt er zu dem Home-Screen, der tripList (tripList.html und tripList.js).
Hier werden alle vorhandenem Trips, die er bereits angelegt hat angezeigt. Zu jedem Trip wird der Name, Start- und Enddatum, Anzahl der Städte in dem Trip und die Anzahl an Teilnehmern des Trips angezeigt. Wenn er einen Trip auswählt gelangt er zu der Citylist. Mit dem Bearbeiten-Button auf der Rechten Seite jedes Eintrags kommt man zum EditTrip. Eine weitere Möglichkeit ist das Löschen der Einträge, das dadurch erreicht wird, indem der Eintrag nach links gezogen wird. Dann wird ein Delete-Button angezeigt, der das Löschen ermöglicht [deleteTrip()].
Zunächst wird der Nutzer allerdings einen neuen Trip anlegen müssen. Dies geschieht über den Button am in der Fußleiste.

#### addTrip
Im addTrip wird ein Neuer Eintrag hinzugefügt. Dafür werden ein Name, sowie Start- und Enddatum (beide optional), welche daraufhin im addTripController an das Backend übergeben werden.

#### editTrip
Sobald ein Trip angelegt ist, kann dieser auch bearbeitet werden. Hier kann, ähnlich wie beim Hinzufügen, der Name, sowie Start- und Enddatum geändert werden. 
Zusätzlich sieht man alle Teilnehmer der Reise und kann auch mit dem Betätigen des "Add User"-Buttons neue Teilnehmer hinzufügen.

####AddParticipant
Im addParticipant können User zu einem vorhandenem Trip hinzugefügt werden. 
Zum Einen geschieht dies über die Angabe einer Email-Adresse. 

Zum Anderen kann man Nutzer über die Kontaktliste seines Handys hinzufügen. Dafür wird zunächst die Kontaktliste ausgelesen [getContactList()] . Nun kann der Nutzer sich aus dieser Liste einen Kontakt auswählen, der eingeladen werden soll. 

Nach diesem Vorgang werden die User-Daten an das Backend geschickt [addUser()]. Nun wird entweder ein User zu einem Trip hinzugefügt (sollte der Kontakt bereits registriert sein), oder ein Dummy-User wird erstellt. Dieser Dummy enthält alle Daten, die zu diesem Zeitpunkt über den User bekannt sind: Email und/oder Telefonnummer. Sobald sich nun jemand mit diesen Daten registriert, wird der Dummy-Eintrag aktualisiert und der Benutzer ist sofort in dem Trip, in den er eingeladen wurde.

###cityList

####addCity
####editCity

###locationList
####addLocation
####LocationDetail

### Chat

###Kalenderexport




## TODO

Unit Testing / Testing?

Sehenswürdigkeiten in der Nähe

## Unit Testing Information

http://www.ng-newsletter.com/advent2013/#!/day/19


## Backend Github repo
https://github.com/ofrendo/Mobile


## Ionic - Grundeinstellungen:

Ionic installieren:
Console öffnen
```
npm install -g ionic
```
eingeben und ausführen

Anschließend Projekt aus dem Git clonen.
Jetzt kann bereits eine Webversion angezeigt werden. Hierzu wird der Projektpfad in der Console geöffnet.
```
ionic serve 
```
Beim ersten Starten muss festegelegt werden, wo der Server laufen soll. Die Option "2" als lokaler Server ist zu empfehlen.

Anschließend wird die App als WebSite im Standardbrowser geöffnet.

Um das Projekt in Eclipse importieren zu können muss einmalig die Android platform hinzugefügt werden.
Dazu den Projektordnerpfad in der Console öffnen und anschließenden Befehl ausführen.
```
ionic platform add android
```
Jetzt kann das Projekt in eclipse importiert werden.

Änderungen werden NICHT im asset/www Ordner vollzogen, sondern im www Ordner!
Bei Änderungen am Coding ändert sich automatisch auch die Website, wenn die App im Browser geöffnet wurde.

Um eine lauffähige Android-App zu erstellen, sollte zunächst eclipse geschlossen werden um Zugriffskonflikte zu vermeiden.
Anschließend wird der Projektordnerpfad in der Console geöffnet. 
```
ionic build android
```

Mit diesem Befehl wird die App gebaut und kann anschließend getestet werden.

Um Ionic auf dem aktuellen Stand zu halten folgenden Befehl in die Console eintippen:
```
npm update -g ionic
```

## Ionic - Cordova Plugins hinzufügen

Um die notwendigen Plugins hinzuzufügen, den Projektpfad in der Console öffnen und die folgenden Befehle eingeben:

```
cordova plugin add org.apache.cordova.contacts
cordova plugin add com.chariotsolutions.toast.plugin
ionic plugin add https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin.git
cordova plugin add org.apache.cordova.geolocation
```

Dies muss jeder lokal in seinem Projekt durchführen, da dieses File im Gitignore nicht beachtet wird.

Damit die Berechtigungen auch tatsächlich der App verliehen werden, müssen im AndroidManifest.xml die Berechtigungen verschoben werden.
Diese werden falsch hinzugefügt und müssen unter die bestehende Berechtigung INTERNET angehängt werden.

## Show Toast
Shows an Android Toast Notification
```
toast.showShort(message);
toast.showLong(message);
```
Cancel an Android Toast Notification
```
toast.cancel();
```

## Kalender Plugin

Mehr Informationen auf:
https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin.git

## Location Plugin

Mehr Informationen auf:
https://github.com/apache/cordova-plugin-geolocation/blob/master/doc/index.md
