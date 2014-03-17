var ListeJeu = [];
var nbJeu = 1;
var texte;
var NomJoueur;
var Couleur;
var score;

function Jeu(){
    
//Initialisation des variables de l'instance

this.largeur = 7;
this.hauteur = 6;
this.tableau = [];
this.turn = 1;
this.reset = 1;
this.plateau = document.querySelector('#plateau').appendChild(document.createElement("div"));
this.table = this.plateau.appendChild(document.createElement("span")).appendChild(document.createElement("table"));

//Création et affichage du plateau

for ( var i = 0 ; i < this.hauteur ; i++ ) {
    var ligne = this.table.appendChild(document.createElement("tr"));
    var lignes = [];
    for ( var j = 0 ; j < this.largeur ; j++ ) {
        lignes[j] = ligne.appendChild(document.createElement("td"));
        lignes[j].dataset['column'] = j;
        lignes[j].dataset['jeu'] = nbJeu;
    }
    this.tableau[i] = lignes;
}
nbJeu++;

//gestion des clics de la souris sur le plateau et déroulement du jeu en fonction

(this.table).onclick = function (event) {
    var column = event.target.getAttribute('data-column');
    var jeu = event.target.getAttribute('data-jeu');
    jeu = ListeJeu[jeu];
    if(column){
        if(jeu.reset)
            jeu.play.call(jeu,column);
    }
};

//fonction simulant l'arrivée d'un jeton du joueur dont c'est le tour dans la colonne column et vérification de l'état du plateau(victoire,égalité)

this.play = function(column){
    var i=this.hauteur-1;
    var noeud = (this.tableau[i])[column];
    while((noeud.className === "joueur1" || noeud.className === "joueur2")&&(i>0)){
        i = i-1;
        noeud = (this.tableau[i])[column];
    }
    if(i>0)
        this.placerJeton.call(this,noeud,i,column);
    else{
        if(noeud.className != "joueur1" && noeud.className != "joueur2")
            this.placerJeton.call(this,noeud,i,column);
    }
};

//fonction qui place un jeton a la bonne ligne et la bonne colonnee demnade la vérification de fin de partie et change de joueur

this.placerJeton = function(noeud,row,column){
    noeud.className = "joueur"+this.turn;
    this.GameOver.call(this,row,column);
    this.turn = 3-this.turn;
    
}

//fonction vérifiant que le jeu n'est pas fini

this.GameOver = function(row,column)
{
    if (this.isWin.call(this,row,column,0,1)||this.isWin.call(this,row,column,1,0)||this.isWin.call(this,row,column,-1,1)||this.isWin.call(this,row,column,1,1)){
        score[this.turn-1]++;
        ecrire_texte();
        texte.innerHTML += NomJoueur[this.turn-1]+" a gagne<br>";
    }
    else{
        var i = 0;
        for ( var j = 0 ; j < this.largeur ; j++ ) {
           if((this.tableau[i])[j].className != "joueur1" && (this.tableau[i])[j].className != "joueur2")
               return;
        }
        texte.innerHTML += "Egalite<br>";
    }
    this.reset = 0;
    restart();
};

//fonction demandant la vérification dans un direction et si une ligne dee 4 ou plus est trouve de faire flasher les pierres en question

this.isWin = function(row,column,a,b)
{
    if(this.testForWin.call(this,row,column,a,b,0)+this.testForWin.call(this,row,column,-a,-b,0)>2){
        this.testForWin.call(this,row,column,a,b,1);
        this.testForWin.call(this,row,column,-a,-b,1);
        return 1;
    }
    return 0;
};

//fonction calculant le nombre de jeton de la même couleur que le dernier joué dans une direction et fait flasher les pierres de cette direction si c = 1

this.testForWin = function(row,column,a,b,c){
    if (c)
        (this.tableau[row])[column].dataset['victoire'] = 'win';
    var i = +row + a;
    var j = +column +b;
    var test = 1;
    var temp = 0;
    while(i<this.hauteur && i>=0 && j>=0 && j<this.largeur && test){
        if(((this.tableau[i])[j]).className != ("joueur"+this.turn))
            test = 0;
        else{
            if (c)
                (this.tableau[i])[j].dataset['victoire'] = 'win';
            else
                temp++;
            i += a;
            j += b;
        }
    }
    return temp;
};
}

//fonction faisant apparaitre le bouton permettant de recommencer une partie tout en conservant les informations telles que les noms score et couleurs

function restart(){
    var temp =  "<form method=\"POST\" action=\"https://aws-project-c9-contiflo.c9.io/play\"><br>";
    temp +=         "<input type=\"hidden\" name=\"jou1\" value =\""+NomJoueur[0]+"\">";
    temp +=         "<input type=\"hidden\" name=\"jou2\" value =\""+NomJoueur[1]+"\">";
    temp +=         "<input type=\"hidden\" name=\"coul1\" value =\""+Couleur[0]+"\">";
    temp +=         "<input type=\"hidden\" name=\"coul2\" value =\""+Couleur[1]+"\">";
    temp +=         "<input type=\"hidden\" name=\"score1\" value =\""+score[0]+"\">";
    temp +=         "<input type=\"hidden\" name=\"score2\" value =\""+score[1]+"\">";
    temp +=         "<input type=\"submit\" value=\"Recommencer\"></form>";
    texte.innerHTML += temp;
}

//fonction permettant de récupérer les informations de noms couleurs et score contenu dans le html

function recup_info(){
    var info = document.querySelector('#plateau');
    NomJoueur = [ info.getAttribute('data-nom1'), info.getAttribute('data-nom2')];
    Couleur =  [info.getAttribute('data-coul1'), info.getAttribute('data-coul2')];
    score =  [info.getAttribute('data-score1'), info.getAttribute('data-score2')];
}

//fonction gérant l'espace texte dans lesquelles sont écrit les informations sur les joueurs

function ecrire_texte(){
    var temp = NomJoueur[0]+' '+"<span class=\"joueur1\" att=\"carre\"> <\/span>"+' : '+score[0]+'<br>';
    temp +=  NomJoueur[1]+' '+"<span class=\"joueur2\" att=\"carre\"> <\/span>"+' : '+score[1]+'<br>';
    texte.innerHTML = temp;
}

//function définissant les informations de couleurs dans la balise style du html

function define_coul(){
    var temp = ".joueur1{background-color:"+Couleur[0]+";}\n";
    temp += ".joueur2{background-color:"+Couleur[1]+";}";
    document.querySelector('#coul').innerHTML = temp;
}

//suite d'action qui permet de récuperer les informations, les afficher dans l'espace texte et de créer un nouveau plateau sur lequel se déroule la partie

document.querySelector('#Java').innerHTML = '';
recup_info();
define_coul();
texte =  document.querySelector('#plateau').appendChild(document.createElement("span"));
texte.className = "texte";
ecrire_texte();
ListeJeu[nbJeu] = new Jeu();

