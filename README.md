Mobile-fe
=========

Frontend repo for mobile project

## Dokumentation
Für unser Projekt "Rum" (Reisen und Mehr) haben wir eine Android App entwickelt. Diese beruht auf den Frameworks Cordova/Phonegap, Angular und Ionic. Zudem benutzen wir für das Backend einen Heroku-Server, auf dem Node.js läuft. 

Die App soll es dem Nutzer ermöglichen eine Reise zu planen. Dabei kann er verschiedene Städte und, in den Städten, einzelne Sehenswürdigkeiten einfügen, die er besuchen möchte. Zusätzliche Funktionen sind unter anderem Benutzerverwaltung (Login/Register), das Hinzufügen weiterer Personen zu der Reise (die diese dann mitbearbeiten können), ein Chat für jede Reise, ein Kalenderexport, das automatische Vorschlagen von Sehenswürdigkeiten in den Städten und die automatische Optimierung einer Route.

Um die einzelnen Funktionalitäten der Applikation näher zu erläutern gehen wir das Ganze an einem Beispiel durch:

###Login/Register
Der Einstiegspunkt der App ist der Login-View, auf dem kann der Nutzer den Benutzernamen und Password eines bereits existierenden Nutzers eingeben und sich mit dem Klick auf "Login" anmelden. Dabei wird im 'loginController' überprüft ob ein Name und Password eingegeben sind [verfiyLoginButton()] und der Nutzer wird eingeloggt [login()].
Für das eigentliche Anmelden am Server wird allerdings der 'loginService' verwendet. Dieser nimmt die Daten auf und schickt die login-Anfrage an das Backend [login()]. In dem Backend wird eine Session für den Nutzer erstellt, sodass dieser sich nicht bei jedem Öffnen der App neu anmelden muss (wenn Session noch vorhanden). Außerdem setzt der 'loginService' die Logout Funktion um, dass den Nutzer beim Server abmeldet und die Session beendet.
Für den ersten Gebrauch muss ein neuer Nutzer registriert werden. Dazu geht man zur Registrierung (register.html und registerController.js). Auf diesem Bildschirm werden nun alle Nutzerdaten eingegeben werden und die Registrierung getriggert werden [register()]. Diese Funktion überprüft zunächst ob die optionalen Daten angegeben wurden (Telefonnummer) und fragt gegebenenfalls ob der Nutzer diese noch ändern möchte. Danach wird der eigentliche Registrierungsvorgang gestartet [doRegistration] der den Nutzer im Backend registriert und einloggt. Zusätzlich wird von dem Controller verifiziert ob alle notwendigen Daten angegeben wurden, ob die Email ein gültiges Format besitzt und ob die beiden Passwörter übereinstimmen [verifyRegisterButton]. 

### Menü
Alle folgenden Views haben eine gemeinsame Header-Leiste, sowie ein Menü auf der linken Seite und einen Chat auf der Rechten Seite (erst nachdem Trip asugewählt ist). Diese Gemeinsamkeit ist im menu.html und menuController.js. 
In der Kopfzeile, der ion-nav-bar, wird zunächst auf der linken Seite ein Button zum Öffnen des Menüs angezeigt. Dieses Menü ist ein Side-Menu, auf der linken Seite, dass jederzeit durch den Nutzer von links reingeslided werden kann. Dieses enthält Funktionen, wie die Navigation zum Home-Screen (tripList), zu der Einstellungsseite (auf dieser kann die sprache in Englisch oder Deutsch geändert werden; die komplette App ist in beide Sprachen übersetzt) und einen Logout-Button.
Sobald eine Navigation durchgeführt wurde, ersetzt ein Back-Button den Button für das Menü (dieses ist noch über das Sliden erreichbar). Der Back-Button ermöglicht es dem Nutzer zum vorherigen Screen zurückzukehren. Lediglich der Login und Register-Screen ist über diesen nicht erreichbar.
Auf der Rechten Seite der Ion-Nav-Bar befindet sich ein Button für das Kontext Menü, dieses ermöglicht das Reordern und optimale Andordnen von Einträgen (wenn eine Liste angezeigt wird) und die Navigation zum Kalenderexport (sobald ein Trip ausgewählt wurde;siehe Kalenderexport).
Ein weiterer Button auf der Rechten Seite ermöglicht das aufsliden des rechten Side-Menu, in dem sich ein Chat befindet [ siehe Chat]. Dieser wird ebenfalls nur angezeigt sobald ein Trip asugewählt wurde.

### triplist
Nachdem der Nutzer eingeloggt ist, kommt man zu dem Home-Screen, der tripList

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
