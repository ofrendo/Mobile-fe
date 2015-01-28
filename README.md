Mobile-fe
=========

Frontend repo for mobile project

## Dokumentation
Für unser Projekt "Rum" (Reisen und Mehr) haben wir eine Android-App entwickelt. Diese beruht auf den Frameworks Apache Cordova / Phonegap, AngularJS und Ionic. Zudem einen Heroku-Server mit Node.js als Backend. 

Die App soll es dem Nutzer ermöglichen, eine Reise zu planen. Dabei kann er einer Reise verschiedene Städte und, in den Städten, einzelne Sehenswürdigkeiten hinzufügen, die er besuchen möchte. Zusätzliche Funktionen sind unter anderem eine Benutzerverwaltung (Login/Register), das Hinzufügen weiterer Personen zu der Reise (die diese dann mitbearbeiten können), ein Chat für jede Reise, ein Kalenderexport, das automatische Vorschlagen von Sehenswürdigkeiten in den Städten und die automatische Optimierung einer Route.

Im Folgenden werden die einzelnen Views und Funktionalitäten näher erläutert, die Namen der Controller und Views entsprechen zumeist der Funktion.

###Login/Register
Der Einstiegspunkt der App ist der Login-View, auf dem der Nutzer den Benutzernamen und Password eines bereits existierenden Nutzers eingeben und sich mit dem Klick auf "Login" anmelden kann. Dabei wird im 'loginController' überprüft, ob ein Name und Password eingegeben sind `verfiyLoginButton()`, woraufhin der Nutzer eingeloggt wird `login()`.
Für das eigentliche Anmelden am Server wird allerdings der 'loginService' verwendet. Dieser nimmt die Daten auf und schickt die login-Anfrage an das Backend `login()`. Im Backend wird eine Session für den Nutzer erstellt, sodass dieser sich nicht bei jedem Öffnen der App neu anmelden muss (wenn die Session noch nicht abgelaufen ist). Außerdem setzt der 'loginService' die Logout-Funktion um, die den Nutzer beim Server abmeldet und die Session beendet.
Für den ersten Gebrauch muss ein neuer Nutzer registriert werden. Dazu geht man zur Registrierung (register.html und registerController.js). Auf diesem Bildschirm werden nun alle Nutzerdaten eingegeben werden und die Registrierung getriggert `register()`. Diese Funktion überprüft zunächst, ob die optionalen Daten angegeben wurden (Telefonnummer) und fragt gegebenenfalls, ob der Nutzer diese noch ändern möchte. Danach wird der eigentliche Registrierungsvorgang gestartet `doRegistration`, der den Nutzer im Backend registriert und einloggt. Zusätzlich wird vom Controller verifiziert, ob alle notwendigen Daten angegeben wurden, ob die Email ein gültiges Format besitzt und ob die beiden Passwörter übereinstimmen `verifyRegisterButton`. 

### Menü
Alle folgenden Views haben eine gemeinsame Header-Leiste, sowie ein Menü auf der linken Seite und einen Chat auf der Rechten Seite (erst nachdem Trip ausgewählt ist). 
In der Kopfzeile, der ion-nav-bar, wird zunächst auf der linken Seite ein Button zum Öffnen des Menüs angezeigt. Dieses Menü ist ein Side-Menu, auf der linken Seite, dass jederzeit durch den Nutzer von links reingezogen werden kann. Dieses enthält Funktionen, wie die Navigation zum Home-Screen (tripList), zu der Einstellungsseite (auf dieser kann die Sprache in Englisch oder Deutsch geändert werden - die komplette App ist in beide Sprachen übersetzt; Zusätzlich können hier Nutzerdaten angepasst werden) und einen Logout-Button.
Sobald eine Navigation durchgeführt wurde, ersetzt ein Back-Button den Button für das Menü (dieses ist noch über das Sliden erreichbar). Der Back-Button ermöglicht es dem Nutzer zum vorherigen Screen zurückzukehren. Lediglich der Login und Register-Screen ist über diesen nicht erreichbar.
Auf der Rechten Seite der Ion-Nav-Bar befindet sich ein Button für das Kontext Menü, dieses ermöglicht das Reordern und optimale Anordnen von Einträgen (wenn eine Liste angezeigt wird) und die Navigation zum Kalenderexport (sobald ein Trip ausgewählt wurde;siehe Kalenderexport).
Ein weiterer Button auf der rechten Seite ermöglicht das aufsliden des rechten Side-Menu, in dem sich ein Chat befindet siehe `Chat`. Dieser wird ebenfalls nur angezeigt sobald ein Trip asugewählt wurde.

### triplist
Nachdem der Nutzer eingeloggt ist, kommt er zu dem Home-Screen, der tripList.
Hier werden alle vorhandenen Trips, dieder Nutzer bereits angelegt hat angezeigt. Zu jedem Trip wird der Name, Start- und Enddatum, Anzahl der Städte in dem Trip und die Anzahl an Teilnehmern des Trips angezeigt. Wenn ein Trip ausgewählt wird gelangt man zu der Citylist. Mit dem Bearbeiten-Button auf der Rechten Seite jedes Eintrags kommt man zum EditTrip. Eine weitere Möglichkeit ist das Löschen der Einträge, das dadurch erreicht wird, indem der Eintrag nach links gezogen wird. Dann wird ein Delete-Button angezeigt, der das Löschen ermöglicht `deleteTrip()`.
Zunächst wird der Nutzer allerdings einen neuen Trip anlegen müssen. Dies geschieht über den Button in der Fußleiste.

#### addTrip
Im addTrip wird ein Neuer Eintrag hinzugefügt. Dafür werden ein Name, sowie Start- und Enddatum (beide optional) eingegeben, welche daraufhin im addTripController an das Backend übergeben werden.

#### editTrip
Sobald ein Trip angelegt ist, kann dieser auch bearbeitet werden. Hier kann, ähnlich wie beim Hinzufügen, der Name, sowie Start- und Enddatum geändert werden. 
Zusätzlich sieht man alle Teilnehmer der Reise und kann auch mit dem Betätigen des "Add User"-Buttons neue Teilnehmer hinzufügen.

####AddParticipant
Im addParticipant können User zu einem vorhandenem Trip hinzugefügt werden. 
Zum Einen geschieht dies über die Angabe einer Email-Adresse. 

Zum Anderen kann man Nutzer über die Kontaktliste seines Handys hinzufügen. Dafür wird zunächst die Kontaktliste ausgelesen `getContactList()` . Nun kann der Nutzer sich aus dieser Liste einen Kontakt auswählen, der eingeladen werden soll. 

Nach diesem Vorgang werden die User-Daten an das Backend geschickt `addUser()`. Nun wird entweder ein User zu einem Trip hinzugefügt (sollte der Kontakt bereits registriert sein), oder ein Dummy-User wird erstellt. Dieser Dummy enthält alle Daten, die zu diesem Zeitpunkt über den User bekannt sind: Email und/oder Telefonnummer. Sobald sich nun jemand mit diesen Daten registriert, wird der Dummy-Eintrag aktualisiert und der Benutzer ist sofort in dem Trip, in den er eingeladen wurde.

###cityList
Nun wurde, ein Trip erstellt und diesem möglicherweise weitere Nutzer hinzugefügt. Wenn nun ein Trip ausgewählt wird gelangt der Nutzer zu der cityList. 
Diese zeigt alle Städte an, die in der Reise beuscht werden sollen. Wie auch bei der tripList gibt es die Möglichkeit eine Stadt zu löschen, zu bearbeiten oder hinzuzufügen. Das Löschen funktioniert wiederum über das Ziehen des Eintrags nach links.
Für das Bearbeiten und Hinzufügen sind jeweils Buttons vorhanden die angewählt werden können.

In der cityList gibt es neben der eigentlichen Liste noch einen weiteren Tab, die Map. Hier wird über die Google-Maps-Api eine Route mit den vorhandenen Städten angezeigt, zusammen mit der Entfernung und Dauer, die der Trip beanspruchen würde. (siehe Mapservice)

####addCity
Um eine Stadt hinzuzufügen, muss zunächst eine über das obere Eingabefeld ausgewählt werden. Hier gibt der Nutzer den Namen der Stadt ein, die er hinzufügen möchte. Hierbei wird die Eingabe mit einem Autocorrect über Google-Maps unterstützt`autocomplete() und callGoogleAutocomlete()`. Aus der Liste an Vorschlägen wählt der Nutzer nun eine Stadt aus. Durch die Nutzung des Autocompletes von Google, werden direkt nähere Daten zu der Stadt (wie zum Beispiel die GoogleID und die Koordinaten) gespeichert. Zusammen mit einem Start- und Enddatum (optional) kann so nun die Stadt zu einem Trip hinzugefügt werden `addCity()`.

####editCity
Im editCity können das Start- und Enddatum des Besuches der Stadt verändert werden.

###locationList
Sobald eine Stadt zu einem Trip hinzugefügt wurde kann diese ausgewählt werden und der Nutzer gelangt zu der locationList, die jede einzelne Sehenswürdigkeit des Trips enthält. 
Hier sieht man zunächst in einem Tab eine Übersicht über alle Locations, die in der vorher ausgewählten Stadt besucht werden möchten. Ein Button in der Fußleiste ermöglicht die Navigation zum Hinzufügen von Locations. Zusätzlich können hier einzelne Locations bearbeitet und gelöscht werden.
Ein weiterer Tab ist wiederum die Map, wo eine Karte der ausgewählten Stadt gezeigt wird, mit einer Route entlang der verschiedenen Locations in dieser Stadt.
Der dritte Tab bietet verschiedene Vorschläge für Locations, die besucht werden können. Zunächst kann hier eine Kategorie ausgewählt werden, anhand derer die Vorschläge gefiltert werden. Aus der Liste an Vorschlägen kann nun eine Location in die LocationList übernommen werden.

####addLocation
Bei der addLocation ist, ähnlich wie beim addCity, wieder ein Google Autocomplete eingebunden. Wenn man in das Suchfeld nach einer Sehenswürdigkeit sucht, werden über Google verschiedene Locations Vorgeschlagen `autoComplete() und callGoogleAutocomplete()`. Aus der Liste von Vorschlägen, kann nun eine Location ausgewählt werden und die Daten (z.B. Koordinaten, Öffnungszeiten, Bilder, Adresse) werden automatisch von Google übernommen und gespeichert`addLocation()`. 
Zusätzlich kann noch ein Start- und Endzeitpunkt eingefügt werden.


####editLocation
In der EditLocation kann der Start- und Endzeitpunkt verändert werden (dies betrifft Datum und Uhrzeit).

####LocationDetail
Die LocationDetail-Ansicht sieht man sobald eine Location ausgewählt wurde. Hier werden einige Informationen über die jeweilige Location angezeigt (Adresse, Internetseite und gegebenenfalls Öffnungszeiten). Desweiteren wird eine Slideshow von Bildern dieser Location angezeigt `autoscroll()`.

###Chat
`Teil der menu.html; Controller: chat.js`
Ein Chatservice, der immer wenn ein Trip ausgewählt ist auf der Rechten Side-Bar angezeigt wird emöglicht eine Kommunikation zwischen den verschiedenen Teilnehmern eines Trips. Der Chat ist über Web-Sockets (socket.io) implementiert `nähere Informationen finden sich außerdem in der Backend-Dokumentation`. 
Eine besondere Möglichkeit ist hierbei, seinen eigenen Avatar anzeigen zu lassen. Dies geschieht über den Internet-Service gravatar.com. Dort kann man sich mit seiner E-Mail Adresse registrieren und einen Avatar hinterlegen. Wenn man nun die selbe E-Mail Adresse in unserer App verwendet, wird dieser Avatar unter anderem im Chat angezeigt. 

###Kalenderexport
Der Kalenderexport `export.js, export.html`, der über das Kontextmenü erreichbar ist, ermöglicht es, seine Reise in den Kalender zu schreiben. Dazu wird zunächst ein Name eingegeben (voreingestellt ist der Reisename) und möglicherweise der Reisezeitraum angepasst (Voreinstellung wiederum von der Reise). Danach betätigt man den Export und ein Eintrag wird im Kalender erstellt `doExport()`. Dieser Export funktioniert mit dem Plugin "Calendar-PhoneGap-Plugin" ( https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin ).


###Mapservice
Der Mapservice `maps.js` ermöglicht es uns in der CityList und der LocationList eine Google Maps Karte mit den verschiedenen Zielen anzuzeigen. Darin wird zunächst eine Map initialisiert `initMap()`, die von Google Maps geladen wird. Danach werden die verschiedenen Ziele in der jeweiligen Karte angezeigt und eine Route berechnet `showRouting()`. Zusätzlich werden die Gesamtdauer und Gesamtentfernung in Kilometern ausgegeben.






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
cordova plugin add https://github.com/katzer/cordova-plugin-email-composer.git
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
