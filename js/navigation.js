
var htmlSeiten = ["index.html","bootsverleih.html","bootsquiz.html","kontakt.html","impressum.html"];

function navigationEventhandler ()
{
	var allNavLists = document.querySelectorAll("nav li");
	
	//ein click eventlistener für die großen listenflächen
	//beim for-loop kommt ein undefiend fehler, deshalb ohne schleife gelöst:
	allNavLists[0].onclick = function() { window.location.href = htmlSeiten[0];};
	allNavLists[1].onclick = function() { window.location.href = htmlSeiten[1];};
	allNavLists[2].onclick = function() { window.location.href = htmlSeiten[2];};
	allNavLists[3].onclick = function() { window.location.href = htmlSeiten[3];};
	allNavLists[4].onclick = function() { window.location.href = htmlSeiten[4];};
}